# Checkpoint 03 — The Move Book, first full build
**Date:** 2026-05-12
**Branch:** main
**Status:** All three Figma surfaces implemented in high-fidelity with animation. Local build + dev server verified. Not yet visually inspected by Tina in a browser. Not yet shown to cousin (First Contact date is now flexible).

---

## 1. Context

This is the first real build of The Move Book on top of the pipeline established in checkpoints 01–02. The work in this commit was scoped after Tina's directive: *"Please build out in high-fi and with animation."* and the related update that there is no longer a hard external deadline for tomorrow.

**Design Argument inputs locked before this build:**
- **Person:** Tina's cousin, recent high school graduate, attending Yale in fall 2026, moving Atlanta → New Haven.
- **Problem:** Move planning scattered across notes, shopping lists, family conversations, online searches. Currently uses the Notes app. Has not looked at storage. Distracted by final exams and IB testing. Has only briefly thought about packing — bedding and clothing essentials only.
- **Observable signal of "Helped":** *"She finishes a packing decision list without abandoning it halfway."* This is the standard every feature is evaluated against.
- **Platform:** Web app (the existing Vite/React + GitHub Pages pipeline). Defense TBD in design-argument.md; web is a reasonable fit for a cross-device, sharable, low-install-friction tool.
- **Qualification and Non-Negotiables:** TBD in design-argument.md.

**What's built in this commit:**

### Opening Screen
- `src/components/OpeningScreen/` — animated reveal of nine sequential Figma frames (skyline → "The Move Book" title → Atlanta → New Haven route → subtitle → ATL/NHV tickets → New Chapter seal → Yale bulldog → gold airplane). Frames stack and crossfade in order with staggered delays. JSX Start button fades in after the eighth frame and is disabled until the reveal completes.
- Frames compressed to JPEG q75, max 1600px wide; total payload 1.5 MB across 9 frames.
- Respects `prefers-reduced-motion`.

### App Shell + Tab Bar
- `src/components/AppShell/AppShell.jsx` + `TabBar.jsx` — header strip uses the Yale skyline frame as a background with a navy gradient overlay; two tabs with clip-path angled cuts to match the Figma's trapezoidal active-tab shape. Active tab is cream-card; inactive sits as text on the dark strip. Mobile keeps the same shape with smaller dimensions.

### Move Method Finder (the core utility)
- `src/components/MoveMethodFinder/MoveMethodFinder.jsx` — state holder that decides whether to show the Wizard or the PackingList based on whether the quiz has been completed. Persists answers + tasks to `localStorage` so the cousin can close the tab and resume mid-list.
- `Wizard.jsx` — 4-question flow with progress bar, animated question transitions, and a Next-only-after-selection rule that matches the Figma. Three single-select questions and one multi-select grid (already-owned items). Back navigation, "See My List" CTA on the last question.
- `PackingList.jsx` — generated, grouped list with full CRUD: check (animated tick + strikethrough), delete (icon button), add custom item ("Type your item here..." + Add button → goes to an "Other" group). All/Active/Completed filter row. Live "N tasks left" counter. Redo-quiz link.
- `src/data/questions.js` — question/option config.
- `src/data/listGenerator.js` — **the quiz answers actually shape the list.** On-campus brings Twin XL specifics; off-campus swaps in kitchen and full-size bedding; sharing-room toggles solo items like mini fridge and floor lamp; packing-light truncates each category to ~60%; fully-prepared appends extras (mattress protector, dress shoes, snow boots, first aid kit, etc.); already-owned categories are excluded entirely. Cleaning Supplies always included.
- `src/hooks/useLocalStorage.js` — small hook wrapping `useState` with JSON-serialized persistence.

### Storage / Shipping Organizer
- `src/components/StorageOrganizer/StorageOrganizer.jsx` — Figma-matching search bar (location, From/To dates, Update button); two-column results layout with six storage unit cards on the left and an interactive map on the right. Hover/focus on a card highlights its map pin and vice versa.
- `StorageMap.jsx` + CSS — abstract CSS-only map (land/water gradients, road strokes via inline SVG, park ovals, city/bay labels) with absolutely-positioned price pins ($25+, $63+, etc.). Hovering or clicking a pin shows a Figma-style tooltip with rating, address, "From $X" badge.
- `src/data/storageUnits.js` — six fake-but-plausible New Haven storage facilities (Safeguard, StorQuest, Extra Space, Prime, CubeSmart, Public Storage) with per-facility brand-color accent, address, rating, three size/price tiers, and map-pin coordinates.

### Foundation
- Google Fonts: Cinzel, Cormorant Garamond, Inter — loaded via `<link>` in `index.html`. Currently only Inter is referenced by components; the others are reserved for future typographic use.
- `src/index.css` — design tokens for the Move Book palette (deep navy, gold, cream, ink), typography, easing curves.
- `src/App.jsx` — top-level stage switcher: `'opening'` → OpeningScreen → click Start → `'app'` → AppShell with active-tab routing.

**What is NOT built in this commit:**
- Real storage search or real interactive map — the map is CSS-art with positioned pins; the search bar accepts input but does not filter results.
- Storage cards do not click through to an external listing.
- Date pickers exist but selected dates do not affect anything.
- Mermaid diagram in README is still placeholder (the architecture is now real and the diagram should be updated to reflect it).
- AI Direction Log, Records of Resistance doc, Five Questions reflection, Post-Mortem — student-authored deliverables, untouched by this commit.
- Three Design Argument sections still TBD in `claude/design-argument.md`: Qualification, Platform Decision rationale, Non-Negotiables.

---

## 2. Human Directions

To recreate the state in this commit from a clean checkout after checkpoints 01–02:

