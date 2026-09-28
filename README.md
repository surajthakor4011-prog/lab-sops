# Plant Pathology Lab OS

A single-page, dependency-free web application for the Department of Plant Pathology,
B. A. College of Agriculture, Anand Agricultural University. It puts the department's
standard operating procedures, chemical inventory, media and buffer formulations,
laboratory protocols, calculators, safety guidance, troubleshooting, examination question
bank, disease and pathogen reference and isolate register into one page that works on a
phone at the bench, including offline.

**Intended users:** students, research scholars and staff working in the laboratory —
someone standing at an instrument who needs the procedure, someone weighing a chemical who
needs its storage and hazard note, someone preparing for an examination.

**Architecture:** one `index.html`, plain CSS and JavaScript, JSON data files, a service
worker and a web app manifest. No framework, no build step, no bundler, no npm packages,
no external runtime requests. Everything is served as static files by GitHub Pages.

---

## Application areas

**Home** — a dashboard with a universal search box and cards for every destination,
grouped as Laboratory, Study and Reference, plus quick tools and a recently-opened row.

**Laboratory**

| Destination | Contents |
|---|---|
| SOPs | 26 instrument procedures in 6 groups: purpose, procedure, precautions, maintenance. Each has a QR code and a printable label |
| Chemicals | 128 entries with controlled category, tags, storage, hazard level and use; A–Z strip, hazard/cold/expiry/category filters |
| Formulations | 25 media and buffers whose quantities scale to the volume entered |
| Calculators | 9: molarity, dilution, % w/v, ppm, PCR master mix, ready-made 2× mix, dehydrated medium, haemocytometer spore count, CFU count — grouped by category, with search, favourites, copy result, a 25-entry calculation history and per-calculator links `#calc=<id>` |
| Protocols | 46 methods with 295 steps and countdown timers on timed steps |
| Safety | 10 topics across working safely and emergencies |
| Troubleshooting | 76 symptom → cause → action entries in 21 workflows |
| Culture collection | The isolate register. Ships **empty**; records are added by editing `data/culture-collection.json` |

**Study** — the question bank: 89 sets and 8,156 questions with explained answers, mock
papers, flash cards, per-set resume, best-score badges and progress export/import. An optional
**exam mode** adds a countdown, an optional per-question limit, locked answers (explanations
withheld until submission), negative marking, an exam-style result sheet and per-set attempt
history. Practice mode is unchanged when exam mode is off.

**Progress, favourites and history** — `#tab=progress`: counts for favourites, recent
resources, calculator calculations, exam attempts, sets in progress and best scores; a
favourites list covering every module with type filter and search; and the last 50 resources
you opened, newest first.

**Reference** — 27 sheets in ten groups: disease and pathogen reference (223 diseases
across 45 crops), mycology, bacteriology, virology, nematology, molecular plant pathology,
taxonomy, fungicides and biocontrol, techniques, history and terminology.

**Elsewhere** — universal search across every module, a correction-reporting page, light
and dark themes, illustrated concept diagrams in the reference groups, and offline use once the
site has been opened.

---

## Repository structure

```
index.html               the whole application: markup, styles, scripts
sw.js                    service worker: caches the shell, core data and, on first use, the large payloads
manifest.webmanifest     installable web app metadata
.nojekyll                tells GitHub Pages to serve the files as they are
photo.jpg                author portrait in the credit block
README.md                this file
CHANGELOG.md             what each phase changed
404.html                 GitHub Pages fallback page
assets/
  sciname.js             scientific-name italics, applied at display time
  qr.js                  QR encoder used for the SOP codes
  logo-aau.png           AAU logo
  emblem-baca.png        BACA emblem
  fonts/                 IBM Plex Sans subsets (SIL Open Font License 1.1) + LICENSE.txt
  icons/                 application icons: 192, 512 and maskable 512
data/
  sops.json              instrument groups and the 26 SOPs
  chemicals.json         128 chemicals
  formulations.json      25 media and buffers
  protocols.json         46 protocols
  safety.json            10 safety topics
  troubleshooting.json   76 entries
  quiz-nematology.json   the built-in 47-question set
  culture-collection.json  isolate register (empty)
  reporting.json         correction-reporting configuration
  taxa.json              controlled scientific-name dictionary
  questions.json         88 question sets (large, loaded on first use)
  references.json        27 reference sheets and the reference index (large, loaded on first use)
  normalization/         Phase 05 audit trail — see below
```

