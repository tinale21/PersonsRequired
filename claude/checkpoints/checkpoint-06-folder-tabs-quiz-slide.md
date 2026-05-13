# Checkpoint 06 — Folder Tab, 5-Question Quiz, Panel Slide
**Date:** 2026-05-13
**Branch:** main
**Status:** Active-tab now uses an SVG folder shape with tail extensions. Quiz expanded to 5 questions (last is optional open-response). Tab switch slides between Move Method Finder and Storage / Shipping Organizer.

---

## 1. Context

Three threads from this iteration session, plus a handful of polish moves on the Move Method Finder and Storage list:

**Folder-tab shape, finally landed via SVG.** Polygon clip-paths bottomed out: every concave fillet attempt either looked faceted, chamfered the wrong way, or required a tail protrusion that polygon couldn't draw cleanly without leaving a gap in the middle of the bottom. Tina exported a Figma SVG (`Group 4.svg`) with the exact shape — slopes, tail extensions at the bottom corners, and the body's curve continuation — and we now use it as the active tab's background. The SVG's `viewBox` was cropped from `0 0 496 90` to `0 0 496 89.4445` so the shape's bottom aligns with the SVG's bottom (eliminates the floating-gap-between-tab-and-body issue). Top corners were re-tuned with explicit `A 10 10 0 0 1 ...` SVG arc commands for a smoothly convex outward radius.

**5th question — optional open response.** Added a `notes` question to `questions.js` with `type: 'text'` and `optional: true`. The Wizard handles three cases now: single-select buttons, multi-select grid, and a textarea with optional skip. Skip button appears next to the primary CTA when the textarea is empty; it disappears the moment the user starts typing. Progress bar formula adjusted from `(index / total)` to `(index / (total - 1))` so it ticks 0 / 25 / 50 / 75 / 100 across the five questions (last question shows 100%).

**Smart-animate-style tab switching.** Switching between Method Finder and Storage / Shipping Organizer now slides horizontally with cross-fade rather than snap-replacing. Both panels stay mounted (state preserved). Inactive panel sits at `transform: translateX(±100%)` with `opacity: 0`, active sits at `translateX(0)` with `opacity: 1`. The folder-tab SVG indicator itself fades between tab positions via a `::before` pseudo-element so the active-tab visual transitions instead of snapping.

**Polish on Move Method Finder list.** Packing list grid changed from `grid-template-columns: repeat(2, 1fr)` (which forced matched row heights and left empty space below short categories) to `columns: 2` with `break-inside: avoid` — categories now pack naturally. List rows themed to `#F9F8F8` fill + `#E0E0E0` stroke; input field matched.

**Polish on Storage / Shipping Organizer.** Search bar matched the list-row treatment and got the two-layer Figma drop shadow.

**Background standardized to `#F9F8F8`.** Shell + active tab fill + list rows + search bar all on the same off-white.

**Progress bar got a percent label** on the right side of the track (`{Math.round(progress)}%`), `tabular-nums` so the digit width is stable.

---

## 2. Human Directions

To recreate the state of this commit from the end of checkpoint 05:

1. **Add 5th question + textarea/skip support.**
   - `src/data/questions.js`: append `{ id: 'notes', text: '...', type: 'text', optional: true, placeholder: '...' }`.
   - `src/components/MoveMethodFinder/Wizard.jsx`: add `setText` handler, add `handleSkip`, branch the option rendering on `q.type === 'text'`, add Skip button when `q.optional && !current`, update `hasAnswer` to return `true` for optional questions.
   - `src/components/MoveMethodFinder/Wizard.css`: add `.wizard__text-wrap`, `.wizard__textarea`, and `.wizard__skip` styles.

2. **Progress bar formula.** Change `progress = ((index + 1) / total) * 100` → `progress = total > 1 ? (index / (total - 1)) * 100 : 0`. Add `<span className="wizard__progress-label">{Math.round(progress)}%</span>` next to the track, with `font-variant-numeric: tabular-nums`.

3. **Drop the polygon clip-path on `.tab--active`.** Copy `~/Downloads/Group 4.svg` to `public/tab-shape.svg`. Update its `<svg>` tag to set `viewBox="0 0 496 89.4445"` and `preserveAspectRatio="none"`. Replace the original tiny top-corner curves in the main path with explicit arc commands: `A 10 10 0 0 1 ...` for both top corners. Slope endpoints adjusted so the arc tangent lines match: top-right at `(432.17, 5.36)` and top-left at `(64.68, 5.31)`. Bottom edge unchanged. Tail paths unchanged.

4. **Active tab background via pseudo-element.** Add `.tab::before { content: ''; position: absolute; inset: 0; background: url('/tab-shape.svg') center / 100% 100% no-repeat; opacity: 0; transition: opacity 280ms; z-index: 0 }`. Set `.tab--active::before { opacity: 1 }`. Add `.tab__label { position: relative; z-index: 1 }` so text sits over the SVG. Remove the polygon `clip-path` and the inline `background` on `.tab--active`. Tab height bumped from 56 → 64 px to give the SVG's tail features vertical room.

5. **Slide between panels.** In `src/App.jsx`, wrap both panels in `<div className={shell__panels shell__panels--${activeTab}}>`. Render both `MoveMethodFinder` and `StorageOrganizer` simultaneously. Add `aria-hidden` on the non-active panel.

