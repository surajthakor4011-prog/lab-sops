# Plant Pathology Lab OS — design system

This documents the system **as implemented** in `index.html`. Everything below is in the code today;
nothing here is aspirational. There is no build step: the whole system is CSS custom properties defined on
`:root`, overridden for the dark theme and for print.

---

## Principles

1. **A reference tool, not a brochure.** Density, legibility and fast scanning come before decoration.
2. **Botanical identity, quietly applied.** Greens carry the plant-pathology identity; scientific accents
   carry meaning. Decoration never competes with content.
3. **Colour always has a job.** Every token is semantic — brand, surface, status, or taxonomic category.
   Nothing is named after the colour it happens to be.
4. **Contrast is not negotiable.** The application is used at a bench, on phones, under poor lighting.
5. **One system, three renderings:** light, dark and print, driven by the same token names.

---

## Colour tokens

### Brand — botanical greens

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--brand` | `#1F6B4F` | `#2E7856` | Primary accent: active pills, left borders, solid buttons |
| `--brand-deep` | `#123B2A` | `#0B1410` | Sticky navigation bar, footer |
| `--brand-soft` | `#4F9D69` | `#62B983` | Secondary accent, motifs, hover states |
| `--brand-text` | `#17553D` | `#62B983` | Headings and links on a surface |
| `--brand-grad-top` / `--brand-grad-bottom` | `#17553D` / `#0F3325` | `#16382B` / `#0B1410` | The brand block gradient |
| `--sage` | `#DCEBDD` | `#1C3327` | Soft fills where a green wash is wanted |

### Surfaces and text

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--paper` | `#F3F8F3` | `#0B1410` | Page background |
| `--surface` | `#FFFFFF` | `#122019` | Cards, panels, sheets |
| `--tint` | `#E6F1E8` | `#182A21` | Subtle fills, hover rows, progress tracks |
| `--tint-2` | `#EFF6F0` | `#16241C` | Zebra rows, banners, quiet panels |
| `--ink` | `#10201A` | `#E8F2EA` | Body text |
| `--muted` | `#4C6155` | `#A8B8AC` | Secondary text, metadata, counts |
| `--line` | `#C9DCCB` | `#294034` | Borders and dividers |
| `--on-brand` | `#FFFFFF` | — | Text on brand-coloured fills |
| `--on-dark-muted` | `#CFE2D3` | `#A8B8AC` | Secondary text on the brand block |
| `--accent-on-dark` | `#C8E6D1` | `#8FD3A8` | Tagline and leaf-vein divider on the brand block |

### Scientific accents

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--sci-blue` | `#2563EB` | `#60A5FA` | Molecular biology, DNA, PCR |
| `--sci-teal` | `#0F766E` | `#5EC5B6` | Bacteriology, microbiology |
| `--sci-purple` | `#7C3AED` | `#A78BFA` | Virology |
| `--sci-amber` | `#D97706` | `#FBBF24` | Caution |
| `--sci-red` | `#DC2626` | `#F87171` | Danger |
| `--info-bg` / `--info-line` | `#EAF1FE` / `#BBD2F8` | `#152438` / `#2B3F5E` | Protocol timers and neutral information panels |

### Status

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--warn-text` / `--warn-bg` / `--warn-line` | `#92400E` / `#FEF6E7` / `#D97706` | `#FBBF24` / `#3A2E12` / `#8A6A1E` | Precautions, moderate hazard, mid scores |
| `--danger-text` / `--danger-bg` / `--danger` | `#B3261E` / `#FDECEC` / `#DC2626` | `#F87171` / `#3D1A1A` / `#F87171` | High hazard, wrong answers, expired stock |
| `--emerg-bg` / `--emerg-bg-hover` | `#8C1D1D` / `#6E1414` | same | Emergency safety headers — deliberately identical in both themes |
| `--ok` / `--ok-bg` | `#15803D` / `#E7F5EC` | `#86D9A1` / `#133222` | Correct answers, good scores, low hazard |
| `--mark-bg` | `#FDF2B5` | `#5A4A12` | Search-hit highlighting |

### Taxonomic category colours

Used by reference-sheet badges and legends; the letter badge and its legend entry always share a token.

| Token | Light | Dark | Category |
|---|---|---|---|
| `--tax-fungus` | `#A2570F` | `#D9964A` | Fungus |
| `--tax-oomycete` | `#1D4FD0` | `#60A5FA` | Oomycete |
| `--tax-bacterium` | `#0B6F68` | `#5EC5B6` | Bacterium, phytoplasma |
| `--tax-virus` | `#6D28D9` | `#A78BFA` | Virus |
| `--tax-viroid` | `#5B21B6` | `#C4A6F5` | Viroid |
| `--tax-nematode` | `#1F6B4F` | `#62B983` | Nematode |
| `--tax-phanerogam` | `#5B6A62` | `#9AAAA0` | Phanerogamic parasite, alga |
| `--tax-other` | `#4A5A62` | `#8595A0` | Protozoa and anything unclassified |

In dark mode these fills are light, so badge text switches to `#0B1410`.

### Module accents

