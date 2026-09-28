# Changelog

What each phase of work changed. Entries describe only what was actually implemented and
verified. Dates are given where they come from a commit or a dated report; earlier phases
were produced before the work was committed and carry no reliable date of their own.

## Current status

The whole 17-phase roadmap is implemented. Two numbering schemes appear below: the
**implementation phases** (01–10B), which is the order the work was actually carried out in,
and the **original roadmap phases**, the numbering the project was planned against. The
original-roadmap entries come first because they are the most recent work.

Service-worker version at this release: `APP_VERSION 8.3.0`, `DATA_VERSION 3`. The project
does not use a semantic version of its own; the service-worker version is the release marker.

Local history:

```
1fe1a97  chore: final qa and performance hardening                    2026-09-28
f6609a7  feat: complete graphics and visual polish
0145b05  feat: complete progress favorites history
84378c0  feat: complete exam mode
cb54726  feat: complete calculator hub
40ce996  feat: complete design system
3b91d77  chore: complete repository hygiene and metadata
ef182af  feat: add question bank progress export and import           2026-09-26
81a7ce4  feat: add QR deep links for instrument SOPs
992326f  Add files via upload  (origin/main before this release)
```

Implementation phases 02 to 08B were delivered before commits were made, so their changes sit
inside the commits above rather than in one commit each.

---

## Original Phase 16 — Final QA and performance hardening (`1fe1a97`, 2026-09-28)

- Full release QA: every subsystem, 22 valid routes with reload, 17 invalid or hostile routes,
  accessibility in both themes, 320–1920 px, 200 % zoom, offline, performance, robustness and
  data integrity.
- Fixed three pre-existing defects found by that QA: an unknown SOP id (`#sop=999`) and an
  unknown protocol index (`#prot=999`) each threw an uncaught error; both now fall back to
  their list view. The Greek and Pi font subsets returned 504 offline; they are now precached,
  so offline text keeps β, μ, α and the symbol set (`APP_VERSION` 8.2.0 → 8.3.0).
- Measurements at this release: first visit 20 requests and 836 KB, repeat visit 0 KB from the
  network, DOM ready 225 ms, 5,065 DOM nodes at start, 166 bytes of `localStorage` after a
  full session.
- Scientific data byte-identical; no feature added.

## Original Phase 15 — Graphics and visual polish (`f6609a7`)

- Eight original teaching diagrams drawn as inline SVG from the design tokens: septate hypha
  and conidiophore, bacterial cell shapes, plant-parasitic nematode, virus particle shapes,
  generalised disease cycle, DNA and amplification, culture plate and colony characters, and
  the diagnostic workflow. Each carries a title, description and caption, and states that it
  is a simplified teaching diagram rather than a specimen image.
- Reference groups open with their matching diagram; the dashboard hero carries the workflow
  figure; the empty culture collection carries the culture-plate drawing.
- SOP pages gained numbered step markers with a connector line, section icons and an
  instrument-category badge — no SOP text was altered.
- Microinteractions at 180 ms, disabled under `prefers-reduced-motion`. No image files, no new
  dependency, no service-worker change.

## Original Phase 10 — Progress, favourites and history (`0145b05`)

- Application-wide favourites for SOPs, protocols, formulations, chemicals, safety topics,
  troubleshooting entries, reference sheets, question sets, isolates and calculators, added
  from a shared control on any open record (`labsops:fav`; calculator stars continue to use the
  existing `labsops:calcfav`).
- General history of opened resources with ISO 8601 timestamps, relative display, newest
  first, de-duplicated, capped at 50 entries (`labsops:history`).
- A Progress destination at `#tab=progress` with counts, the favourites list with type filter
  and search, the history list, and links to the calculator and exam histories.
- Added `#trb=<index>` so troubleshooting entries can be reopened. The progress export format
  was deliberately left unchanged.

## Original Phase 9 — Question bank exam mode (`84378c0`)