6. **AppShell.css slide rules.** Add `.shell__panels { display: grid; grid-template-areas: "stack"; overflow: hidden }` and `.shell__panel { grid-area: stack; transition: transform 460ms / opacity 380ms; will-change: transform, opacity }`. Method's default `transform: translateX(-100%)`, Storage's `translateX(100%)`. Active variant resets to `translateX(0)` with full opacity and `pointer-events: auto`.

7. **Packing list switched to CSS columns.** Change `.plist__grid` from `display: grid; grid-template-columns: repeat(2, 1fr)` to `columns: 2; column-gap: 2.5rem`. Each `.plist__group` gets `break-inside: avoid; margin-bottom: 1.75rem`.

8. **Theme to `#F9F8F8`.** Update `.shell` and `.shell__body` backgrounds. List rows: `background: #f9f8f8; border: 1px solid #e0e0e0`. Input field same. Storage search bar same plus two-layer drop shadow: `0 4px 6px 0 rgba(224,224,224,1), 0 2.5px 3px 0 rgba(224,224,224,0.05)`.

---

## 3. Records of Resistance

**R1 — Abandoned the polygon clip-path approach after many iterations.**
Spent the better part of this session trying to make `clip-path: polygon()` produce a folder-tab shape with concave fillets at the bottom and a tail protrusion below. Every approach hit a wall: chamfers looked outward-bevelled, concave arcs were faceted, tails-with-main-bottom-inset created a gap in the middle of the bottom edge. The honest call was to stop fighting polygon and use the Figma SVG that Tina exported. The SVG has real bezier curves and arcs, plus separate tail paths — none of which polygon can do cleanly. Switching to SVG-as-background was the right move even though it cost a session of iteration to arrive at.

**R2 — Top corners use explicit `A` arcs, not the original cubic Beziers.**
The original SVG had top corners formed by tiny cubic Bezier curves (~1 px radius). For "round more," I rewrote those segments as `A 10 10 0 0 1 ...` arc commands with the slope endpoints adjusted to be tangent. The first attempt used sweep-flag `0` and the corners read as concave (curving inward). Flipped to sweep-flag `1` for the correct convex outward curve. Lesson noted: SVG arc sweep flags determine which "side" of the chord the arc bulges to. Sweep `1` curves clockwise (visually), which for a CW polygon traversal at a convex corner is "outward."

**R3 — Quiz answers for the `notes` field do NOT yet affect the generated list.**
The 5th question is captured into `answers.notes` and persisted to localStorage but `listGenerator.js` doesn't read it. Could be wired in later (e.g., keyword detection — "winter" → boost winter clothes, "international" → add power adapter). Held back for now: the open-response is feedback / context, not currently a list-shaping input.

**R4 — Did NOT build the body-bump approach for tab→body merging.**
Tina's reference image showed the body's top edge having convex bumps where the tab meets it (the manila folder visual). Building that would require either (a) the body knowing the active tab's position via JS measurement or (b) restructuring tabs and body into one continuous element. I held back and instead made the SVG's tail extensions handle the visual transition. The tail features in the Figma SVG render the curl effect within the tab's own bounds — close enough to the manila reference for a school project, much simpler than body-position-aware bumps.

**R5 — Panel slide accepts a height-equal-to-max issue.**
With CSS grid stacking, the panels share a cell whose height is `max(method, storage)`. The shorter panel (usually the wizard) has visible empty space below it. The alternative — JS-driven container height that tracks the active panel — was deferred because the empty space is acceptable for a school-project demo. Note in the commit message.

---

## 4. Successes

**S1 — SVG path is the right tool for this shape.**
The clip-path polygon approach was a tar pit: every iteration revealed another way the polygon abstraction couldn't represent the shape Tina wanted. The Figma export uses three separate path elements (main body + two tails) which polygon can't compose. Switching to SVG-as-background-image landed the shape on the first try after the viewBox was cropped. Big payoff per line of code.

**S2 — Cross-faded tab indicator is a one-property change.**
Moving the SVG background from `.tab--active` to `.tab::before` with `opacity: 0 → 1` transition gives a smart-animate-like fade between tab indicators with zero extra structure. Both pseudo-elements always exist; only the active one is visible. The label sits on `z-index: 1` and is independent of the indicator opacity.

**S3 — Panel slide preserves state.**
Going from "render the active component" to "render both components and toggle visibility" means the cousin's quiz progress, the user's scroll position in the storage list, the focused storage card — all persist across tab switches. The slide transition is purely visual layer over stable state. Tina didn't ask for this but it falls out of the implementation for free.

**S4 — CSS columns fixed the bedding-toiletries gap with six lines.**
The grid-vs-columns swap on the packing list is the kind of fix that's near-instant in CSS columns but would have been a masonry library or position-absolute fiddling in any other implementation. Each category stays together via `break-inside: avoid`; spacing between stacked categories is one `margin-bottom: 1.75rem`.

**S5 — Tail position cropping was a 2-byte SVG edit.**
The "floating gap" between the tab and body was the SVG's `viewBox="0 0 496 90"` having ~0.6 px of empty space at the bottom (the shape stops at y=89.4445). Cropping the viewBox to `0 0 496 89.4445` aligned the shape's bottom with the SVG's bottom — fixed the gap. Two-character change, big visual improvement.