Each view sets `--tab-accent`, used for its heading, crumb and active chips:
SOPs `--brand`, Chemicals `--sci-amber`, Formulations `--sci-teal`, Calculators `--sci-purple`,
Protocols `--sci-blue`, Safety `--danger-text`, Troubleshooting `--warn-text`, Question bank `--brand-text`,
Reference and everything else `--brand-text`.

### Focus and elevation

- `--focus` `#1D4ED8` light, `#60A5FA` dark — a blue ring reads clearly against green surfaces.
- `--focus-on-dark` `#FFD166` — used inside the brand block and sticky bar.
- `--shadow-1` `rgba(18,59,42,.06)`, `--shadow-2` `.10`, `--shadow-3` `.14`, `--shadow-strong`
  `rgba(10,24,17,.28)`; in dark these become neutral blacks at `.25`–`.45`.

---

## Themes

- **Light** is the default (`:root`).
- **Dark** is applied two ways with identical values: `:root[data-theme="dark"]` for an explicit choice, and
  `@media screen and (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` for the system
  setting. An explicit choice always wins, and a small script in `<head>` applies it before first paint.
- **Print** re-declares the light tokens inside `@media print`, so a page printed from the dark theme still
  comes out light.

---

## Typography

- `'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`, self-hosted from
  `assets/fonts/` (Latin1, Greek and Pi subsets; weights 400, 500, 600, 700 and 400 italic;
  `font-display: swap`).
- Sizes are set in `rem` and run from `.66rem` (badges, tags) through `.85–.95rem` (body and controls) to
  `1.2–1.42rem` (view and brand headings). Body line-height is 1.55.
- Scientific names are italicised at render time by `assets/sciname.js`; never by hand in the source data.

## Spacing, radius, elevation

- Spacing uses a 4 px rhythm: 4, 6, 8, 10, 12, 14, 18, 22 px.
- Radii: `6px` chips and inputs, `8px` small panels, `10px` cards and articles, `12px` logo plates,
  `99px`/`999px` pills, `50%` dots.
- Elevation is limited to three levels plus one strong shadow for the sticky bar; cards mostly use a
  1 px `--line` border instead of a shadow.

## Focus states

One rule covers every native control: `outline: 3px solid var(--focus); outline-offset: 2px` on
`:focus-visible`, switched to `--focus-on-dark` inside the brand block and sticky bar. Programmatic focus
targets (headings, `main`, status lines) carry `tabindex="-1"` and no visible ring.

## Responsive breakpoints

`420`, `560`, `640`/`641`, `760`, `879`/`880` px, plus `@media (pointer: coarse)` for touch sizing and
`@media (prefers-reduced-motion: reduce)`. Layouts verified at 320, 360, 375, 414, 768, 1024 and 1440 px.

## Icon system

29 inline `<symbol>` definitions in a hidden sprite, used as `<svg class="ico"><use href="#i-…"></svg>`
(53 uses). Icons inherit `currentColor`, are `aria-hidden="true" focusable="false"`, and always accompany
visible text. GHS pictograms are separate symbols and keep their regulatory colours.

## Component conventions

- **Card:** `--surface` background, 1 px `--line` border, 10 px radius, often a 3–4 px left border in the
  module accent.
- **Chip / pill:** 99 px radius, `--tint` background, `--brand` when active; toggle chips carry
  `aria-pressed`.
- **List → detail:** a list pane plus a detail pane sharing one route; the detail heading receives focus.
- **Note panel:** `.epnote` for neutral information, `+ .amber` for a problem state.
- **Status line:** a `role="status"` paragraph beneath the controls it describes.

## Accessibility requirements

Every control is a native element with an accessible name; one `h1`; landmarks for banner, navigation, main
and contentinfo; `aria-current="page"` for navigation state; live regions for search counts, answer feedback
and import results; 24 px minimum and 40–44 px preferred touch targets on coarse pointers; no horizontal
overflow at 320–1440 px, 200 % zoom or 150 % text. Text contrast is verified in both themes by a scripted
audit of every view. **No formal WCAG conformance is claimed.**

## Reduced motion

Under `prefers-reduced-motion: reduce`, all animations and transitions collapse to `0.01 ms` and
`scroll-behavior` becomes `auto`; back-to-top jumps instantly. State changes remain visible — only movement
is removed.

## Botanical motifs

Three, all CSS, no images and no external requests:

1. a faint hyphae-like `repeating-linear-gradient` over the brand block, at 4.5 % white;
2. a leaf-vein divider — a 84 × 3 px bar that fades out at both ends;
3. a molecular-node cluster in the dashboard hero corner: three dots and two links at 16 % opacity.

---

## Colour literals deliberately kept

| Where | Why |
|---|---|
| Token definitions in `:root`, the two dark blocks and the print block | A token has to be defined as a literal somewhere |
| `#000` and `#bbb` inside `@media print` | Print forces true black text and a neutral hairline, independent of theme |
| `rgba(255,255,255,.10–.45)` on the brand block, sticky bar, theme button and search field | Translucent white overlays over a gradient; they must stay alpha-on-white rather than a fixed colour |
| `#FFFFFF` on `.qrbox` and `#0B1410` on dark badges | Scanning and legibility requirements that must not follow the theme |
| GHS pictogram SVGs in the markup (white diamond, `#D32F2F` frame, `#222` glyph) | Regulatory symbols; their colours are defined by GHS, not by this design system |