1. Read `claude/design-argument.md`, `claude/research-notes.md`, and the Figma exports in `claude/figma-screens/` — these are the inputs.
2. Add Google Fonts (Cinzel + Cormorant Garamond + Inter) via `<link>` in `index.html`.
3. Define design tokens in `src/index.css`: navy/gold/cream/ink palette, font families, easing curves.
4. Copy `claude/figma-screens/opening-01-skyline.png` through `opening-08-airplane.png` to `public/opening/`, convert each to JPEG (quality 75, max width 1600) using `sips`. Delete the PNGs. Total payload should land under ~2 MB.
5. Build components in this order:
   - `OpeningScreen` (stacked frames with staggered fade-in, JSX Start button overlay)
   - `AppShell` + `TabBar` (Yale skyline strip header, clip-path trapezoidal tabs)
   - Data files: `questions.js`, `listGenerator.js`, `storageUnits.js`
   - Hook: `useLocalStorage.js`
   - `MoveMethodFinder` → `Wizard` + `PackingList`
   - `StorageOrganizer` → `StorageMap`
6. Wire `App.jsx` to manage stage (`'opening'` vs `'app'`) and active tab.
7. `npm run build` should land at roughly 165 KB JS / 21 KB CSS pre-gzip with no warnings.
8. `npm run dev` and load `http://localhost:5173/PersonsRequired/` to confirm.

---

## 3. Records of Resistance

**R1 — Quiz logic over decorative quiz.**
Default AI suggestion would be to build a quiz that asks four questions and then renders the same canned list regardless. I rejected that because it makes the "Move Method Finder" name meaningless and, more importantly, would not advance the observable Helped: a 60-item generic list is more abandon-able than a tailored one. The answers genuinely change the output — already-owned categories are excluded, on-campus vs off-campus swaps the entire dorm vs apartment section, sharing-room toggles solo-room extras, packing-light trims every section to ~60%, fully-prepared adds extras. Tina will likely correct some mappings after talking to her cousin again. The point right now is that the mapping *exists* and can be edited in one file (`listGenerator.js`).

**R2 — CSS-art map over a real interactive map.**
The Figma shows a real Google Maps-style map. The honest thing to do for a school project is either (a) integrate Leaflet + OpenStreetMap tiles (a new dependency, but free with no API key) or (b) get a Google Maps API key. I rejected both for this pass. The cousin has not even looked at storage units yet, so the storage tab is closer to a *concept piece* than a tool she will use Wednesday. A CSS-art map with pins reads as "this is the design direction" without pretending to be live. Tina should call this out in the case study rather than implying the map is functional. If she wants a real map later, Leaflet is a 40 KB add and a few hours of work.

**R3 — Used Figma frames as direct background layers instead of recreating in code.**
For the opening sequence, the AI instinct is to render the title text in CSS using the loaded Cinzel font, recreate the tickets/seal/bulldog/airplane as SVGs, and animate each element individually. I rejected that. The fidelity gap between hand-coded vector recreations and the actual Figma exports (which include textured gold, vintage paper, hand-drawn skyline shading) is large, and the time cost of recreating each element well is significant. Layering the 8 flat frames as crossfade-stacked images preserves every brushstroke of the original design. Tradeoff: 1.5 MB of static images instead of ~50 KB of SVG. Acceptable for a school project with no traffic; would need to be revisited for production.

**R4 — Skipped baked-in Start button in frame 09 in favor of a JSX button.**
Frame 09 has the Start button rendered into the JPEG. I used only frames 01–08 as backgrounds and rendered my own interactive JSX button on top so it has hover/focus/active states and a real click target. Frame 09 is preserved in `claude/figma-screens/` for reference but is not used at runtime.

**R5 — `prefers-reduced-motion` respected.**
A user who has reduced-motion preferences sees the final state of the opening immediately, with the Start button visible. Default AI build would not have included this; I added it because the cousin (and graders) may use the site on devices with the system preference enabled.

---

## 4. Successes

**S1 — One Figma-driven build session.**
Tina shared 21 Figma frames in one message. The architecture (opening → two tabs → wizard + list / storage search) was clear from those frames alone — no follow-up questions needed about layout or copy. The Figma was developed enough that I could lift the question text, the category names ("Clothes", "Bedding", "Dorm Room Setup", "Cleaning Supplies"), and the filter labels ("All | Active | Completed") verbatim.

**S2 — Quiz answers shape the list (Helped-aligned).**
The mapping from `{housing, sharing, priority, owned}` to categorized tasks is the part of this build that is *most likely* to make the cousin's list feel like hers rather than generic. A shorter, more relevant list is more finish-able than a long generic one. This is the single design decision in this commit that most directly serves the observable Helped.

**S3 — `localStorage` persistence — invisible but important.**
The cousin is overwhelmed by exams. She will open this, check a few things, close it, and come back later. If she lost progress every reload, she would not come back. Quiz answers + tasks are persisted under `movebook:answers` and `movebook:tasks`. She can also redo the quiz from a link at the bottom of the list.

**S4 — Storage map ↔ card cross-highlight.**
Hovering a card highlights its pin on the map. Hovering a pin shows a tooltip and (because both use the same `focusedUnitId` state) highlights the corresponding card. This is a small piece of polish that costs little and reads as "this designer thought about how someone scans a map."

**S5 — Mobile responsive at every layout breakpoint.**
The 4-question grid drops from 3 columns to 2 on narrow screens. The packing list grid drops from 2 columns to 1. The storage map moves below the cards on narrow screens (instead of being a sidebar). The tab bar shrinks but keeps the angled cut. No layout has been verified in a real device yet — Tina should walk through this on her phone before showing the cousin.
