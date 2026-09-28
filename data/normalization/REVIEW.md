# Phase 05 — Normalisation review

This folder records every normalisation decision so it can be audited. **No scientific text, chemical name, grade, hazard note, question, answer or reference sheet was rewritten. No chemical record was merged or deleted — 128 remain.**

Files: `integrity-baseline.json` (hashes and counts before the phase), `chemical-categories.json`, `chemical-storage.json`, `chemical-duplicates-review.json`, `scientific-names-qa.json`, and the dictionary `../taxa.json`.

## 1. Chemical categories — 49 → 14

The original `cat` field is kept unchanged on every record; the new `category` and `tags` fields are derived from it by the table below (per category string, never per record). Old category words remain searchable.

| New primary category | Records | Original categories → tags |
|---|---|---|
| Acids & bases | 7 | Acids & alkalis → alkalis; Acids & bases |
| Assay reagents | 8 | Assay reagents; Assay reagents (PPO assay) → PPO assay; Assay reagents (antioxidant) → antioxidant; Assay reagents (protein/phenol) → protein/phenol |
| Buffers | 20 | Buffers; Buffers & salts → salts; Buffers (TBE) → TBE, electrophoresis; Buffers (electrophoresis) → electrophoresis |
| Salts | 14 | Inorganic salts → inorganic; Salts; Salts (PCR) → PCR |
| Detergents & surfactants | 9 | Detergents → detergents; Detergents & surfactants; Detergents & surfactants (ELISA washes) → ELISA washes; Detergents / molecular biology → detergents, molecular biology; Surfactants → surfactants |
| Stains, dyes & indicators | 6 | Stains & dyes → stains, dyes; Stains & indicators → stains, indicators |
| Media, substrates & supplements | 16 | Media & substrates → media, substrates; Media & supplements → media, supplements; Selective media additives → selective media additives |
| Molecular biology reagents | 12 | Molecular biology; Molecular biology (DNA precipitation) → DNA precipitation; Molecular biology (DNA stain) → DNA stain; Molecular biology (PAGE) → PAGE; Molecular biology (buffers) → buffers; Molecular biology (denaturant) → denaturant |
| Solvents | 8 | Solvents; Solvents / molecular biology → molecular biology |
| Growth regulators & defence inducers | 6 | Defence inducers → defence inducers; Growth regulators → growth regulators |
| Preservatives | 5 | Preservatives |
| Oxidisers & reactive chemicals | 3 | Oxidisers → oxidisers; Reactive hazards → reactive hazards |
| Virology reagents | 5 | Virology (density gradients) → density gradients; Virology (mechanical inoculation) → mechanical inoculation; Virology (reducing agent) → reducing agent; Virology (sap antioxidant) → sap antioxidant; Virology / osmotic stress → osmotic stress |
| General & miscellaneous | 9 | Consumables → consumables; Culture preservation → culture preservation; Fixatives (microscopy) → fixatives, microscopy; General reagents → general reagents; Miscellaneous → miscellaneous; Proteins → proteins; Sealing & mounting → sealing & mounting; Soil & amendments → soil & amendments |

**Judgement calls for the owner:**

- **Buffers & salts** → Buffers, tag "salts". Most members are buffering agents (TRIS, phosphates, borate, diethanolamine). Sodium chloride also carries this category and so sits under Buffers; the owner may prefer Salts.
- **Consumables** → General & miscellaneous, tag "consumables". Its only member, HiIndicator pH paper, therefore sits in a different primary from "pH indicator papers" (Stains & indicators). The two are also a possible-duplicate pair.
- **Proteins** → General & miscellaneous, tag "proteins". Single member (egg albumin); no closer primary without re-classifying by chemistry.
- **Fixatives (microscopy)** → General & miscellaneous, tags "fixatives", "microscopy". Single member (glutaraldehyde).
- **Oxidisers / Reactive hazards** → Oxidisers & reactive chemicals. Picric acid (Reactive hazards) grouped with the two potassium dichromate records.

## 2. Storage — 34 distinct values

Each record keeps its original `store` text, and gains a `storage` object (`raw`, and where explicitly written `temperature`, `location`, `conditions`, `container`; everything else verbatim in `notes`). Nothing was inferred. The page still displays the original wording, and the cold-storage filter still uses the original text, so its results are unchanged.

**For the owner to review:**

- `Cold, dark` — "Cold" is not stated as 2–8 °C, so this record does not appear under the "Cold storage (2–8 °C)" filter (unchanged behaviour). Owner to confirm the intended temperature.
- `RT (stock NOT in refrigerator — see fridge notice)` — Refers to a fridge notice that is not part of the dataset.
- `RT flammables area; chill in deep freezer before DNA work (see fridge notice)` — Shown under the cold-storage filter because it mentions the deep freezer (unchanged behaviour), although storage temperature is RT.

## 3. Possible duplicate chemicals — 14 groups, 32 records, 0 merged