---

## Editing the data

Every dataset is a JSON file with the same wrapper: `version`, `dataset`, `count` and the
records themselves. Keep those fields in step with the contents when you edit a file.

| File | Shape |
|---|---|
| `sops.json` | `groups: [{name, ids:[]}]`, `sops: { "<id>": {title, model, purpose, procedure:[], precautions:[], maintenance} }` — the id is the number used by `#sop=<id>` |
| `chemicals.json` | `chems: [{name, cat, store, lvl, hz, use, exp?, category, tags?, storage:{raw, temperature?, location?, conditions?, container?, notes?}}]` — `cat` and `store` are the original wording and are kept; `category`, `tags` and `storage` were derived from them in Phase 05 |
| `formulations.json` | `recipes: [{cat, name, base, ing:[], note}]` — `base` is the volume the quantities are written for |
| `protocols.json` | `protocols: [{cat, name, pr, mat, st:[], note}]` — `pr` purpose, `mat` materials, `st` steps |
| `safety.json` | `safety: [{cat, name, intro, blocks:[{h, items:[]}], kind}]` |
| `troubleshooting.json` | `trouble: [{cat, p, cf, tip}]` — problem, cause and fix, tip |
| `questions.json` | `sets: { "<setId>": {title, q:[{b, q, o:[], a, e}]} }` — block, question, options, index of the correct option, explanation |
| `quiz-nematology.json` | `quiz: [ … the same question shape … ]` |
| `references.json` | `sheets: { "<sheetId>": "<html>" }`, `refidx: [[sheetId, label, title, searchKey]]` |
| `culture-collection.json` | `records: []`, plus `schema` (eight field groups) and `status_values`. Every field is optional |
| `reporting.json` | `form_url`, `fallback_email`, `modules`, `issue_types` |
| `taxa.json` | `genera`, `binomial_only`, `epithets`, `abbreviations` |

`data/normalization/` holds the Phase 05 audit trail: the before and after integrity
records, the chemical category and storage maps, the possible-duplicate review manifest,
the scientific-name QA report and `REVIEW.md`. It is the record of what was changed and
why, and of the 14 chemical groups still awaiting the owner's decision. **Do not delete it
casually** — without it there is no provenance for the normalised fields.

### Adding content

- **SOP** — add an entry to `sops.json` under the next id, and put that id in a group's
  `ids`. `procedure` and `precautions` are arrays of sentences. The QR code, the deep link
  `#sop=<id>` and the printable label follow automatically.
- **Chemical** — append to `chems`. Give `category` one of the 14 controlled values (see
  `data/normalization/chemical-categories.json`), keep `cat` as the wording you would
  normally use, and write `store` in plain words; `storage.raw` should repeat it.
- **Protocol, formulation, troubleshooting, safety** — append to the relevant array using
  the fields above; `cat` decides which group it appears under.
- **Reference sheet** — add the HTML under a new id in `sheets`, add matching rows to
  `refidx` so search finds it, and add its chip and group in `index.html`.
- **Question** — append to the `q` array of an existing set, or add a new set together with
  a matching `.setcard` button in `index.html`. `a` is the index of the correct option.
- **Culture collection** — append to `records`, with only the fields you actually know.
  Unknown fields can be left out entirely, and extra fields still display.

After editing, raise `window.DATA_VERSION` in `index.html` **and** `DATA_VERSION` in
`sw.js` so browsers fetch the new file rather than a cached copy.

### Scientific names

Italics are applied when the page renders, by `assets/sciname.js` using the controlled
dictionary in `data/taxa.json`. **Do not add `<i>` tags to source data to make names
italic** — add the genus or epithet to the dictionary instead. The existing `<i>` tags in
the question bank and reference sheets are the author's own; the formatter never touches
or doubles them.

---

