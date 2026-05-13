# Checkpoint 05 — Folder Tabs, Column List, Opening Polish
**Date:** 2026-05-13
**Branch:** main
**Status:** Tab bar shape rewritten as a folder tab. Packing list grid swapped for CSS columns (fixes uneven row gaps). Opening screen had a long iteration round of size/position/tint nudges. Build clean.

---

## 1. Context

This commit bundles three threads from the post-checkpoint-04 working session:

**Tab bar — folder tab shape.** The previous active-tab clip-path used a single angled cut on the outer edge (asymmetric). Tina sent a reference image of a manila-folder-style tab (narrow top, sloped sides, wider bottom flush with the body). Both active tabs now share one symmetric clip-path: `polygon(18px 0, calc(100% - 18px) 0, 100% 100%, 0 100%)`. Mobile uses a tighter `12px` inset version. The `.tab--method` and `.tab--storage` size-specific overrides were removed in favor of a single `.tab--active` rule.

**Packing list — uneven row heights fixed.** The list grid was `display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem 2.5rem`, which forces every row to be as tall as the tallest category in it. When Clothes (many items) sat next to Bedding (few items), Bedding had a big empty space below it before Toiletries appeared in the next row down. Switched to `columns: 2; column-gap: 2.5rem` with `break-inside: avoid` on each `.plist__group`. Now categories pack naturally into two columns without forced row alignment. `margin-bottom: 1.75rem` controls the vertical spacing between stacked categories.

**Opening screen — micro-iteration round.** Many small adjustments to the layered opening screen following Tina's directives. Captured in `Human Directions` below.

---

## 2. Human Directions

To recreate the state of this commit, starting from the end of checkpoint-04:

### Opening screen — sizing
- **MOVE/BOOK** held at `clamp(2.05rem, 5.2vw, 4.5rem)` (0.85× of original baseline, set in checkpoint-04).
- **Airplane** scaled down a second time: from checkpoint-04's `clamp(144px, 15.2%, 256px)` to `clamp(130px, 13.7%, 230px)` desktop, `clamp(79px, 15.8vw, 122px)` mobile.
- **Bulldog** rescaled to **1.45×** of original: `clamp(145px, 15.2%, 239px)` desktop, `clamp(116px, 29vw, 189px)` mobile.
- **Seal** rescaled to **0.92×** of original: `clamp(101px, 10.1%, 161px)` desktop, `clamp(74px, 15.6vw, 120px)` mobile.

### Opening screen — positioning
- **Plane**: `left: calc(7% - 10px)` desktop, `left: calc(4% - 10px)` mobile (10 px to the left).
- **Tickets**: `top: calc(56% + 5px); left: calc(8% - 10px)` desktop (5 px down, 10 px left). Mobile shifted via `bottom: calc(22% - 5px)`.
- **Bulldog**: `top: calc(44% + 120px); right: calc(9.5% - 5px)` desktop, `top: calc(62% + 120px); right: calc(4% - 5px)` mobile (cumulative 120 px down + 5 px right after a series of nudges).
- **Seal**: `top: calc(16% + 10px); right: calc(9% + 5px)` desktop, mirrored for mobile (10 px down, 5 px left).

### Opening screen — typography
- "Atlanta → New Haven" — font-style changed from `italic` to `normal`. Still Cormorant Garamond at weight 500.
- Subtitle "Your Out-Of-State College Move Planner" — bumped to **1.1×** original size (`clamp(1.05rem, 1.27vw, 1.15rem)`), `font-weight: 500` (Inter Medium), `line-height: 1.2`.

### Opening screen — vertical spacing
- Route `margin-top: calc(1.8rem - 1px)`.
- Subtitle `margin-top: calc(1rem + 11px)`.
- Start button moved out of the absolute-positioned `.opening__cta` and into the flex stack inside `.opening__center`, sitting `margin-top: 46px` below the subtitle. Button padding reduced from `1rem` to `0.7rem` for height.
- `transform: translateY(-3%)` removed from `.opening__center` — the title/route/subtitle/Start group is now perfectly centered both horizontally and vertically on the page (no offset).

### Opening screen — tint
A multi-step iteration:
1. Started checkpoint-04 with two layered gradients on `.opening__sky-veil` (radial vignette + linear top-to-bottom).
2. Tinted +15%, then +20%, then +5% more.
3. Tinted color shifted from `rgb(13, 20, 36)` (`--color-navy-deep`) to `rgb(30, 44, 60)` (`#1E2C3C`) per Tina's request — softer twilight blue.
4. Radial removed at her request → linear-only `linear-gradient(180deg, rgba(30,44,60,0.88), rgba(30,44,60,0.72), rgba(30,44,60,1))`.
5. Flattened entirely to a single uniform `rgba(30, 44, 60, 0.85)`, then bumped to `0.9`. **Final:** `background: rgba(30, 44, 60, 0.9)` — flat tint, no gradient.

