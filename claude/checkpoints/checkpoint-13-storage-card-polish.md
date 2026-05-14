# Checkpoint 13 — Storage Card Spacing, Bullet Separator, Scrollable Results Frame
**Date:** 2026-05-13
**Branch:** main
**Status:** Pixel-polish pass on the Storage / Shipping Organizer. Card photo area grew, the rating/distance line got a real separator and tighter spacing, and the left column became a fixed-height scrollable frame that shares the row height with the map column instead of pushing the page taller.

---

## 1. Context

After checkpoint 12 wired up the real facility photos, the cards felt off in three small ways:

1. **The image area was too short** for the new photos — the 130px window cropped them aggressively. Tina bumped it twice: +12px and then +8px → final `height: 150px`.
2. **The "$★ 4.5  4.2 mi from dorm" line read as one blob.** No visual separator between the rating and the distance. Added a `•` between them, then tightened the surrounding gap (`0.85rem` → `0.4rem`) and re-colored the bullet through three rounds: `--color-ink-soft` (too dark, matched address) → `#9a9a9a` (close but Tina wanted to use a token, not a one-off hex) → `--color-muted` (`#94a0b3`, lighter than the address line, intentional secondary).
3. **The size-chip row sat too close to the rating line.** Tina nudged `.storage-card__sizes` `margin-top` up by 18px, then trimmed by 8px → net `calc(0.35rem + 10px)`.

Then the bigger ask: **frame the left column so it matches the map's height and the cards scroll inside it**, rather than the cards column being unbounded and pushing the whole page taller than the map.

First attempt confined the cards inside a sticky `.storage__results` with `max-height: calc(100vh - 6rem)`. Tina rejected it — *"Everything is now just squished not in a scrollable frame"*. The diagnosis: the heading + count above the cards ate too much of the capped height, leaving the cards crammed into a small box. Also, the heights didn't actually match — sticky-with-max-height capped both columns at the same upper bound but neither was forced to equal the other.

Second attempt (kept): move the height constraint up to `.storage__layout` itself — `height: calc(100vh - 6rem)` with `align-items: stretch`. Now the grid row has a fixed height and both columns fill it exactly. The map's `aspect-ratio: 4/5` no longer drives layout (stretch overrides it on the cross axis), but its `max-height` cap matches the new row height so it visually stays the same. The cards live in a new `.storage__cards-frame` div that wraps the `<ul>` with `flex: 1 1 auto; min-height: 0; overflow-y: auto` so it absorbs whatever height is left under the heading and scrolls internally.

Initially the frame had a visible border + cream-panel background + padding — meant to read as a "framed" container. Tina wanted no outline: cards just fill the frame space directly. Stripped the border/bg/padding, but kept a `padding-right: 0.75rem` so the right-column cards don't sit flush against the custom scrollbar.

Mobile fallback (≤980px): layout reverts to `height: auto`, `align-items: start`, and the frame stops being scrollable (`overflow: visible`). The whole list flows naturally as one tall column on narrow viewports.

---

## 2. Human Directions

Starting from checkpoint 12:

1. **`src/components/StorageOrganizer/StorageOrganizer.css`** — incremental polish on cards:
   - `.storage-card__image` `height` from `130px` → `150px`.
   - `.storage-card__sizes` `margin-top` from `0.35rem` → `calc(0.35rem + 10px)`.
   - `.storage-card__meta` `gap` from `0.85rem` → `0.4rem`.
   - Add `.storage-card__meta-sep { color: var(--color-muted); font-size: 0.85rem; line-height: 1 }`.

2. **`src/components/StorageOrganizer/StorageOrganizer.jsx`** — add bullet between rating and distance. Inside the `.storage-card__meta` div, wrap the existing distance block in a fragment with a preceding `<span className="storage-card__meta-sep" aria-hidden="true">•</span>` (so the bullet only renders when distance does):
   ```jsx
   {Number.isFinite(unit._distance) && (
     <>
       <span className="storage-card__meta-sep" aria-hidden="true">•</span>
       <div className="storage-card__distance">
         {unit._distance.toFixed(1)} mi from dorm
       </div>
     </>
   )}
   ```

3. **`StorageOrganizer.jsx`** — wrap the `<ul className="storage__cards">` with `<div className="storage__cards-frame">…</div>`.

