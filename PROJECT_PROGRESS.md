# Plant Pathology Lab OS — Project Progress

**Repository:** `surajthakor4011-prog/lab-sops` · branch `main` · release commit `1fe1a97` (service worker 8.3.0)
**Live:** https://surajthakor4011-prog.github.io/lab-sops/
**Repository audit (Phase 01):** 21 September 2026
**Current phase:** **Original roadmap complete (Phases 1–16); prepared for release** (28 September 2026)
**Last updated:** 28 September 2026

---

## Current State

A single-page, dependency-free web application served directly from the repository root by GitHub Pages. Since Phase 03 the content is held in versioned JSON files rather than inline.

```
index.html          248 KB   253,532 B after Phase 08D (241,235 B after Phase 08C; 235,063 B after Phase 08B).
                             Phase 07 adds @font-face rules, the manifest link and the service-worker registration.
sw.js                 6 KB   service worker (Phase 07)
manifest.webmanifest  1 KB   installable web app metadata (Phase 07)
assets/
  logo-aau.png       37 KB   AAU logo (externalised in Phase 04)
  emblem-baca.png    42 KB   BACA emblem (externalised in Phase 04)
  sciname.js          5 KB   scientific-name italics (Phase 05; also used by the QA script)
  qr.js              12 KB   QR encoder written for this project (Phase 08C; loaded only on an SOP)
  fonts/            232 KB   IBM Plex Sans, self-hosted (SIL OFL 1.1) — 15 subset files + LICENSE.txt
  icons/             16 KB   app icons 192, 512 and maskable 512 (Phase 07)
.nojekyll            0 B     serve files as-is; no Jekyll processing
photo.jpg            40 KB   author portrait in the credit block
README.md            10 B    stub
data/
  sops.json          35 KB   instrument groups + 26 SOPs        |
  chemicals.json     38 KB   128 chemicals (+ category, tags, storage since Phase 05) |
  formulations.json   8 KB   25 media and buffers               | core - fetched
  protocols.json    106 KB   46 protocols                       | on page load
  safety.json        15 KB   10 safety topics                   | (265 KB total)
  troubleshooting.json 49 KB 76 troubleshooting entries         |
  quiz-nematology.json 14 KB built-in 47-question set           |
  culture-collection.json 1 KB isolate register — ships empty    |
  reporting.json      1 KB   correction-reporting configuration    |
  questions.json    2.69 MB  88 question sets - on first use. 8,156 questions in total:
                             8,109 here + 47 in quiz-nematology.json
  references.json   1.06 MB  27 reference sheets + 1,029-row index  - on first use
  taxa.json          24 KB   controlled scientific-name dictionary (Phase 05)
  normalization/             Phase 05 audit trail: REVIEW.md, category/storage maps,
                             duplicate manifest, scientific-name QA, before/after integrity
```

No build step, no `package.json`, no dependencies, and no workflows. `.nojekyll` is present (added in Phase 04); there is no `CNAME` or `404.html`. Since Phase 07 there are **no external requests at all**: IBM Plex Sans is self-hosted. All state is client-side (`localStorage`: `labsops:recent`, `labsops:howto-seen`, `ppdrill:*`, `ppbest:*`). Deep links work through the URL hash (`#sop=`, `#prot=`, `#rec=`, `#chem=`, `#safe=`, `#set=`, `#tab=`, and since Phase 02 `#ref=` and `#grp=`).

First load after Phase 06 is **index.html (~193 KB), 265 KB of core JSON, `taxa.json` (24 KB), `sciname.js` (5 KB) and two logos (80 KB); the JSON, script and logos are cached after the first visit**. For comparison: index.html alone was 588 KB before Phase 03 and 181,312 B (~177 KB) after the Phase 04 cleanup. The 3.75 MB deferred payload is two independent files, so opening the Reference section costs 1.06 MB and opening the Question bank 2.69 MB.

Since Phase 02 the structure is a **dashboard landing view plus four sections** — Home, Laboratory, Study, Reference — under a sticky navy header. The section row selects the area; a second, horizontally scrollable row shows the destinations within it. Every original view, handler and deep link is unchanged; the new layer wraps `setTab` and `showSheet` rather than replacing them.

---

## Completed / Existing

Verified by loading the page in a headless DOM with `data.json` served. **No JavaScript errors, no console warnings, no broken internal references.**

| Module | Content | State |
|---|---|---|
| SOPs | 26 instruments in 6 groups; each with purpose, procedure, precautions, maintenance | Works; desktop two-pane, mobile list→detail |
| Chemicals | 128 entries (name, category, storage, hazard level, hazard note, use) | Works; A–Z strip, hazard/cold/expiry filters, GHS pictograms derived from hazard text |
| Formulations | 25 media and buffers in 3 categories | Works; quantities scale linearly to entered volume |
| Calculators | 9 (molarity, dilution, % w/v, ppm, PCR master mix, ready-made 2× mix, dehydrated medium, haemocytometer spore count, CFU count) | Works; live recalculation |
| Protocols | 46 methods, 295 steps, in 7 categories | Works; category banners, countdown timers on steps with durations |
| Safety | 10 topics, 30 blocks, split working-safely / emergencies | Works |
| Troubleshooting | 76 symptom → cause → action entries in 21 categories | Works |
| Question bank | 88 sets + 1 built-in = **8,156 questions**; 27 reference sheets (846,000 characters); 1,029-row reference index | Works; shuffling, per-question explanation, section breakdown, resume, best-score badges |
| Global search | Indexes all tabs at load; grouped results, highlighting, click-through | Works; ~120 ms for a broad term |
| Supporting | Recently-viewed row, breadcrumbs, back-button support, sticky category headings, print stylesheet, CC BY-NC licence block, citation, contact details | Works |

### Added in Phase 02

| Item | Detail |
|---|---|
| Dashboard (`#tab=h`) | Lab OS branding, description, prominent universal search, 17 destination cards grouped Laboratory / Study / Reference, 8 quick tools, recently opened, and a "carry on where you left off" row built from the existing question-bank progress store |
| Section navigation | Home · Laboratory · Study · Reference, with a per-section destination row that scrolls horizontally instead of wrapping |
| Disease & Pathogen Reference (`#tab=d`) | Promoted to a first-class destination. The existing `ev-ref` node is **moved**, not copied, so every chip, sheet, jump link and the sheet-level search keep their original handlers |
| Reference grouping | The 27 sheets grouped into 10 destinations — Disease & pathogens (8), Mycology (3), Bacteriology (2), Virology (2), Nematology (1), Molecular plant pathology (2), Taxonomy (2), Fungicides & biocontrol (3), Techniques (1), History & terminology (3). Each sheet belongs to exactly one group; no sheet is duplicated or renamed |
| Study destinations | Question bank, Mock papers and Flash cards now reachable directly, mapped onto the existing sub-tabs |
| New deep links | `#tab=h`, `#tab=d`, `#ref=<sheet>`, `#grp=<group>` — added alongside the existing routes, none of which changed |
| Search index warming | The deferred payloads now load on first focus of either search box, so the dashboard search returns reference and question-bank hits without the user opening the Question bank first |

### Added in Phase 03

| Item | Detail |
|---|---|
| Inline `DATA` extracted | The 253 KB literal is replaced by an empty shell of the same shape, filled by `hydrate()` from seven core JSON files. Every rendering function is unchanged and still reads `DATA` at call time |
| Core loader | A small script in `<head>` starts all seven fetches before the application script parses, so the requests are in flight while the page loads |
| Deferred payload split | `data.json` replaced by `data/questions.json` and `data/references.json`, loaded independently by `loadQuestions()` and `loadReferences()`. `loadExam()` is retained as a wrapper over both, so every original call site still works |
| `organisms_ref` de-duplicated | The 55.7 KB inline copy is removed from `index.html`; the single authoritative copy is in `data/references.json` and is injected by the existing `ensureSheet()` |
| Error states | A status bar reports a core-data failure and names which sections will be empty; the Question bank and the Reference section each show their own amber notice if their payload fails. A failure in one payload never blanks the rest of the application |
| Integrity verification | Every extracted dataset compared field by field against the pre-extraction originals — all identical, all counts as expected |