| Group | Records (index · name) | Reason |
|---|---|---|
| Isoamyl alcohol | 53 · Iso-Amyl Alcohol<br>54 · Isoamyl alcohol | Name variant (hyphenation/capitalisation) of the same compound; different "use" text. |
| Dipotassium hydrogen phosphate | 26 · Di-potassium hydrogen orthophosphate<br>27 · Di-potassium hydrogen phosphate<br>89 · Potassium phosphate Dibasic Anhydrous | Synonymous names (orthophosphate = phosphate; "dibasic" = hydrogen phosphate). Record 89 states anhydrous; 26 and 27 state no hydrate. Record 89 also carries a different original category. |
| Disodium hydrogen phosphate (anhydrous) | 28 · Di-sodium hydrogen orthophosphate anhydrous<br>29 · Di-sodium hydrogen phosphate anhydrous GR<br>111 · Sodium phosphate Dibasic Anhydrous | Synonymous names; all three state anhydrous. Record 29 is GR grade; 28 and 111 state no grade. Record 111 was not in the Phase 01 list. |
| Potassium dichromate | 83 · Potassium dichromate (K2Cr2O7)<br>84 · Potassium dichromate AR | Same compound; record 84 is AR grade, record 83 states no grade. |
| Sodium dodecyl sulphate (SDS) | 60 · Lauryl sulphate sodium salt (SDS)<br>106 · Sodium dodecyl sulphate (SDS)<br>108 · Sodium Lauryl Sulphate AR<br>109 · Sodium lauryl sulphate GR (SDS) | Four names for the same compound (sodium lauryl sulphate = sodium dodecyl sulphate = SDS). Record 108 is AR, 109 is GR, 60 and 106 state no grade. Phase 01 listed only 108 and 109. |
| Sodium diethyl dithiocarbamate | 102 · Sodium diethyl dithiocarbamate<br>103 · Sodium diethyl dithiocarbamate AR | Same compound; record 103 is AR grade. The two carry different original categories (Assay reagents / Virology). |
| pH indicator paper | 49 · HiIndicator pH paper<br>74 · pH indicator papers | A named product and a generic entry; possibly the same stock. They carry different original categories and therefore different primary categories. |
| Bis-acrylamide | 9 · Bis N,N'-methylene bis-acrylamide<br>10 · Bis-acrylamide | N,N′-methylene-bis-acrylamide is the full name of bis-acrylamide. |
| Polysorbate 20 (Tween 20) | 80 · Polysorbate 20 (Tween 20)<br>125 · Tween 20 | Tween 20 is the trade name of polysorbate 20. The two carry different original categories. |
| Sodium hydrogen carbonate | 100 · Sodium bicarbonate AR<br>107 · Sodium hydrogen carbonate AR | Sodium bicarbonate = sodium hydrogen carbonate; both records are AR grade. Strongest candidate for a true duplicate. |
| Citric acid | 23 · Citric acid<br>24 · Citric acid anhydrous GR | Record 24 is anhydrous GR; record 23 states neither hydrate nor grade. |
| Sodium dihydrogen orthophosphate | 104 · Sodium dihydrogen orthophosphate<br>105 · Sodium dihydrogen orthophosphate dihydrate LR | Record 105 is the dihydrate, LR grade; record 104 states neither. |
| Sodium tetraborate (borax) | 30 · Di-sodium tetraborate (Borax)<br>114 · Sodium Tetraborate Decahydrate | Borax is usually the decahydrate; record 30 does not state the hydrate. Possibly the same material. |
| Potassium hydroxide | 55 · KOH - liquid<br>86 · Potassium hydroxide (KOH) (Pellet) | Same compound in different physical forms (liquid, pellets) — probably separate stocks, listed for completeness. |

Every group is **OWNER REVIEW REQUIRED**. Decide for each whether it is one stock, different grades, or different bottles.


## 4. Scientific names

Italics are applied at display time from the dictionary in `data/taxa.json` (274 genera, 11 names italicised only as binomials, 644 species epithets). The stored text is unchanged; the 9,260 existing `<i>` tags are untouched and never nested.

| Dataset | Binomials | Genus only | Abbreviated (M. phaseolina) | f. sp./pv./var. epithets |
|---|---|---|---|---|
| sops | 0 | 0 | 0 | 0 |
| chemicals | 0 | 2 | 0 | 0 |
| formulations | 0 | 2 | 0 | 0 |
| protocols | 5 | 47 | 5 | 0 |
| safety | 0 | 2 | 0 | 0 |
| troubleshooting | 0 | 12 | 0 | 0 |
| quiz-nematology | 57 | 38 | 10 | 0 |
| questions | 3947 | 2184 | 137 | 299 |
| references | 84 | 170 | 102 | 10 |
| **Total** | **4093** | **2457** | **254** | **309** |

**Ambiguous cases for review** (full lists in `scientific-names-qa.json`):

- Names that are also ordinary words, left roman when no epithet follows — 46 distinct, 296 occurrences (mostly *Thrips* used as a common noun, and "Citrus canker", "Citrus tristeza", "Citrus greening").
- Possible misspelt species epithets, italicised as written — 116 distinct, 254 occurrences. Examples: campestri (→ campestris?), viride (→ viciae?), citricidus (→ citricida?), moniliformae (→ moniliforme?), amaranticolor (→ amaranthicolor?), auxonopodis (→ axonopodis?), americanum (→ americana?), solanaceaum (→ solanacearum?), albo-atrum (→ alboatrum?), padi (→ pisi?), africana (→ americana?), amylowora (→ amylovora?).
- Possible misspelt genera, left roman — 7 distinct, 22 occurrences: Phytopthora (8), Xanthomanas (8), Xiphenema (2), Barberis (1), Plasmapara (1), Xanthomona (1), Trichodorous (1).

Nothing was corrected. These are listed only so the owner can decide.


**Limitations**

- Detection is dictionary-based: genera not in data/taxa.json stay roman (by design — false positives are worse than misses).
- A genus followed by an unrecognised or misspelt epithet is italicised as a genus only; the epithet stays roman and is listed above.
- Binomial-only names (Citrus, Datura, Oryza, …) stay roman unless a listed epithet follows.
- Virus species names (e.g. "Citrus tristeza virus") are left roman; ICTV italicisation of virus species is not attempted.
- Names split across HTML tags (for example by search highlighting) are not joined.