4. **`StorageOrganizer.css`** — drive the scrollable frame:
   ```css
   .storage__layout {
     height: calc(100vh - 6rem);
     align-items: stretch;
   }
   .storage__results {
     display: flex;
     flex-direction: column;
     min-height: 0;
     height: 100%;
   }
   .storage__cards-frame {
     flex: 1 1 auto;
     min-height: 0;
     overflow-y: auto;
     padding-right: 0.75rem;
   }
   @media (max-width: 980px) {
     .storage__layout { align-items: start; height: auto; }
     .storage__results { height: auto; }
     .storage__cards-frame { overflow: visible; padding-right: 0; }
   }
   ```
   Plus a small custom scrollbar via `::-webkit-scrollbar` / `-thumb` rules on `.storage__cards-frame` (8px wide, `rgba(26,36,56,0.18)` thumb darkening to `0.32` on hover).

5. **Build verify** with `npm run build` — bundle stays ~320 KB JS / ~46.85 KB CSS; only the CSS file size changed.

---

## 3. Records of Resistance

**R1 — First frame attempt was rejected for being "squished".**
Initial approach: make `.storage__results` itself sticky with `max-height: calc(100vh - 6rem)` and `display: flex; flex-direction: column`, with `.storage__cards` getting `flex: 1; overflow-y: auto`. Reverted at Tina's request. The problem was twofold: (a) the heading + count above the cards stole significant vertical space, leaving very little room for the cards list — they came out cramped, not framed; (b) "matching the map height" wasn't actually enforced — both columns were independently capped at the same maximum, but the map could be shorter (via its `aspect-ratio: 4/5`) while the results filled the cap. So they didn't visually line up.

The kept approach moves the height constraint up to the grid container itself: `.storage__layout { height: calc(100vh - 6rem) }` plus `align-items: stretch`. Now both columns are *forced* to the exact same height because they share a grid row whose height is dictated by the layout, not by either child. The map's `aspect-ratio` becomes advisory — stretch overrides it — but the visual result is fine since the row height already matches what the aspect-ratio would have produced on most desktop viewports.

**R2 — Removed the framed look entirely.**
The bordered cream-panel frame (border + bg + padding) was added on the assumption that "scrollable frame" meant a visually distinct container. Tina wanted just the scroll behavior, not the chrome — cards take up the frame space directly. Stripped border, background, padding to zero, but kept `padding-right: 0.75rem` so the rightmost card has a 12px gap from the custom scrollbar. The frame is now invisible; only its function (constrain + scroll) remains.

**R3 — Used `var(--color-muted)` for the bullet, not a one-off hex.**
Cycled through three colors for the `•` separator: `--color-ink-soft` (`#4a5468`, same as the address — too prominent), then `#9a9a9a` (a tweaked grey), then `--color-muted` (`#94a0b3`). The final choice uses an existing design token rather than a hand-picked hex — keeps the palette consistent and ensures the bullet stays in sync if the token ever shifts.

**R4 — Map kept its `aspect-ratio: 4/5` even though it's now overridden by stretch on desktop.**
Didn't remove the map's `aspect-ratio: 4/5` because it's still load-bearing on mobile, where the layout collapses to a single column and the map needs an intrinsic shape. On desktop it's silently overridden by grid stretch + layout height; on mobile it kicks in normally. Two lines of CSS that both make sense in their respective contexts — cleaner than a media-query branch.

---

## 4. Successes

**S1 — Map and results column are now exactly the same height.**
Driving the grid row to `calc(100vh - 6rem)` with `align-items: stretch` makes both children share the exact same row height. No JS, no measurement, no ResizeObserver — pure CSS. The two columns sit side by side as a single visually balanced block.

**S2 — Scrollable list, fixed-position heading.**
Heading ("Storage Units in New Haven, CT" + filter button) and the results count stay pinned at the top of the column. Only the cards list scrolls. The user knows where they are in the page even after scrolling several cards down — much better than a full-page scroll where context disappears.

**S3 — Custom scrollbar that doesn't look like a default Chrome scrollbar.**
8px wide, ink-tinted thumb at 18% opacity that darkens to 32% on hover. Matches the navy ink palette and fades into the background when not actively used. WebKit only, but every browser Tina cares about (Chrome, Safari on her Mac, Safari on her cousin's iPhone) supports it.

**S4 — Mobile fallback is one media-query block, not a separate code path.**
Single `@media (max-width: 980px)` override resets `height: auto`, `align-items: start`, and `overflow: visible` — restoring natural single-column flow without rebuilding the layout. The same component renders both behaviors with no JS conditional.

**S5 — Bullet separator made the meta line legible.**
"★ 4.5  4.2 mi from dorm" used to read as one ambiguous string. With `★ 4.5 • 4.2 mi from dorm` and a tighter gap, the eye parses it instantly as two facts. `aria-hidden="true"` keeps screen readers from announcing "bullet" between values — they still get a natural pause from the surrounding spans.