## Running it locally

Any static server will do; the application only needs the files served over HTTP so that
`fetch` and the service worker work. With Python installed:

```
cd lab-sops
python3 -m http.server 8000
```

then open `http://localhost:8000/`. Checks worth running after a change:

- the dashboard loads and the section navigation works;
- deep links resolve on a fresh load: `#sop=17`, `#prot=4`, `#rec=11`, `#chem=EDTA`,
  `#safe=5`, `#set=mock1`, `#ref=organisms_ref`, `#grp=tax`, `#isolate=<id>`, `#fault`,
  `#tab=collection`;
- universal search returns results from several groups;
- the question bank loads, a set opens, answers and explanations work;
- offline: load the site, stop the server, reload — the shell, core data and anything
  already downloaded should still work;
- the browser console shows no errors and the network panel no failed requests.

---

## GitHub Pages

The site is published from this repository at
`https://surajthakor4011-prog.github.io/lab-sops/` — a project site, so everything lives
under the `/lab-sops/` sub-path. Because of that:

- **all paths in the application are relative** (`data/…`, `assets/…`, `sw.js`,
  `manifest.webmanifest`). Do not introduce a path starting with `/`;
- `.nojekyll` must stay, or Pages will drop any file or folder whose name begins with `_`;
- the service worker is registered relative to the page, so its scope follows the
  sub-path. Its caches are named from `APP_VERSION` and `DATA_VERSION` in `sw.js`, and
  raising either replaces the old caches on the next visit;
- a returning visitor gets the new shell after one online visit, because navigation is
  network-first with the cached copy as fallback.

The published site reflects whatever has been pushed to `origin/main`. At the time of
writing the local `main` branch contains work that has **not** been pushed, so the live
site is older than this repository — see `CHANGELOG.md`.

---

## Reporting corrections

`#fault` opens a form that **prepares** a report: it builds a structured plain-text summary
and offers "Copy report" and "Prepare email draft". It does not submit anything, because a
static site has no server; the email draft opens the user's own mail application and is not
sent until they send it. If an online form is configured later by setting `form_url` in
`data/reporting.json`, the page shows a clearly labelled link to it instead.

## Instrument QR codes

Each SOP page shows a QR code that encodes only its canonical deep link,
`https://surajthakor4011-prog.github.io/lab-sops/#sop=<id>`. Codes are generated in the
browser by `assets/qr.js`; there is no QR service and no external request. The site address
is a constant in `index.html`, so a code generated while testing locally still points at the
published site. "Print QR label" prints a single label for the open SOP.

## Progress portability

The question bank keeps progress in this browser only, under `ppdrill:<setId>` (an
unfinished run) and `ppbest:<setId>` (the best result). The Study section can export those
to a small versioned JSON file and import it on another browser or device. The file
contains progress alone — no questions, answers, explanations or other application state —
and importing **merges**: the stronger best score and the further-advanced run win, so
nothing on the receiving device is downgraded. Invalid files are rejected without touching
existing progress.

## Licence, attribution and citation

The application's credit block states that it is licensed
**Creative Commons Attribution–NonCommercial 4.0 International (CC BY-NC 4.0)**, links to
`https://creativecommons.org/licenses/by-nc/4.0/`, names the author and the
acknowledgements, and gives a suggested citation and contact details. There is no separate
licence file in the repository; the credit block is the authoritative statement. IBM Plex
Sans is bundled under the SIL Open Font License 1.1 — see `assets/fonts/LICENSE.txt`.

## Maintainer workflow

1. Edit the source file or dataset.
2. Validate the JSON (`python3 -m json.tool data/<file>.json > /dev/null`) and check the
   record count against the `count` field.
3. Serve the site locally and run the checks listed above, including offline.
4. Review the diff — confirm only the files you meant to change were touched.
5. Commit one focused change with a descriptive message.
6. Push separately, and confirm the live site once Pages has rebuilt.

**Scientific content should be checked before publication** against the departmental
practical manual, the prescribed textbook or the primary literature. The question bank,
reference sheets and chemical hazard notes are teaching material: an error here is repeated
by everyone who uses the site.