- Timed exam mode driven by an absolute end timestamp: visible countdown, amber and red
  warning states, spoken warnings at 5 minutes, 1 minute and 30 seconds, and automatic
  submission at zero. Backgrounding or reloading cannot gain time.
- Optional per-question limit, locked mode that withholds answers and explanations until
  submission, and negative marking at ¼, ⅓, ½ or 1 mark per wrong answer.
- Exam-style result sheet with 17 fields and a full question review, plus per-set attempt
  history capped at 50 (`labsops:examcfg`, `labsops:examstate`, `labsops:examhist`).
- Practice mode is untouched and unchanged; question data was not modified.

## Original Phase 8 — Calculator hub (`cb54726`)

- The nine existing calculators gained categories (solution and concentration, molecular
  biology, microbiology and mycology, media preparation), instant search, favourites, copy
  result, save to history and per-calculator deep links `#calc=<id>`.
- Calculation history capped at 25 entries; favourites and history in `labsops:calcfav` and
  `labsops:calchist`.
- Input validation for empty and negative values, added without touching any formula — the
  calculator definitions are byte-identical.

## Original Phase 3 — Design system (`40ce996`)

- `DESIGN_SYSTEM.md` documents the implemented system: tokens, themes, typography, spacing,
  radii, elevation, focus, breakpoints, icons, component conventions, accessibility, motion
  and the taxonomic category colours.
- 49 semantic colour tokens replaced the colour-named ones; 154 of 182 applied colour literals
  became tokens, and the 28 that remain are documented with reasons.
- The palette moved to the botanical greens with scientific accents (blue molecular, teal
  bacteriology, purple virology, amber caution, red danger), applied through tokens with no
  layout change, plus three subtle motifs: hyphae strands, a leaf-vein divider and molecular
  nodes.

---

## Phase 09 — Repository hygiene and metadata

- Replaced the `README.md` stub with documentation of the application, the repository
  layout, every dataset's shape, how to add content, local testing, the GitHub Pages
  sub-path rules, reporting, QR codes, progress portability, the existing CC BY-NC 4.0
  credit block and a maintainer workflow.
- Added this changelog.
- Added `404.html`: a small, self-contained Pages fallback in the application's visual
  language that returns to the application by a relative path.
- Added page metadata: description, canonical URL, Open Graph and Twitter card tags, using
  the existing local application icon; `theme-color`, viewport, favicon, Apple touch icon
  and manifest link were already present and were left alone.
- Unknown `#tab=` values now fall back to the dashboard instead of leaving a blank view.
  Valid keys are unaffected.
- Removed dead `header …` selectors from four rules that also styled `.brandtop`; the
  `.brandtop` declarations were kept.
- Brought the previously untracked application files into git (`data/`, `assets/` other
  than `qr.js`, `manifest.webmanifest`, `.nojekyll`) and recorded the deletion of the
  superseded `data.json`, so the repository now contains a working copy of the site.

## Phase 08D — Question bank progress export and import (`ef182af`, 2026-09-26)

- Export and import of question-bank progress as a versioned JSON file
  (`plant-pathology-lab-os/question-bank-progress`, format version 1).
- Exports only `ppdrill:<setId>` (unfinished runs) and `ppbest:<setId>` (best results); no
  question content and no other application state.
- Import merges: the stronger best score and the further-advanced run win. Files are fully
  validated before anything is written, so a rejected file leaves progress untouched.
- Controls live in the existing Question bank view. `index.html` grew by 12.3 KB; no other
  file changed.

## Phase 08C — Instrument SOP QR deep links (`81a7ce4`)

- Added `assets/qr.js`, a QR encoder written for this project (byte mode, error correction
  level M, versions 1 to 10), loaded only when an SOP is opened.
- Each SOP detail page shows a code encoding its canonical deep link, plus "Copy link" and
  "Print QR label"; the printed label carries the instrument name, SOP number and code.