---

## Needs Improvement

1. **Chemical categories are not a controlled vocabulary.** 49 distinct category strings for 128 chemicals, with overlapping variants — `Buffers` / `Buffers & salts` / `Buffers (TBE)` / `Buffers (electrophoresis)`; `Salts` / `Inorganic salts` / `Salts (PCR)`; `Detergents` / `Detergents & surfactants` / `Detergents / molecular biology`; `Stains & dyes` / `Stains & indicators`. Storage strings likewise: 34 distinct values built from an unstructured `RT, dry, dark, closed` free-text pattern.
2. **Scientific names are not italicised outside `data.json`.** The reference sheets and question sets carry 9,260 `<i>` tags; the SOPs, protocols, chemicals, formulations and troubleshooting entries carry none, although at least 14 genera appear in them (*Macrophomina*, *Fusarium*, *Rhizoctonia*, *Pythium*, *Phytophthora*, *Sclerotium*, *Sclerotinia*, *Alternaria*, *Ralstonia*, *Xanthomonas*, *Pseudomonas*, *Trichoderma*, *Aspergillus*, *Colletotrichum*, *Meloidogyne*).
3. ~~Disease and pathogen reference is buried.~~ **Resolved in Phase 02** — now a top-level section with ten grouped destinations.
4. ~~No homepage.~~ **Resolved in Phase 02** — dashboard is the landing view.
5. ~~Tab bar wraps to three rows at 360 px.~~ **Resolved in Phase 02** — four short section pills plus one scrollable destination row. The brand block above still scrolls away rather than collapsing; that is a visual-design question for a later phase.
6. **Data payload.** `data.json` is a single 3.75 MB fetch on first Question bank use; nothing is chunked or cached beyond the browser default.
7. ~~Responsive rules have accreted.~~ **Resolved in Phase 04** — 11 distinct breakpoint values reduced to 7 (420, 560, 640/641, 760, 879/880); one `header` rule instead of three.
8. **Accessibility.** The tab bar uses plain buttons with no `role="tab"`, `aria-selected` or keyboard arrow navigation; no `aria-live` region announces search-result counts or quiz feedback; hidden panels use inline `display:none` rather than `hidden`; there is one `<h1>` and no `<main>` landmark.
9. **Safety emergency card is still blank.** `Emergency contacts & first-aid points` contains eleven fill-in-the-blank lines (laboratory in-charge, HoD, health centre, local ambulance, campus security, electrician, first-aid box, extinguishers, eye-wash, MCB, spill kit). **These must be filled from the department, not invented.**

---

## Missing

- Culture collection catalogue (isolate register) — identified earlier as a candidate, not built.
- Fault-report route (Google Form or equivalent) — the footer asks for corrections by email only.
- Offline capability: no service worker, no manifest, no installable PWA, no offline fallback for the Google Fonts request or `data.json`.
- `README.md` with any content; no contributor or update instructions.
- `404.html`; no `meta description`, favicon, Open Graph or Twitter card.
- ~~Dark mode.~~ **Added in Phase 06** (theme tokens; system preference or explicit choice).
- Per-instrument QR deep links from the printed panels into the matching `#sop=` anchor (the hash router supports it; nothing generates the codes).
- Any versioning or changelog of scientific content.

---

## Scientific Content to Preserve

Nothing in this list may be lost, renamed away, or silently rewritten in later phases.