### Opening screen — element opacities
- Bulldog opacity raised from `0.5` → `0.85` (was reading too faded vs. the asset Tina provided).
- Seal opacity raised from `0.97` → `1.0`.
- Reduced-motion override updated to match the new values.

### Tab bar
- `.tab--method.tab--active` and `.tab--storage.tab--active` removed.
- Replaced with single `.tab--active` rule using `clip-path: polygon(18px 0, calc(100% - 18px) 0, 100% 100%, 0 100%)`.
- Padding: `2.4rem` left/right on desktop, `1.8rem` on mobile (mobile clip uses `12px` insets).

### Packing list
- Replaced `display: grid; grid-template-columns: repeat(2, 1fr)` with `columns: 2; column-gap: 2.5rem`.
- `.plist__group` now has `margin-bottom: 1.75rem; break-inside: avoid` plus the vendor-prefixed equivalents.
- Mobile single-column collapses correctly with `columns: 1`.

---

## 3. Records of Resistance

**R1 — CSS columns over JavaScript masonry library.**
The grid-vs-columns issue is the kind of problem people commonly reach for a masonry library to solve (e.g., react-masonry-css, masonic). Rejected — the categories don't need to reflow on resize beyond what `columns: 2` → `columns: 1` already does, and the `break-inside: avoid` rule keeps each category intact. Adding a dependency for a 6-line CSS swap would have been the wrong shape of solution.

**R2 — Flat tint over the previous layered gradients.**
The opening screen had a sophisticated layered veil (radial vignette + linear darken). Looked nice on its own but added complexity Tina didn't want — she preferred a uniform feel. The flat `rgba(30, 44, 60, 0.9)` is simpler, more predictable, and reads as a deliberate atmospheric overlay rather than a photographer's filter. Worth noting that the radial gradient was *more sophisticated* but the flat version is *more honest* to what the screen needs to communicate.

**R3 — Did not invert the bulldog asset.**
The Yale bulldog asset (`bulldog.png`) is white/pale lines on transparent. On a dark background it reads as faint white linework — which is what we have. The Figma reference shows the bulldog with darker linework on a slightly lighter shield ground (visually opposite). I offered to apply a CSS `filter: invert(1) sepia(0.3)` to flip the colors, but Tina didn't ask for it. Held back. Bulldog opacity is now `0.85` so the white lines read clearly without being harsh.

**R4 — Did not change the quiz flow when Tina said "you forgot the quiz entirely."**
The quiz is implemented at `src/components/MoveMethodFinder/Wizard.jsx`. Tina was bypassing it because localStorage from earlier testing had cached `movebook:answers` and `movebook:tasks`, so the conditional `hasList = answers !== null && tasks.length > 0` was sending her straight to the list. The right resolution was a diagnosis ("clear localStorage" or "click Redo the Move Method Finder") rather than a code change. Did not rewrite the wizard or change the persistence model when none was needed.

---

## 4. Successes

**S1 — Folder-tab clip-path is a one-liner shared by both active tabs.**
Removing the per-tab `clip-path` overrides and replacing them with a single `.tab--active` rule reduced the CSS surface area while making the visual better. The `polygon(18px 0, calc(100% - 18px) 0, 100% 100%, 0 100%)` is intuitive enough that Tina could tweak the `18px` value herself if she wants a steeper or shallower flare.

**S2 — Columns layout fixes the long-standing row-height issue cheaply.**
The grid-with-uneven-content problem is annoying enough that many React apps reach for masonry libraries. CSS columns + `break-inside: avoid` is six lines of CSS and works in every browser that ships in 2026. Categories now pack tightly without forcing alignment.

**S3 — The opening screen now centers true.**
Removing the `transform: translateY(-3%)` brought the title/route/subtitle/Start stack to true viewport center. This was a piece of vestigial offset I'd added early on to match the Figma's apparent positioning. The cleaner answer is to let the flex centering do its job. If Tina wants the title higher later, it's one line to add back.

**S4 — Tint iteration was disciplined.**
The tint changed 8 times across this session (15%, 20%, 5%, color shift, radial → linear → flat, 0.85, 0.9). Each change touched only the `.opening__sky-veil` rule and rebuilt in under 400 ms. Vite HMR + the user driving direction kept the loop tight. Final tint is `rgba(30, 44, 60, 0.9)` — single line, no gradient, easy to reason about and tweak.
