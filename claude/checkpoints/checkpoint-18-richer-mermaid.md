# Checkpoint 18 — Richer Mermaid Diagram
**Date:** 2026-05-13
**Branch:** main
**Status:** The README's architecture diagram now shows: explicit cousin-side inputs, all 5 quiz questions, the storage organizer's date→hash→unavailable-IDs pipeline, the layout grid's height math, the cards-frame overflow strategy, the Haversine-from-Yale distance calc, the LDivIcon pins, the focusedUnitId cards↔pins binding, the in-repo data and asset sources (storageUnits.js, packing categories, 6 storage JPEGs, 5 opening PNGs, folder-tab SVG), the OpenStreetMap external tile service with bi-directional flow, and the localStorage rehydration loops for both persistence keys.

---

## 1. Context

Checkpoint 16's first README pass had a moderately-detailed Mermaid showing the three surfaces and basic flow. Tina asked for more detail. Expanded the diagram with subgraphs grouping each runtime surface plus three "supporting layers" (Data & Assets, External Services, Browser Persistence), each pointing back into the surfaces that read/write them.

Validated the Mermaid syntax by rendering it with `@mermaid-js/mermaid-cli` locally — output was a clean SVG, no parse errors.

What was added beyond the prior version:

**Inputs spelled out.** The arrow from `Cousin` to `AppShell` now lists every input category: tab clicks, quiz answers, add-item text, dates, sort pick, card hover, map pan/click. The spec's emphasis is "what *receives* input" — so the input categories are visible at the top, not buried in component labels.

**Opening Screen broken open.** Was a single node; now shows the skyline backdrop, the title (with the Cinzel + Pinyon Script + gold-gradient detail), and the decorative PNG layer as siblings.

**Wizard detail.** Was a single `Wizard` node; now also shows the `useState: questionIndex` and `progress 0–100%`, with the 5 questions condensed into one summary node ("Q1 storage need · Q2 room type · Q3 packing style · Q4 timeline · Q5 free-text optional · Skip") that flows into PackingList via `onComplete`. Collapsed from a 5-arrow chain to keep the visual budget reasonable.

**PackingList depth.** Shows the collapsible categories with the "non-reflowing two-column flex" implementation note, the add-item flow, and the modal — with the modal looping back to PL (`pick or create category`), reflecting the bi-directional state flow.

**Storage Organizer pipeline.** Date inputs (`native input.showPicker`), Update click → `hashCode from-to` → `unavailableIds Set (2 of 6 deterministic)`. Then a separate layout track: `Layout grid (height: calc 100vh − 6rem, align-items: stretch)` → splits into `Cards Frame (flex 1, overflow-y: auto, custom 8px scrollbar)` and `StorageMap (Leaflet 1.9.4)`. The Filter Dropdown feeds `sortBy` into the `sortedUnits` memo, which derives `Haversine miles vs Yale Old Campus 41.3081, −72.9298`. The `Avail` set fans out to both `Cards` and `Pins`. The `focusedUnitId state` binds `Cards <--> Pins` (bidirectional).

**Data & Assets subgraph** (new). Five cylinders for the in-repo sources, each pointed to by the components that consume them via dotted arrows: storage cards read photos + records, pins read records, packing list reads category schema, opening reads the backdrop + decorative PNGs, tabs read the SVG geometry.

**External Services subgraph** (new). OpenStreetMap with bidirectional flow: `Map -.tile requests.-> OSM` and `OSM -.PNG tiles.-> Map`. Makes the only external network dependency visible.

**Browser Persistence subgraph** (new). Both `movebook:answers` and `movebook:tasks`, each shown as a read-write loop (`.useLocalStorage.->` and `.rehydrate.->`) so the persistence isn't just write-only.

Used dotted arrows (`-.->`) for asset/data references and external services to visually separate them from the synchronous component-to-component flow (`-->`). Subgraph titles use leading/trailing spaces inside quotes for a small text padding (Mermaid renders the title tightly otherwise).

---

## 2. Human Directions

Starting from checkpoint 17:

1. **`README.md`** — replace the existing Mermaid block with the richer version. Key structural changes:
   - Top-level chart direction stays `flowchart TB`.
   - Wrap each surface in a subgraph with a quoted title: `subgraph OSGrp[" Opening Screen "]`.
   - Add three trailing subgraphs (Data & Assets, External Services, Browser Persistence) with dotted-arrow connections from components into them.
   - Use a single summary node for the 5 quiz questions rather than 5 individual nodes (keeps the visual budget down).
   - Use `<br/>` for line breaks inside node labels.
   - Use Unicode arrows/symbols (↑ ↓ ★ • · −) for inline detail.

2. **Optionally validate locally** before committing — Mermaid's GitHub renderer is usually permissive but it's worth catching a typo first:
   ```bash
   npx --yes -p @mermaid-js/mermaid-cli mmdc -i README.md -o /tmp/test.svg
   ```
   A successful SVG render means GitHub will render too.

3. **No build needed** — README-only change.

---

## 3. Records of Resistance

**R1 — Collapsed Q1–Q5 from 5 nodes into 1 summary node.**
First draft had `Wiz --> Q1, Wiz --> Q2, ... Wiz --> Q5, [Q1 & Q2 & Q3 & Q4 & Q5] --> PL`. That used Mermaid's multi-source `&` syntax which works but renders as 5 parallel arrows — visually noisy for what's logically one path (Wizard collects all answers, then on completion routes to PackingList). Replaced with a single summary node ("5 Questions · Q1 storage need · …") with one arrow into PL. Detail preserved in the node label; visual budget recovered.

**R2 — Validated with mermaid-cli rather than just trusting it.**
GitHub silently fails to render bad Mermaid (shows the raw code block). Tina would notice when she pushes and the README looks broken. Spent the extra 10 seconds to render locally via `mmdc` — confirmed the SVG generates with no parse errors before committing. Cheap insurance.

**R3 — Used dotted vs. solid arrows intentionally.**
Solid arrows for synchronous component-to-component flow (Tabs → MM, Wiz → PL, Hash → Avail). Dotted arrows for asset/data lookups, external network calls, and persistence reads/writes. Reader can tell at a glance whether an edge is "code calls code" or "code reads data" — important because the data/external layer is the part of the system that *changes* infrequently and is worth thinking about separately.

---

## 4. Successes

**S1 — Diagram now answers the spec's three questions visually.**
"What receives input" = the labeled arrow from Cousin into AppShell + the input categories listed. "How the system processes it" = the three surface subgraphs with their internal pipelines. "What it outputs" = the rendered UI (every leaf node), the localStorage writes (Persistence subgraph), the OSM tile requests (External subgraph). One picture, three answers.

**S2 — Asset and external dependencies are now visible.**
Before, the diagram showed only components and component-to-component flow. Now you can see: which files in `public/` matter, which `src/data/` modules drive what, and the single external service (OSM). For a reader auditing the project, this is the "what does this code actually depend on?" question answered without grep.

**S3 — Persistence shown as read+write, not just write.**
Each `movebook:*` localStorage node has two arrows: one for write (`.useLocalStorage.->`) and one for read/rehydrate (`.rehydrate.->`). That makes it obvious that quitting and reopening the site doesn't lose state — a UX property the cousin will benefit from but that would be invisible if persistence were drawn as one-directional.