- **26 instrument SOPs** with named models and departmental ID numbers (Bio-Rad CFX Opus 96, Agilent 2100 Bioanalyzer, Thermo Sorvall ST 8R, Eppendorf 5418 R, Oakton PC 700, Applied Biosystems MiniAmp Plus, VELP TX4, Bio-Rad PowerPac Basic, and others).
- **128-item chemical inventory** with storage, hazard level and use — the departmental cupboard list.
- **25 formulations**, including the laboratory's own CTAB and modified Mathur's variants.
- **46 protocols / 295 steps**, including the bacteriology test battery (LOPAT, O–F, catalase, indole, nitrate, gelatin, citrate, urease, levan, arginine dihydrolase, potato slice), the baiting set (Phytophthora, Pythium, Rhizoctonia, sclerotial recovery, CLA), nematology (Cobb's, Baermann, root staining) and virology (DAC-ELISA, sap inoculation, local lesion assay).
- **76 troubleshooting entries** across 21 workflows.
- **10 safety topics / 30 blocks**, including the emergency response set.
- **8,156 questions** across 88 sets — AAU mock papers with departmental answer keys, ASRB NET papers, SDAU papers, unit-wise sets and topic drills.
- **27 reference sheets (846,000 characters)** — causal organisms by crop (223 diseases, 45 crops), crop blocks, glossary, scientists, vectors, virus classification, bacteriology 100, phyla, rusts, modes of action, host–pathogen concepts, and the fifteen `pdf_*` compendia.
- **Attribution and legal blocks**: authorship, CC BY-NC 4.0 licence, suggested citation, contact details, and the acknowledgement of Dr R. G. Parmar and Dr Puja Pandey.

### Flagged for review — not corrected

*Phase 05:* superseded by `data/normalization/chemical-duplicates-review.json` (14 groups, 32 records, none merged) and the spelling lists in `data/normalization/scientific-names-qa.json`. The Phase 01 list below is kept for history.

Recorded for the owner's decision; some may be genuine separate stock bottles of different grade.

- Probable duplicate chemical entries: `Iso-Amyl Alcohol` / `Isoamyl alcohol`; `Di-potassium hydrogen orthophosphate` / `Di-potassium hydrogen phosphate` / `Potassium phosphate Dibasic Anhydrous`; `Di-sodium hydrogen orthophosphate anhydrous` / `Di-sodium hydrogen phosphate anhydrous GR`; `Potassium dichromate (K2Cr2O7)` / `Potassium dichromate AR`; `Sodium Lauryl Sulphate AR` / `Sodium lauryl sulphate GR (SDS)`; `Sodium diethyl dithiocarbamate` / `… AR`; `HiIndicator pH paper` / `pH indicator papers`.
- GHS pictograms on chemical cards are **inferred by regular expression from the hazard note**, not taken from supplier data. The page discloses this, but a wrong or absent pictogram is possible.
- British spelling is otherwise consistent (sulphate 15/0, sterilis- 37/0, centre 14/0); the only American forms are inside the product name *Bioanalyzer*, which is correct.

---

## Technical Issues

| # | Issue | Evidence |
|---|---|---|
| 1 | ~~Back-to-top button never works.~~ **Resolved in Phase 04** — confirmed broken in Chromium (stayed `display:none` after scrolling); now wired after parsing, and honours reduced motion. | — |
| 2 | ~~55.7 KB of duplicated content (`organisms_ref` stored twice).~~ **Resolved in Phase 03** — one authoritative copy, in `data/references.json`. | — |
| 3 | ~~Dead header-collapse code.~~ **Resolved in Phase 04** — `_shrunk`, `_tick`, `_onScroll()`, `.hmini` and every `body.shrunk` rule removed. | — |
| 4 | ~~Unused CSS.~~ **Resolved in Phase 04, with a correction:** the Phase 01 figure of 37 was wrong — it searched `index.html` only and missed class names used inside the reference-sheet HTML in the data files. With the data included, 5 were genuinely unused (`bigink`, `cardhead`, `epstabs`, `hmini`, `howlink`); all removed. None remain by the same check. | static check over markup, JS and `data/` |
| 5 | `index.html` was 181,312 B (~177 KB) after Phase 04 (588 KB before Phase 03) and is ~193 KB after Phase 06. *Correction to Phase 03:* the inline script is ~64 KB once `DATA` was extracted, not ~300 KB, so the old iOS-webview size concern no longer applies. Nothing is minified, deliberately. | file measurement |
| 6 | ~~Two logos inlined as 106 KB of base64.~~ **Resolved in Phase 04** — `assets/logo-aau.png`, `assets/emblem-baca.png`, byte-identical to the decoded originals (SHA-1 match). | — |
| 7 | The Google Fonts stylesheet is a single point of failure — the site has no offline or blocked-network fallback beyond the system font stack. | one external `<link>` |
| 8 | ~~No `.nojekyll`.~~ **Resolved in Phase 04.** | — |
| 9 | `README.md` is a 10-byte stub — the repository is undocumented for anyone but the author. | file content |
| 10 | Question-bank progress is device-local only, with no export; clearing browser data loses every score. | `localStorage` keys |
| 11 | Two `<script>` blocks and two `<style>` blocks now exist; the Phase 02 layer wraps `setTab` and `showSheet` from the second block. This is deliberate — it keeps Phase 02 reversible — but the two layers should be merged once the data-model split lands. | index.html structure |
| 12 | The dashboard's "Progress" is a resume row, not a progress page. There is no per-topic score history, because none is stored. | `ppdrill:` / `ppbest:` keys |
| 13 | First load now makes eight requests instead of one. Fine over HTTP/2 on GitHub Pages, but it is eight round trips on a poor connection. A single bundled `core.json` would trade maintainability for latency; not taken. | Phase 03 loader |
| 14 | The laboratory lists render empty for the few hundred milliseconds before `hydrate()` runs. A status line covers it, but there are no skeleton placeholders. | Phase 03 loader |
| 15 | `data/questions.json` is still one 2.69 MB file. Splitting it per set would let a single mock paper load alone, but would mean 88 files or a manifest layer — deliberately not done. | Phase 03 decision |
| 16 | An unknown `#tab=` key (for example `#tab=f` or `#tab=x`) shows a blank page with the navigation visible. This is pre-existing and was not changed. Valid keys are `h i c r k p s t q d` (Formulations is `r`, Calculators is `k`). A one-line guard sending unknown keys to the dashboard would fix it. | Phase 04 testing |
| 17 | Duplicate `.brandtop` rule sets (around the header styles and again later in the sheet) still override one another. Out of scope for Phase 04, which covered the `header` rules only. | CSS |
| 19 | First load grew by ~45 KB in Phase 05: `chemicals.json` +16 KB (new fields), `taxa.json` 24 KB, `sciname.js` 5 KB. `taxa.json` loads independently — if it fails, names simply stay roman. | Phase 05 |
| 20 | Scientific-name italics are dictionary-based: genera not in `data/taxa.json` stay roman, and names split by search highlighting are not joined. Virus species names (ICTV) are not italicised. | Phase 05 limitation |
| 18 | The print stylesheet listed `.epstabs`, a class that does not exist — probably a typo for the Question bank sub-tab strip. The dead selector was removed; the likely intent (hiding that strip in print) was **not** implemented, because that would change print output. | print CSS |

**No** broken internal links, missing assets, orphaned question sets or unreachable reference sheets were found. All 26 instrument IDs resolve, all 88 sets have cards, all 27 sheets have chips.

---

## Architectural Decisions — Phase 02

1. **Wrap, do not replace.** `setTab` and `showSheet` are wrapped from a second script block. Every original call site resolves to the wrapper through the global binding, so the seven original views and all existing handlers are untouched. Exactly one line of existing JavaScript was changed: the reference entry in the search index now calls `setTab('d')` instead of `setTab('q')`.
2. **Move the reference node, never copy it.** `#ev-ref` is relocated into the new `#viewRef` with `appendChild`. Because the DOM node moves, the chips, sheet cache (`ensureSheet`), sheet search (`#refq`) and jump links keep the listeners bound in Phase 01. No sheet HTML is duplicated.
3. **Ten reference groups, not seven.** The brief named seven. The remaining sheets — fungicides, modes of action, biological control, instruments and techniques, scientists, exam hooks, who's who — had nowhere to go without either losing them or forcing them into an inaccurate category, so three further groups were added. Taxonomy holds the two classification sheets that already existed (fungal phyla, plant virus classification); no taxonomy content was written.
4. **Two-row navigation rather than a drawer or bottom bar.** Four short section pills wrap at worst onto two lines on a 320 px screen; the destination row scrolls horizontally and never wraps. A drawer would have hidden the structure the phase was meant to make visible, and a bottom bar cannot hold ten reference destinations.
5. **`data.json` is fetched on first search focus, not on load.** The dashboard search has to return reference and question-bank results to be worth its prominence, but a 3.75 MB download on every visit is not acceptable. Loading on first use is the compromise until the data split in Phase 03.
6. **Existing routes untouched.** The original `routeHash` was not modified. The new `#ref=` and `#grp=` routes are handled by a second `hashchange` listener that returns silently for any hash it does not own.

---

## Architectural Decisions — Phase 03

1. **Shell and hydrate, rather than restructuring the script.** `DATA` becomes an empty object of identical shape; `hydrate()` fills it and calls the existing render functions a second time. This avoided moving 300 KB of working code into an async boot function, which would have taken every global out of scope and broken the Phase 02 wrappers.
2. **Two deferred files, not many.** `questions.json` and `references.json` are the two independent consumers of the old `data.json`. Splitting further — per set, per sheet — would have meant a manifest and dozens of requests for no real gain.
3. **The built-in 47-question Nematology set stays in the core bundle** (`data/quiz-nematology.json`, 14 KB). Its count is printed on the Question bank card at load time; deferring it would have changed visible behaviour.
4. **Files carry `version`, `dataset` and `count` fields** around the original values. The values themselves are identical to the originals; the wrapper exists so a later phase can validate a file it has just fetched.
5. **`loadExam()` kept as a wrapper.** Rather than editing every call site, the old function now returns `Promise.all([loadQuestions(), loadReferences()])`. Only the four call sites where narrowing is a genuine saving were changed.
6. **`data.json` deleted.** Keeping it would have re-created exactly the duplication this phase was asked to remove. Nothing in the application referenced it after the split.
7. **Cache busting by query string** (`?v=` from `window.DATA_VERSION`), so a content update in a later phase can be published without waiting out the GitHub Pages cache.

---

## Phase 04 — Technical Debt & Performance Cleanup

**Status: COMPLETE**

| Measure | Before | After |
|---|---|---|
| `index.html` | 291,863 B | 181,312 B (−38%) |
| CSS (two `<style>` blocks) | 47,826 B | 45,676 B |
| Core JSON (unchanged) | 254,471 B | 254,471 B |
| Distinct breakpoint values | 11 | 7 |
| Width media queries | 17 | 16 |
| `header { position: sticky }` declarations | 3 | 1 |
| Inline base64 images | 2 (108,616 chars) | 0 |
| CSS classes with no reference anywhere | 5 | 0 |

**What was done**

- **Back-to-top.** Wiring moved to run after the document is parsed (`DOMContentLoaded`, or immediately if already parsed). No timers or polling. Smooth scroll, instant when `prefers-reduced-motion: reduce`.
- **Dead header-collapse code** removed from JS and CSS; the sticky header and navigation are untouched.
- **Header rules.** Of the three sticky declarations the audit counted, only one ever applied. One was preceded by a stray comment tail (`header, .brandtop ---- */`), which makes the whole selector invalid, so browsers discard it. Two further rules were disabled by the same fault — one set `overflow:hidden` on the header. All three were **removed, not repaired**: repairing them would have changed the page, including clipping the search dropdown. The surviving declarations of the original non-sticky rule were folded into the single sticky rule.
- **Unused CSS**: the 5 confirmed classes, one exact duplicate print rule, and `@media (min-width:900px){ main{…} }` (no `<main>` exists in markup, script or data).
- **Breakpoints**: 600 → 640, 520 → 560, 780 → 760 (the same `.tabs` component as the Phase 02 rule), 900 removed as dead. 420 kept: folding it into 560 would change the how-to card on a 430 px iPhone Pro Max. Behaviour changes only in the bands 521–560, 601–640 and 760–779 px; none of the test widths falls in them.
- **Logos** externalised; **`.nojekyll`** added.

**Regression testing (real Chromium via Playwright, baseline vs cleaned)**

- *Behavioural suite* — identical results except the three intended differences (back-to-top works; logos load from `assets/`; saved quiz state differs only because shuffling is random). Covered every `#tab=` key plus `#sop=`, `#prot=`, `#rec=`, `#chem=`, `#safe=`, `#set=`, `#ref=`, `#grp=`, each with a page reload; back/forward; header stays at `top: 0` after scrolling; the destination row stays one scrollable row at 320–414 px; navigation row count and header height identical at 320, 360, 414, 768, 1024 and 1440 px; dashboard search; recently viewed; shuffling; explanations; resume after reload; best-score badge; all images load. Zero console errors, failed requests or HTTP errors.
- *Visual and computed-style comparison* — 20 views (including print emulation) at 320, 360, 375, 414, 768, 1024 and 1440 px. Of 626,080 element measurements (layout box and 52 computed properties each), 28 differed, all `transform`/`opacity` on the quiz answer animation caught mid-transition. Pixel differences were checked against four repeat runs of the unchanged baseline: every one recurs between baseline runs themselves (rendering noise) or is the back-to-top button now appearing. The exception is a deterministic 28-pixel anti-aliasing difference (max 53/255) on the rounded corners of the active tab at 320 px, with no measured style or layout change.
- *Scientific data* — all nine `data/*.json` files byte-identical to Phase 03 (SHA-256). Counts: 26 SOPs, 128 chemicals, 25 formulations, 46 protocols, 10 safety topics, 76 troubleshooting entries, 8,156 questions, 27 reference sheets, 223 diseases, 45 crops.

**Deliberately left unchanged**

The unknown-`#tab=` blank page (issue 16), duplicate `.brandtop` rules (17), the `.epstabs` print intent (18), `photo.jpg` staying at the root, the two-script/two-style layering from Phase 02 (11), and everything reserved for later phases.

---

## Phase 05 — Content Normalisation

**Status: COMPLETE**

Every decision is recorded under `data/normalization/`; `REVIEW.md` there is the owner-facing summary.

- **Controlled chemical categories.** 49 original category strings reduced to **14 primary categories**: Acids & bases (7), Assay reagents (8), Buffers (20), Salts (14), Detergents & surfactants (9), Stains, dyes & indicators (6), Media, substrates & supplements (16), Molecular biology reagents (12), Solvents (8), Growth regulators & defence inducers (6), Preservatives (5), Oxidisers & reactive chemicals (3), Virology reagents (5), General & miscellaneous (9). The mapping is per original category *string*, never per record; the specificity inside the old names survives as tags (e.g. Buffers → TBE, electrophoresis). The original `cat` field is kept on every record and remains searchable, so old terms still find records. A category filter was added beside the existing chips; five judgement calls (e.g. sodium chloride under Buffers because its original category was "Buffers & salts") are listed for the owner.
- **Storage.** Each record gains a `storage` object — `raw`, plus `temperature`, `location`, `conditions`, `container` only where those words are written, and everything else verbatim in `notes`. Nothing inferred; every word of every original value is present in the structured form (checked at generation). The page still shows the original wording, and the cold-storage filter still uses the original text, so its results are unchanged (7 records). Three storage values are flagged for owner review.
- **Hazards / GHS.** Untouched. Pictograms remain inferred at display time from the hazard and storage text and still need verification against supplier SDS.
- **Possible duplicate chemicals.** **14 groups, 32 records — none merged, renamed or deleted.** The seven Phase 01 groups, with the SDS group extended from 2 to 4 records and the disodium phosphate group from 2 to 3, plus seven found in this phase (bis-acrylamide, Tween 20, sodium hydrogen carbonate, citric acid, sodium dihydrogen phosphate, borax, potassium hydroxide). Every group is marked OWNER REVIEW REQUIRED.
- **Scientific names.** Italics are applied at display time by `assets/sciname.js` from the controlled dictionary `data/taxa.json` (274 genera; 11 names that are also ordinary words — *Citrus*, *Thrips*, *Datura*, … — italicised only when a species epithet follows; 644 epithets). The dictionary was built from the owner's own existing italics, reviewed by hand. Supports genus, binomial, abbreviated binomial (*M. phaseolina*, only where the full binomial occurs somewhere in the data) and f. sp./pv./var. epithets (the connecting abbreviations stay roman). Text inside existing `<i>`/`<em>`, instrument model lines, chemical names, links, code and citations is never touched. The stored text is unchanged.
- **QA** (`scientific-names-qa.json`, produced with the same matcher as the browser): 7,113 name occurrences italicised across all datasets (4,093 binomials, 2,457 genus-only, 254 abbreviated, 309 infraspecific), 993 distinct names. Ambiguous cases for review: 296 occurrences of ordinary-word names left roman (mostly "Thrips" as a common noun and "Citrus canker/tristeza/greening"); 116 possibly misspelt epithets, italicised as written (e.g. *campestri*, *auxonopodis*, *amylowora*); 22 possibly misspelt genera left roman (*Phytopthora*, *Xanthomanas*, …). Nothing was corrected.
- **Existing italics** — all 9,260 preserved. Rendered `<i>` count in `organisms_ref` equals its source count (223 = 223); zero nested italics in every view tested.

**Integrity (before → after, SHA-256).** Eight of nine data files byte-identical. `chemicals.json` changed only by *adding* `category`, `tags` and `storage`: all 128 records, in the same order, with every original field identical (names, grades, `lvl`, `hz`, `store`, `use`, `exp`). Counts unchanged: 26 SOPs, 128 chemicals, 25 formulations, 46 protocols, 10 safety topics, 76 troubleshooting entries, 8,156 questions, 27 reference sheets, 223 diseases, 45 crops. `DATA_VERSION` raised to `2` so browsers fetch the new `chemicals.json`.

**Regression (real Chromium).** The full Phase 04 behavioural suite gives output identical to Phase 04 (every route with reload, back/forward, navigation, search, recently viewed, shuffling, explanations, resume, best score, images, back-to-top). Chemicals: 128/128; every category filter matches the map, together covering 128; hazard 18/44/66, cold 7, expiry 27 as expected; A–Z, search by old and new terms, `#chem=` deep link and global search all work. Scientific formatting checked in SOPs, protocols, formulations, troubleshooting, safety, chemicals, five reference sheets and the question bank: zero nested italics, no italics inside model lines or chemical names, and the rendered text identical with the formatter on and off. Zero console errors, failed requests or HTTP errors.

---
## Phase 06 — UI/UX & Accessibility

**Status: COMPLETE**

Baseline recorded first (SHA-256 of `index.html`, all `data/*.json`, `data/normalization/*`, `assets/sciname.js`; counts; routes; clean console). Tested in real Chromium (Playwright); no accessibility library was added to the project.

- **Landmarks.** Skip link ("Skip to main content") as the first element — hidden until focused, moves focus to `<main id="main-content">` without touching the hash router. One `<main>` wraps all views; `<header>` (banner), `<footer>` (contentinfo), `<nav aria-label="Sections">`, `<nav aria-label="Destinations in this section">` and `<nav aria-label="Chemicals A to Z">`.
- **Navigation semantics — navigation, not tabs.** The section and destination controls switch whole views, are reachable by URL, and one of them ("Reference ↗") leaves its section, so they are treated as site navigation: native buttons in `<nav>` regions with `aria-current="page"` on the current item. The Question bank sub-strip and the reference sheet chips follow the same model (`aria-current`). No partial tab semantics were added. Hazard/storage chips are toggle buttons in a labelled group (`aria-pressed`).
- **Keyboard.** Every control is a native button, link, input, select or summary (audit found no clickable `div`/`span`). One strong focus ring for all native controls (3 px, `--focus`), a light ring on the dark header. `scroll-padding` keeps the focused element clear of the sticky header and the back-to-top button (this also fixes A–Z jumps, which previously landed under the header). Tab walks through seven views at 1024 and 375 px: every stop has a visible ring, none obscured, no traps.
- **Focus management.** Explicit navigation (section, destination, dashboard card) moves focus to the new view's heading; ordinary controls never move focus. Answering a question moves focus to "Next question" (the option buttons become disabled); a new question focuses the question text; finishing focuses the result. Search: ArrowDown enters the results, Up/Down move within them, Escape closes and returns focus to the field (previously Escape dropped focus to the page), and the panel closes when focus leaves. No modal exists, so no modal behaviour was invented.
- **Live regions.** One polite region: search result counts (debounced), answer feedback with the correct answer and score, question position, completion, theme changes. `role="status"` on the chemical and troubleshooting counts, the loading/failure bar, and the Question bank and Reference loading notices. Nothing assertive; no nested regions.
- **Hidden content.** Views already use `display:none` (removed from focus and the accessibility tree) and destination buttons use `hidden` — both kept. No opacity- or off-screen-hidden interactive content was found; nothing focusable sits inside `aria-hidden`. 51 decorative SVG icons marked `aria-hidden="true" focusable="false"`; GHS pictograms are hidden from assistive technology because their names are printed beside them.
- **Headings.** One `<h1>`; "Recently opened" and "Carry on where you left off" changed from `h4` to `h3` (they sat directly under an `h2`). No level skips in any audited view.
- **Forms.** Every control has an accessible name; added for the reference-sheet search and the formulation volume field. Calculator inputs were already wrapped in labels. Placeholders kept.
- **Touch.** On coarse pointers only: section buttons 40 px, destination buttons 44 px, chips/sheet chips/sub-tabs 40 px, A–Z 36×40, search results and recent items 44 px, back-to-top 44×44. Desktop density unchanged. The destination row stays one scrolling row at 320–414 px. Chemical cards now wrap the hazard badge instead of overflowing the page at 320–360 px.
- **Contrast.** Light theme: all text passes AA except three reference-sheet badge colours (white letters on grey, amber and teal, 3.5–4.3:1) — darkened just enough to pass. Dark theme: all text passes.
- **Reduced motion.** Animations and transitions reduced to ~0 under `prefers-reduced-motion: reduce`; back-to-top still jumps instantly.
- **Dark mode.** The forced-light block and `color-scheme: light only` removed. Theme-sensitive colours were already mostly custom properties; the remaining light literals used as backgrounds or body text were replaced by tokens with *identical* light values (plus `--navy-text`, `--tint`, `--tint-2`, `--focus`, `--emerg-bg`). Dark values are token overrides, plus seven small rules for colours that are literals in the light design (tab accents, emergency header, about panel). A button at the top-right of the brand block (icon-only below 560 px) cycles System → Light → Dark; an explicit choice is saved (`labos:theme`) and overrides the system; a tiny head script applies it before first paint. Dark rules are screen-only, so printing is always light.
- **Light theme unchanged.** Screenshots of 11 views at 375 and 1440 px against Phase 05: the only difference beyond the run-to-run rendering noise measured by a control run is the new theme button.

**Test matrix.** Static audit (headings, names, clickable non-controls, focus inside `aria-hidden`, contrast, horizontal overflow) of 13 views in light and dark: zero findings. Keyboard walks: clean. Touch at 320/360/375/414/768: no page overflow. 200% zoom (640×450 CSS px) and 150% text: no horizontal overflow; header ≤35% of the viewport. Themes: system light, system dark, explicit light/dark, persistence across reload, return to system — all correct. Phase 04 behavioural suite: identical to Phase 05. Phase 05 chemical and scientific-name tests: identical (no nested italics, 223 = 223 owner italics). Zero console errors, failed requests or broken internal links.

**Integrity.** All 9 data files, `data/taxa.json`, all 7 normalisation files and `assets/sciname.js` byte-identical (SHA-256). Counts unchanged: 26, 128, 25, 46, 10, 76, 8,156, 27, 223, 45.

**Remaining limitations.** No screen-reader run with NVDA/VoiceOver (automated and scripted checks only); axe-core was not available and was deliberately not added. At 768 px the destination row wraps to two rows (the ≥760 px design from Phase 02). The header search field keeps its light fill in dark mode. Reference-sheet badge colours other than the three fixed ones were checked only in the sheets audited. Unknown `#tab=` keys still show a blank view (unchanged, out of scope).

---
## Phase 07 — Offline & Performance

**Status: COMPLETE**

- **Service worker** (`sw.js`, registered relative to the page so the scope follows the GitHub Pages sub-path). Cache names carry both versions — `labos-shell-7.0.0-d2`, `labos-core-7.0.0-d2`, `labos-run-7.0.0-d2` — and activation deletes every other `labos-*` cache. Install fills the new caches completely before they are used; nothing is deleted first, and `skipWaiting` is not called, so a half-updated shell can never meet new data.
- **Cache groups and strategies.** *Shell* (index.html, manifest, `sciname.js`, logos, portrait, icons, the five Latin font files): cache-first, refreshed in the background. *Core data* (sops, chemicals, formulations, protocols, safety, troubleshooting, quiz-nematology, taxa — 8 files, 265 KB): precached at install, then cache-first with background refresh. *Deferred data* (`questions.json` 2.69 MB, `references.json` 1.06 MB): network-first, stored on first successful download, served from cache afterwards. Navigations are network-first with the cached shell as fallback. Cross-origin requests are never touched. `?v=` query strings are stripped for the cache key, so there is one entry per file rather than one per version.
- **Offline behaviour.** Verified with the web server switched off, not with an emulation flag: the dashboard, Laboratory, Study and Reference sections, all six tested deep links, the cached question sets (answering included), cached reference sheets and the global search all work with 0 KB transferred. Where a deferred dataset has never been downloaded, the section says so within 0.3 s — "not available offline yet. Open this tab once while online and they will stay available afterwards" — and the rest of the application keeps working. No separate offline page was added: the cached shell is always present, so the offline state is shown inside the application itself.
- **Manifest** (`manifest.webmanifest`): name "Plant Pathology Lab OS", short name "Lab OS", `start_url` `./index.html`, scope `./`, display `standalone`, theme `#152A52`, background `#F5F7FA`, three icons (192, 512, maskable 512) generated locally as a plain flask mark — the AAU and BACA logos were not altered or reused as app icons. A matching `theme-color` meta and apple-touch-icon are linked from `index.html`.
- **Font.** IBM Plex Sans is under the SIL Open Font License 1.1, so it is now self-hosted from the official `@ibm/plex-sans` package: the Latin1, Greek and Pi subsets of the five faces actually used (400, 500, 600, 700 and 400 italic), 15 woff2 files, 232 KB, with IBM's own `unicode-range` values and `font-display: swap`. Browsers fetch only the subsets a page needs. `LICENSE.txt` ships beside them. Greek was included because β, μ and α appear throughout the scientific text.
- **External dependencies: none.** The Google Fonts preconnect and stylesheet are gone. The only remaining external URL in the page is the Creative Commons licence link in the credit block, which is a link, not a request.
- **Measurements** (Chromium, local server; Lighthouse was not available, so these are browser timings and resource entries). First visit: 19 requests, 733 KB, DOM ready 164 ms. Repeat visit with the worker active: 19 requests, 201 KB from the network (18 served from cache). Offline repeat visit: 0 KB, application fully usable.
- **Large datasets: not split.** One request each is cheaper than a manifest plus many small requests; each section becomes fully usable offline after a single download; splitting would add a loader layer and maintenance burden for no measurable gain on GitHub Pages, which serves both files fine. Revisit only if the question bank grows well beyond its current size.
- **GitHub Pages.** Everything is relative (`sw.js`, `manifest.webmanifest`, `./data/…`, `./assets/…`), so the project sub-path works without server configuration; hash routes are unaffected; `.nojekyll` is untouched.
- **Integrity.** All 10 `data/*.json`, the 7 normalisation files and `assets/sciname.js` are byte-identical (SHA-256) to before the phase. Counts: 26 SOPs, 128 chemicals, 25 formulations, 46 protocols, 10 safety topics, 76 troubleshooting entries, 8,156 questions, 27 reference sheets, 223 diseases, 45 crops; 223 owner italics in the disease sheet; 14 chemical categories.
- **Regression — full suite re-run after the phase.** Accessibility audit (13 views, light and dark): zero findings; keyboard, focus order, live regions, touch targets at 320–768 px, 200% zoom, 150% text, reduced motion and both themes all as in Phase 06. Chemical and scientific-name suite: 128 chemicals, 14 categories, filters 18/44/66/7/27, 223 owner italics rendered against 223 in the source, zero nested italics, rendered text identical with the formatter on and off. Visual regression against a font-matched Phase 06 control (the same `@font-face` rules added to the Phase 06 build, because the service worker serves fonts from its own cache and they cannot be blocked at the network layer): 13 of 18 view/width combinations pixel-identical, the rest differing by 14–30 px of anti-aliasing on the destination row or a 1–2 px scrollbar shift — no visual redesign.
- **Regression.** The Phase 06 behavioural suite is unchanged except one measurement: the destination row is narrower (917 px against 1015 px of scroll width at 375 px) because the tests now render real IBM Plex Sans instead of the fallback — Google Fonts is blocked in the test sandbox, so earlier phases were measured with system fonts. Navigation rows and header heights at 768, 1024 and 1440 px match Phase 06 exactly.
- **Small loader changes.** Entering the Study section now loads the question sets however the section was reached (previously only the tab button did, so `#tab=q` left it idle); both deferred loaders give up after 15 s rather than showing "Loading…" indefinitely; the failure message distinguishes offline from an ordinary error; and a `#tab=` deep link switches section immediately, so the destination row is never briefly shown with every section's buttons.

**Known limitations.** Service-worker updates take effect on the next visit after the new worker installs (deliberate: no `skipWaiting`). The first visit still downloads 733 KB before anything is cached. The question bank and reference sheets are only offline after being opened once online. Playwright's offline emulation does not apply to service-worker requests, so offline behaviour was verified by stopping the server instead. Lighthouse was not available in this environment, so all performance figures are browser timings and resource entries.

**Deferred to later phases.** README, 404 page, Open Graph/Twitter metadata, favicon design work, changelog, culture collection, fault reporting, QR codes, progress export, and filling in the emergency contacts.

---
## Phase 08A — Culture Collection / Isolate Catalogue

**Status: COMPLETE**

- **Dataset.** `data/culture-collection.json`, versioned like every other dataset: `version`, `dataset`, `count`, `status_values`, a `schema` block (8 field groups, 34 fields) and `records: []`. **It ships empty on purpose — no isolate records were supplied, and none were invented.** The register is filled by editing this file; every field is optional.
- **Loader.** Added to the core file list, so it arrives with the other eight small datasets on page load (1.2 KB) and is precached by the service worker. `hydrate()` puts it in `DATA.isolates` and `DATA.collection`; no second copy exists anywhere.
- **Route.** `#tab=collection`, handled by the existing router (the generic `#tab=` branch already forwards to `setTab`, and the Phase 02 wrapper treats `collection` as a Laboratory destination). Records use `#isolate=<isolate_id>`, handled by a small listener in the same pattern as Phase 02's `#ref=`. No routing rewrite was needed.
- **Navigation.** A "Culture collection" destination in the Laboratory row and a matching dashboard card. The four-section architecture is unchanged.
- **UI.** Heading and description, search across isolate ID, organism, scientific name, host, cultivar, disease, symptom, source type and location, collector, institution, accession number, storage and notes; five filter selects built from the data itself (pathogen group, status, source type, host, preservation method) plus "Clear filters"; a live record count; a record list showing ID, status, name, host, disease, source and storage; and a detail view grouped by the schema. Unknown fields present in a record render under "Additional fields", so later additions — photographs, coordinates, sequence identifiers, linked protocols — need no code change.
- **Empty state.** When there are no records the search and filters are hidden and a panel explains what an isolate record can hold, listing the eight schema groups. No fabricated counts.
- **Search integration.** Isolates are added to the existing core index and appear as a "Culture collection" group; clicking a result opens the record. With an empty dataset the index gains nothing and universal search is unchanged. One line was added to the search result group ordering, which silently dropped unknown groups.
- **Scientific names.** No second formatter and no manual italics: `assets/sciname.js` was left untouched. The only adjustment was in this module's own markup — the organism line uses a new class rather than `.nm`, which the formatter deliberately skips because it marks chemical names.
- **Service worker.** `culture-collection.json` added to the precached core list; `APP_VERSION` raised to 8.0.0 so shell and core caches are replaced. The runtime cache is now keyed by the data version alone, so an application update no longer discards the 3.7 MB question and reference payloads.
- **Testing.** Functional: empty state, list, search, single and combined filters, clear, record open by click and by keyboard, back button, browser back and forward, `#isolate=` deep link with reload, universal search opening a record — all pass, with a clearly-labelled DEMO dataset used only for testing and never shipped. Accessibility: no heading skips, one `h1`, every control named, no clickable non-controls, nothing focusable inside `aria-hidden`, no contrast failures in light or dark, focus moves to the record title on open and returns to the originating row on back, 40 px touch targets, no horizontal overflow at 320–1440 px, 200% zoom and 150% text clean. Offline: with the server stopped, the catalogue opens from cache with 0 KB transferred and an unknown `#isolate=` deep link falls back to the list; existing deep links, cached reference sheets and search still work. Performance: first visit 20 requests / 750 KB (was 19 / 733 KB), repeat visit 217 KB, dataset 1.2 KB, fetched in 106 ms, list render under 1 ms. Regression: the Phase 06/07 behavioural suite differs only by the extra Laboratory destination (7 → 8, row scroll width 917 → 1090 px at 375 px) and by the navigation-row counts at 1024/1440 px now matching the corrected values from the end of Phase 07. Zero console errors, failed requests or 4xx.
- **Integrity.** All existing datasets, the normalisation files and `assets/sciname.js` are byte-identical (SHA-256). Counts unchanged: 26, 128, 25, 46, 10, 76, 8,156, 27, 223, 45; isolate records 0.

**Known limitations.** Records are added by editing JSON — there is no in-app editor, and none was requested. Photographs, QR labels, freezer maps, sequence data and linked experiments are schema-ready but not implemented. The brief's colour names (forest/botanical greens) do not match this project's palette, which is navy and amber; the existing tokens were used, as the same brief requires. Filters appear only once records exist.

---
## Phase 08B — Fault / Correction Reporting

**Status: COMPLETE**

- **Route.** `#fault`, plus optional context `#fault=<module>:<item>`, handled by a listener in the same pattern as `#ref=` and `#isolate=`. The page is a Laboratory-section destination view; no fifth top-level section and no router changes.
- **Entry points, three only.** A "Report a correction" quick tile on the dashboard, a link in the credit block beside the existing email and phone, and a link in the footer. Plus one shared contextual button — a single element moved into whichever record is open — labelled "Report an issue with this record/page".
- **Context capture.** The button reads the current hash and fills in the module and item: `#sop=` → SOPs + instrument title, `#prot=`, `#rec=`, `#safe=`, `#chem=`, `#set=` → set title, `#ref=`/`#grp=` → sheet, `#isolate=` → isolate ID, `#tab=` → module only. The page route is recorded as a line in the report. No scientific record is touched and nothing beyond module, item and route is taken from the application.
- **Configuration.** `data/reporting.json` (953 B): version, dataset, enabled flag, `form_url: null`, `fallback_email`, 12 module names and 9 issue types. **No endpoint was invented.** The fallback address is the maintainer's address already published in the credit block; its provenance is recorded in the file itself.
- **Submission architecture — honest by design.** With `form_url` null the page shows an amber notice: online submission is not configured, because this is a static site with no server. The form therefore *prepares* a report: a live plain-text preview, a **Copy report** button (clipboard with a select-and-copy fallback, success announced through the Phase 06 live region) and a **Prepare email draft** button that builds a correctly encoded `mailto:` to the published address — the draft opens in the user's mail application and is never sent automatically. If a form URL is supplied later, the notice becomes a clearly labelled external link that states it leaves Lab OS.
- **Form.** Three fieldsets — what the report is about (module, item, issue type), what is wrong (description, suggested correction), and an explicitly optional "about you" (name, contact). Only the description is required; the error is shown inline, linked by `aria-describedby`, with focus moved to the field. A prominent caution says not to use the form for a laboratory emergency and links to Safety. No emergency contact was invented or altered.
- **Privacy.** Nothing is persisted: no `localStorage` keys are written, no analytics, no third-party script, no hidden identifiers. The generated report contains only what the user typed plus module, item, route and date.
- **Service worker.** `reporting.json` added to the precached core list; `APP_VERSION` 8.1.0. The runtime cache stays keyed by data version, so the 2.69 MB question and 1.06 MB reference payloads are not invalidated.
- **Testing.** Functional: direct `#fault`, contextual open from SOP, protocol, chemical, reference sheet, question set, isolate record and catalogue list, browser back and forward, reload, all three entry points, validation, copy (clipboard content verified identical to the preview), mailto construction, clear. Accessibility: one `h1`, no heading skips, every control named (the report field is labelled by its heading), fieldset/legend grouping, help and error text associated, no clickable non-controls, visible focus on all 12 form stops, no contrast failures in light or dark, focus moves to the page heading on open. Responsive: 320–1440 px with long item names and long descriptions, no horizontal overflow, 44 px controls on touch, 200% zoom and 150% text clean, reduced motion honoured. Offline (server stopped): the page opens from cache with 0 KB transferred, the configuration and issue types load from the core cache, copying works, and the note explains that an email draft needs a connection when it is sent. Regression: the Phase 06/07/08A behavioural suite is **identical** — zero console errors, failed requests, 4xx or broken links.
- **Integrity.** Every pre-existing dataset, the seven normalisation files, `assets/sciname.js` and the Phase 08A catalogue file are byte-identical (SHA-256). Counts unchanged: 26 SOPs, 128 chemicals, 25 formulations, 46 protocols / 295 steps, 10 safety topics / 30 blocks, 76 troubleshooting entries, 8,156 questions, 27 reference sheets, 223 diseases, 45 crops, 14 chemical categories, 0 isolate records.

**Known limitations.** Reports cannot be submitted from the browser — by design, since there is no server; the user copies the report or sends the prepared email. Context is captured for the routes listed above; a specific question inside a set is identified by set title only. Nothing is saved if the user navigates away before copying.

---
## Phase 08C — Per-instrument QR deep links

**Status: COMPLETE**

- **Encoder.** `assets/qr.js` (12.4 KB), written for this project — no library, no CDN, no network request, no new dependency. Byte mode, error-correction level M, versions 1–10, with Reed–Solomon error correction, block interleaving, all eight data masks scored by the standard penalty rules, and format and version information. It is fetched lazily the first time an SOP is opened, so visitors who never open an SOP do not download it.
- **Payload.** Only the canonical SOP URL: `https://surajthakor4011-prog.github.io/lab-sops/#sop=<id>`, with the ID passed through `encodeURIComponent`. The site address is a documented constant (`window.SITE_URL`, the address already printed in the credit block) — never `window.location.origin` — so a code generated while testing on localhost cannot encode a development URL. The existing `#sop=` route is unchanged and no SOP data was touched.
- **UI.** A compact card at the end of the SOP detail view: the code, the instrument title, its model line, "SOP &lt;id&gt; · Plant Pathology Lab OS", the full link as text, and two native buttons — **Copy link** (announced through the Phase 06 live region) and **Print QR label**. The code is always black on white inside a white plate, in every theme, with a four-module quiet zone. No QR is rendered for an unknown `#sop=` route.
- **Print label.** The print button adds a body class, prints, and removes it on `afterprint`. In that mode only the label prints: brand line, instrument name, model and SOP number, a 320 px code and the link. Ordinary SOP printing is untouched.
- **Verification.** All 26 SOP codes were decoded with OpenCV's detector — from the matrix, from the rendered SVG on screen and from the print label — and every payload matched its intended URL exactly; no code decoded to another SOP's URL. Special characters were checked with a URL containing a space, a slash and a query string. The matrices are not byte-identical to the reference encoder `segno`, which makes different but equally valid encoding choices; validation therefore rests on decoding, not on matrix comparison.
- **Service worker.** `qr.js` added to the precached shell; `APP_VERSION` 8.2.0. The runtime cache stays keyed by the data version, so the 2.69 MB question and 1.06 MB reference payloads were not invalidated. Offline (server stopped), the SOP page and its QR render from cache with 0 KB transferred.
- **Accessibility.** The code is an `<svg role="img">` with a descriptive name; it contains no focusable elements. The title, model, SOP number and full link are visible beside it, so the destination is available without scanning. Both buttons are native, 40 px tall, keyboard-reachable straight after the SOP heading and visibly focused. No heading skips, one `h1`, no contrast failures in light or dark, no horizontal overflow at 320–1440 px, 200% zoom and 150% text clean, reduced motion honoured.
- **Integrity.** Every pre-existing dataset, all normalisation files and `assets/sciname.js` are byte-identical (SHA-256). Counts unchanged: 26 SOPs, 128 chemicals / 14 categories, 25 formulations, 46 protocols / 295 steps, 10 safety topics / 30 blocks, 76 troubleshooting entries, 8,156 questions, 27 reference sheets, 223 diseases, 45 crops, 0 isolate records, reporting configuration unchanged.

**Known limitations.** No physical camera scan and no printed label were tested — validation is by software decoding only. Two of the 26 codes needed a higher-resolution capture before the software decoder locked on at the on-screen size; both decode at print size, and the on-screen code was enlarged to 180 px in response. Scanning a code obviously needs the device to reach the site or to have it cached already.

---
## Phase 08D — Progress export / import

**Status: COMPLETE**

- **Existing progress model, preserved as found.** Two key families in `localStorage`: `ppdrill:<setId>` = `{ord:[question indices], i, score, blocks:{<section>:{c,t}}}` (an unfinished run) and `ppbest:<setId>` = `{pct, done, total, at}` (the best result recorded). Nothing about that model was changed; the export layer copies these structures verbatim.
- **File format**, documented in a comment above the implementation: `format: "plant-pathology-lab-os/question-bank-progress"`, `format_version: 1`, `app`, `exported` (ISO timestamp of the export itself), `counts`, and `progress.drills` / `progress.best` keyed by the existing set identifiers. No question text, answers, explanations, reference content or unrelated `localStorage` (theme, recents, reporting drafts, catalogue) is included — verified on a real export. A representative file with one unfinished set and one best score is **1.4 KB**.
- **Where it lives.** A "Your progress on this device" panel at the end of the existing Question bank view — no new section, no new route, no second progress dashboard. It shows a live summary ("1 set in progress · 1 best score recorded"), an **Export progress** button (disabled when there is nothing to export), a labelled file input and an **Import progress** button.
- **Export** builds the JSON, serialises it with two-space indentation, downloads it through `Blob` + `URL.createObjectURL` + `<a download>`, revokes the URL, and announces the result. Filename: `plant-pathology-lab-os-progress-YYYY-MM-DD.json`. Nothing is sent anywhere and the file is never written to `localStorage`.
- **Merge, not replace.** Importing never downgrades this device: for a best score the stronger record wins (higher percentage; a tie is settled by the number of questions attempted), which mirrors the application's own `pct >= best` rule; for an unfinished run the copy that has reached the later question wins; a tie keeps the local copy. Because merging cannot lose progress, no destructive confirmation step is needed — the user still has to choose the file and then press Import, so selecting a file alone changes nothing.
- **Validation before any write.** The file is parsed in a `try`, then checked for the format identifier, an integer format version (a newer version is refused outright, an older one too), a present progress section, and per-record types — `ord` an array of integers, `i` an integer within that array, `score` an integer, `blocks` an object of `{c,t}` integers, and for best scores a 0–100 percentage with integer counts. Set identifiers are checked against the 89 set cards already in the markup, so validation needs no part of the 2.69 MB question file. Unknown sets are skipped and counted, not invented. Nothing is written until the whole file passes; a failed import leaves `localStorage` byte-for-byte unchanged, verified for ten different bad files.
- **Result reporting** uses real counts: "Imported 2 records exported on 2026-09-26: 0 added, 2 updated, 0 kept because this device already had the stronger record". Errors are plain sentences, never raw exceptions, and all of them end with "Your existing progress has not been changed."
- **Safety.** Imported strings are never placed in `innerHTML`, never executed, and can only ever write to `ppdrill:` / `ppbest:` keys for sets that exist. A file whose set identifier was `<img src=x onerror=alert(1)>` was skipped as an unknown set and nothing was injected.
- **No service-worker change** was needed: the feature adds no new asset, so `sw.js` and all cache versions are untouched and the 2.69 MB / 1.06 MB payloads were not invalidated. `index.html` grew 12.3 KB (241,235 → 253,532 B); the question bank still loads exactly as before, and the panel itself needs no question data.
- **Testing.** Export tested with no progress, one record, two sets, best-score and resume data; the file parses as JSON and contains no question or reference content. Import tested from one browser context into a clean one — the restored records were identical to the source and the resume and best-score badges reappeared ("In progress — question 5 of 47", "Best 33%"). Ten invalid files (malformed JSON, wrong format, newer version, older version, missing progress, wrong types, empty, unknown set, hostile identifiers, no file chosen) were all rejected with existing progress unchanged. Merge rules verified in both directions. Accessibility: native controls, the file input labelled with help text, one `h1`, no heading skips, no contrast failures in light or dark, focus moves to the status line after an import, everything keyboard-reachable with visible focus, 40–44 px targets, no horizontal overflow at 320–1440 px, 200% zoom and 150% text clean, reduced motion honoured. Offline (server stopped): the panel, the summary, the export download and the import all worked with **zero network requests**.
- **Integrity.** Every dataset, all normalisation files, `assets/sciname.js` and `assets/qr.js` are byte-identical (SHA-256). Counts unchanged: 26 SOPs, 128 chemicals / 14 categories, 25 formulations, 46 protocols / 295 steps, 10 safety topics / 30 blocks, 76 troubleshooting entries, 8,156 questions, 27 reference sheets, 223 diseases, 45 crops, 0 isolate records.

**Known limitations.** Only question-bank progress is portable; theme, recently-viewed and catalogue state are deliberately excluded. Merging cannot tell two different unfinished attempts apart — it keeps the one further through the set. Importing a file exported by a future format version is refused rather than partially read. The download itself was exercised through the test harness, not by hand in a normal browser window.

---
## Original roadmap phases 3, 8, 9, 10, 15 and 16

**Status: COMPLETE** — implemented after the release audit, each in one commit. Full detail is in
`CHANGELOG.md`; a per-phase report was delivered alongside each commit.

| Original phase | Commit | Summary |
|---|---|---|
| 3 — Design system | `40ce996` | `DESIGN_SYSTEM.md`; 49 semantic tokens; 154 of 182 applied colour literals tokenised; botanical-green palette with scientific accents; three subtle motifs |
| 8 — Calculator hub | `cb54726` | Categories, search, favourites, copy result, 25-entry calculation history, `#calc=<id>` links, input validation — formulas untouched |
| 9 — Exam mode | `84378c0` | Absolute-timestamp countdown, optional per-question limit, locked answers, negative marking, 17-field result sheet with review, 50-attempt history; practice mode unchanged |
| 10 — Progress, favourites, history | `0145b05` | Application-wide favourites (10 types), general history with ISO timestamps capped at 50, `#tab=progress` view, `#trb=` route; export format unchanged |
| 15 — Graphics and visual polish | `f6609a7` | Eight inline-SVG teaching diagrams, reference and empty-state treatment, SOP step progression and category badges, 180 ms microinteractions — no image files |
| 16 — Final QA and hardening | `1fe1a97` | Full release QA; fixed the unknown-SOP and unknown-protocol crashes and the offline Greek/Pi font 504s; `APP_VERSION` 8.3.0 |

Through all of these the datasets, the normalisation files, `assets/sciname.js` and `assets/qr.js`
stayed byte-identical, and the counts stayed at 26 SOPs, 128 chemicals, 25 formulations, 46
protocols, 10 safety topics, 76 troubleshooting entries, 8,156 questions, 27 reference sheets,
223 diseases, 45 crops and 0 isolate records.

---

## Recommended Implementation Order

1. ~~**Phase 02 — Architecture & Navigation.**~~ Complete.
2. ~~**Phase 03 — Data model & repository split.**~~ Complete.
3. ~~**Phase 04 — Technical debt.**~~ Complete.
4. ~~**Phase 05 — Content normalisation.**~~ Complete. Was: Controlled vocabularies for chemical category and storage; italicise taxa across all datasets; document and review flagged duplicate candidates; no chemical records are merged, renamed or deleted without the owner's explicit decision (the 14 groups / 32 records remain owner-review items).
5. **Phase 06 — UI/UX and accessibility.** Tab semantics and keyboard navigation, live regions, focus management, landmarks, optional dark mode.
6. **Phase 07 — Offline and performance.** Service worker, manifest, self-hosted fonts, installable on the laboratory phone.
7. **Phase 08 — New modules.** Culture collection catalogue, fault reporting, per-instrument QR deep links, progress export.
8. **Phase 09 — Repository hygiene.** README, changelog, `404.html`, metadata, favicon.

The blank emergency-contacts card should be filled from departmental sources at whatever point the owner has the information; it is not gated on any phase.

---

**Current Phase:** Phase 08D — Progress export / import (complete)

**Next Phase:** Phase 09 — as briefed
