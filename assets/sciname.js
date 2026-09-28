/* Plant Pathology Lab OS — scientific-name italics (Phase 05)
   Presentation only: text is never changed, only wrapped in <i class="sci">.
   Driven by the controlled dictionary in data/taxa.json. Works in the browser
   and in Node (for the QA report), sharing the same matching code. */
(function (root) {
  'use strict';
  var SUB = /^(\s+)(f\.\s?sp\.|pv\.|var\.|subsp\.|ssp\.)(\s+)([a-z][a-z-]*[a-z])/;
  var NEXT = /^(\s+)([a-z][a-z-]*[a-z])/;
  var AFTER = /^\s+(virus|viroid)\b/;

  function build(t) {
    var all = t.genera.concat(t.binomial_only).sort(function (a, b) { return b.length - a.length; });
    return {
      genus: new RegExp('(^|[^A-Za-z])(' + all.join('|') + ')(?![A-Za-z])', 'g'),
      abbr: /(^|[^A-Za-z.])([A-Z])\.\s?([a-z][a-z-]*[a-z])/g,
      bonly: new Set(t.binomial_only),
      ep: new Set(t.epithets),
      ab: t.abbreviations || {}
    };
  }

  /* Returns sorted, non-overlapping [start, end, kind] ranges to italicise. */
  function spans(text, d) {
    var out = [], m;
    function tail(end) {                       /* f. sp. / pv. / var. epithet */
      var s = SUB.exec(text.slice(end));
      if (s && d.ep.has(s[4])) {
        var st = end + s[1].length + s[2].length + s[3].length;
        out.push([st, st + s[4].length, 'infraspecific']);
      }
    }
    d.genus.lastIndex = 0;
    while ((m = d.genus.exec(text))) {
      var gs = m.index + m[1].length, ge = gs + m[2].length;
      var n = NEXT.exec(text.slice(ge));
      if (n && d.ep.has(n[2])) {
        var be = ge + n[1].length + n[2].length;
        if (AFTER.test(text.slice(be))) continue;          /* a virus species name — leave */
        out.push([gs, be, 'binomial']); tail(be);
      } else if (!d.bonly.has(m[2])) {
        out.push([gs, ge, 'genus']);
      }
    }
    d.abbr.lastIndex = 0;
    while ((m = d.abbr.exec(text))) {
      var ini = m[2], ep = m[3], okIni = d.ab[ep];
      if (!okIni || okIni.indexOf(ini) < 0) continue;
      var as = m.index + m[1].length, ae = as + m[0].length - m[1].length;
      if (AFTER.test(text.slice(ae))) continue;
      out.push([as, ae, 'abbreviated']); tail(ae);
    }
    out.sort(function (a, b) { return a[0] - b[0]; });
    var res = [], last = -1;
    for (var i = 0; i < out.length; i++) if (out[i][0] >= last) { res.push(out[i]); last = out[i][1]; }
    return res;
  }

  var api = { build: build, spans: spans };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; return; }

  /* ---------------- browser ---------------- */
  var SKIP = 'i,em,cite,code,pre,a,script,style,textarea,select,option,svg,.model,.nm,[data-nosci]';
  var dict = null;

  function formatText(node) {
    var p = node.parentElement;
    if (!p || p.closest(SKIP)) return;
    var txt = node.nodeValue;
    if (!txt || txt.length < 4 || !/[A-Z]/.test(txt)) return;
    var r = spans(txt, dict);
    if (!r.length) return;
    var frag = document.createDocumentFragment(), pos = 0;
    r.forEach(function (s) {
      if (s[0] > pos) frag.appendChild(document.createTextNode(txt.slice(pos, s[0])));
      var el = document.createElement('i'); el.className = 'sci';
      el.textContent = txt.slice(s[0], s[1]);
      frag.appendChild(el); pos = s[1];
    });
    if (pos < txt.length) frag.appendChild(document.createTextNode(txt.slice(pos)));
    p.replaceChild(frag, node);
  }
  function format(rootEl) {
    if (!dict || !rootEl) return;
    if (rootEl.nodeType === 3) { formatText(rootEl); return; }
    if (rootEl.nodeType !== 1 || rootEl.closest(SKIP)) return;
    var w = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT), list = [], n;
    while ((n = w.nextNode())) list.push(n);
    list.forEach(formatText);
  }
  function start(t) {
    dict = build(t);
    format(document.body);
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var mu = muts[i];
        if (mu.type === 'characterData') format(mu.target);
        else for (var j = 0; j < mu.addedNodes.length; j++) format(mu.addedNodes[j]);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  root.SciName = { build: build, spans: spans, format: format };
  fetch('data/taxa.json?v=' + (root.DATA_VERSION || '1'))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (t) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { start(t); });
      else start(t);
    })
    .catch(function () { /* no dictionary: names simply stay roman */ });
})(typeof window !== 'undefined' ? window : this);
