/* Plant Pathology Lab OS — service worker (Phase 07)
   Static, dependency-free, scoped to wherever index.html is served from.
   Cache names carry the application version and the data version, so a change to
   either replaces the caches instead of accumulating them. */
const APP_VERSION  = '8.3.0';
const DATA_VERSION = '3';                       /* must match window.DATA_VERSION in index.html */
const DEFERRED_VERSION = '2';                   /* questions.json and references.json are unchanged,
                                                   so their cache is not discarded by a core-data bump */
const TAG   = APP_VERSION + '-d' + DATA_VERSION;
const SHELL = 'labos-shell-' + TAG;             /* markup, script, styles, icons, fonts */
const CORE  = 'labos-core-'  + TAG;             /* the eight small datasets */
const RUN   = 'labos-run-d'  + DEFERRED_VERSION;    /* large datasets and anything else fetched:
                                                   keyed by the data version only, so an application
                                                   update does not force a 3.7 MB re-download */
const KEEP  = [SHELL, CORE, RUN];

const SHELL_FILES = [
  './', './index.html', './manifest.webmanifest',
  './assets/sciname.js', './assets/qr.js', './assets/logo-aau.png', './assets/emblem-baca.png', './photo.jpg',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/icons/icon-maskable-512.png',
  './assets/fonts/IBMPlexSans-Regular-Latin1.woff2', './assets/fonts/IBMPlexSans-Medium-Latin1.woff2',
  './assets/fonts/IBMPlexSans-SemiBold-Latin1.woff2', './assets/fonts/IBMPlexSans-Bold-Latin1.woff2',
  './assets/fonts/IBMPlexSans-Italic-Latin1.woff2',
  /* Greek subsets carry β, μ, α and friends, which appear throughout the scientific text;
     without them an offline visit fell back to a system font and logged a 504 */
  './assets/fonts/IBMPlexSans-Regular-Greek.woff2', './assets/fonts/IBMPlexSans-SemiBold-Greek.woff2',
  './assets/fonts/IBMPlexSans-Bold-Greek.woff2',
  /* Pi carries the symbols used in the text: degree, micro, approximately, arrows */
  './assets/fonts/IBMPlexSans-Regular-Pi.woff2', './assets/fonts/IBMPlexSans-SemiBold-Pi.woff2'
];
const CORE_FILES = ['sops','chemicals','formulations','protocols','safety','troubleshooting','quiz-nematology','taxa','culture-collection','reporting']
  .map(n => './data/' + n + '.json');
const DEFERRED = ['questions.json', 'references.json'];

/* the app requests JSON as data/x.json?v=N — the query string is dropped for the cache key
   so that one entry exists per file, not one per version string */
const keyFor = req => { const u = new URL(req.url); u.search = ''; return u.toString(); };
const isCore = path => CORE_FILES.some(f => path.endsWith(f.slice(1)));
const isDeferred = path => DEFERRED.some(f => path.endsWith('/data/' + f));

self.addEventListener('install', e => {
  /* prepare the new caches completely; if anything essential fails the install fails and
     the previous version keeps working */
  e.waitUntil((async () => {
    const shell = await caches.open(SHELL);
    await shell.addAll(SHELL_FILES);
    const core = await caches.open(CORE);
    await Promise.all(CORE_FILES.map(async f => {
      const r = await fetch(f + '?v=' + DATA_VERSION, { cache: 'reload' });
      if (!r.ok) throw new Error('core fetch failed: ' + f);
      await core.put(keyFor(new Request(f)), r.clone());
    }));
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.startsWith('labos-') && KEEP.indexOf(n) < 0).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

/* a network attempt that always settles: it fails fast when the browser reports no
   connection, and gives up after 20 s on a stalled one */
function tryNetwork(req, ms) {
  if (self.navigator && self.navigator.onLine === false) return Promise.reject(new Error('offline'));
  return Promise.race([
    fetch(req),
    new Promise((_, rej) => setTimeout(() => rej(new Error('network timeout')), ms || 20000))
  ]);
}

async function fromCache(cacheName, req) {
  const c = await caches.open(cacheName);
  return c.match(keyFor(req), { ignoreSearch: true });
}
async function putIfOk(cacheName, req, res) {
  if (res && res.ok && res.type === 'basic') {
    const c = await caches.open(cacheName);
    await c.put(keyFor(req), res.clone());
  }
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;     /* never cache third-party requests */

  /* navigation: fresh shell when online, cached shell when not */
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const net = await tryNetwork(req, 10000);
        const c = await caches.open(SHELL);
        c.put('./index.html', net.clone());
        return net;
      } catch (err) {
        return (await fromCache(SHELL, new Request('./index.html'))) ||
               (await caches.match('./index.html', { ignoreSearch: true })) ||
               new Response('Offline and no cached copy of the application.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  /* the two large datasets: network first, cached after the first successful download */
  if (isDeferred(url.pathname)) {
    e.respondWith((async () => {
      try {
        const net = await tryNetwork(req);
        if (!net.ok) return net;
        /* read the body once, store it, and answer from the same bytes: no stream races */
        const buf = await net.arrayBuffer();
        const headers = new Headers(net.headers);
        headers.set('Content-Type', 'application/json');
        const stored = new Response(buf, { status: 200, statusText: 'OK', headers: headers });
        try { const c = await caches.open(RUN); await c.put(keyFor(req), stored.clone()); } catch (err2) { /* quota */ }
        return stored;
      } catch (err) {
        const hit = await fromCache(RUN, req);
        if (hit) return hit;
        return new Response(JSON.stringify({ error: 'offline', detail: 'This dataset has not been downloaded yet.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } });
      }
    })());
    return;
  }

  /* core data and local assets: cache first, refreshed quietly in the background */
  e.respondWith((async () => {
    const bucket = isCore(url.pathname) ? CORE : SHELL;
    const hit = (await fromCache(bucket, req)) || (await fromCache(RUN, req));
    if (hit) {
      e.waitUntil((async () => {
        try { const net = await tryNetwork(req, 10000); await putIfOk(bucket, req, net); } catch (err) { /* offline: keep the cached copy */ }
      })());
      return hit;
    }
    try {
      const net = await tryNetwork(req, 10000);
      await putIfOk(isCore(url.pathname) ? CORE : RUN, req, net);
      return net;
    } catch (err) {
      return new Response('', { status: 504, statusText: 'Offline and not cached' });
    }
  })());
});