- The published site address is a constant, so codes generated during local testing still
  point at the published site. All 26 codes were decoded and verified by software.
- `sw.js`: `qr.js` added to the precached shell, `APP_VERSION` raised to 8.2.0.

## Phase 08B — Fault and correction reporting

- Added `#fault`, a reporting page that prepares a structured report rather than submitting
  one, with "Copy report" and a `mailto:` draft to the maintainer address already published
  in the credit block.
- Added `data/reporting.json` (configuration only: `form_url` is null, fallback email,
  module and issue-type lists).
- A contextual "Report an issue" button carries the open record's module and item.
- `sw.js`: configuration added to the precached core, `APP_VERSION` 8.1.0.

## Phase 08A — Culture collection

- Added the isolate register: `data/culture-collection.json`, shipped empty with an
  eight-group schema, and a Laboratory destination at `#tab=collection` with search,
  filters, a record list, a detail view and an empty state.
- Records use `#isolate=<id>`; unknown fields in a record still display, so the schema can
  grow without code changes.
- `sw.js`: dataset added to the precached core, `APP_VERSION` 8.0.0; the runtime cache was
  re-keyed to the data version so application updates no longer discard the large payloads.

## Phase 07 — Offline and performance

- Added `sw.js` and `manifest.webmanifest`: versioned caches for the shell, the core data
  and the large payloads, with cache-first, network-first and offline fallbacks per
  resource class.
- Self-hosted IBM Plex Sans (`assets/fonts/`, SIL Open Font License 1.1) and removed the
  Google Fonts requests, leaving no external runtime request at all.
- Added application icons (`assets/icons/`) and installability metadata.
- Offline verified with the server stopped: the application, its core data and anything
  already downloaded work with nothing transferred.

## Phase 06 — UI/UX and accessibility

- Skip link, one `<main>` landmark, labelled navigation regions, `aria-current` navigation
  semantics (not fake tabs), a consistent focus ring, focus management on view changes and
  after answering, live-region announcements, and accessible names for every control.
- Heading levels corrected, decorative icons hidden from assistive technology, touch
  targets enlarged on coarse pointers, three contrast failures fixed.
- Dark theme added through existing colour tokens, with a System/Light/Dark toggle that
  persists; printing stays light. Reduced-motion support.

## Phase 05 — Content normalisation

- Chemicals: 49 free-text categories reduced to 14 controlled categories with tags, and
  storage text parsed into structured fields; the original `cat` and `store` wording is
  kept on every record.
- Scientific names italicised at display time by `assets/sciname.js` from the controlled
  dictionary `data/taxa.json`; stored text unchanged.
- 14 groups of possible duplicate chemical records documented for review — **none merged,
  renamed or deleted**.
- `data/normalization/` added as the audit trail.

## Phase 04 — Technical debt and performance cleanup

- Fixed the back-to-top button, which had never been wired.
- Removed dead header-collapse code and unused CSS, consolidated the header rules and
  reduced 11 breakpoint values to 7.
- Externalised the two logos from base64 and added `.nojekyll`.
- `index.html` fell from 588 KB to 177 KB.

## Phase 03 — Data model and repository split

- Moved the inline data out of `index.html` into versioned files under `data/`; split the
  single 3.75 MB payload into `questions.json` and `references.json`, loaded on first use.
- Removed a 55.7 KB duplicated reference sheet; added per-payload error states.

## Phase 02 — Architecture and navigation

- Added the dashboard and the Home / Laboratory / Study / Reference structure, promoted the
  disease and pathogen reference to a first-class destination, and made the destination row
  scroll instead of wrapping on small screens. All existing deep links preserved.

## Phase 01 — Repository audit (`992326f` is the audited state)

- Audit of the original upload: one 566 KB `index.html`, a 3.75 MB `data.json`, a logo and
  a stub README. Recorded the content inventory, technical issues and the phase plan in
  `PROJECT_PROGRESS.md`.
