# Checkpoint 15 — Scroll Frame Top Clipping Fix
**Date:** 2026-05-13
**Branch:** main
**Status:** Cards on the first row of the scrollable results frame no longer get clipped at the top when hovered/focused. The frame now has 8px of internal vertical padding so the cards' lift-on-hover (`translateY(-2px)` + drop shadow) has room to render without colliding with the frame's `overflow-y: auto` clipping edge.

---

## 1. Context

Tina noticed that the top-row cards in the left scrollable frame appeared to "cut off a bit on the top" when selected/hovered. Diagnosis: `.storage__cards-frame` uses `overflow-y: auto` to enable scrolling, which inherently clips anything that exceeds its content box. Cards have a hover/focus rule (`transform: translateY(-2px); box-shadow: 0 6px 18px -8px ...`) that lifts them 2px upward. For top-row cards, that 2px of lift sat *above* the frame's visible area — the top sliver of the card and most of the drop shadow's upward extent got clipped by the scroll viewport's top edge.

Fix: add `padding: 8px 0.75rem 8px 0` to the frame (was `padding-right: 0.75rem` only). The 8px top inset gives the lifted card and its shadow room to render within the visible viewport. 8px also covers the bottom edge for the same reason (last-row cards have a shadow that extends down — though clipping there is less obvious because the viewport's bottom is below normal eye line).

To keep the visual spacing between the "Showing 1 – 6 of 80 movers" count line and the first card row unchanged, the count's `margin-bottom` was reduced by the same 8px: `1.25rem` → `calc(1.25rem - 8px)`. Net effect on layout: zero shift; only the scroll viewport's clipping boundary moved.

Mobile fallback (≤980px) gets `padding: 0` — the frame isn't a scroll viewport there, so clipping doesn't apply and the natural margin already provides spacing.

---

## 2. Human Directions

Starting from checkpoint 14:

1. **`src/components/StorageOrganizer/StorageOrganizer.css`** — replace the frame padding rule:
   ```css
   .storage__cards-frame {
     /* ... */
     padding: 8px 0.75rem 8px 0;
   }

   @media (max-width: 980px) {
     .storage__cards-frame {
       overflow: visible;
       padding: 0;
     }
   }
   ```

2. **`StorageOrganizer.css`** — compensate the count's margin:
   ```css
   .storage__results-count {
     margin-bottom: calc(1.25rem - 8px);
   }
   ```

3. **Verify** by hovering a top-row card in dev — no top clipping. No change to bundle size of consequence.

---

## 3. Records of Resistance

**R1 — Used `padding`, not `overflow: visible` or removing the hover transform.**
Two other approaches considered: (a) make the frame `overflow: visible` so nothing is clipped, but that defeats the entire point of the scrollable frame (cards below the fold would render outside the column too); (b) remove the hover `transform: translateY(-2px)`, but that breaks visual consistency with the cards elsewhere in the app and dampens affordance. Padding is the smallest correct change: keeps scrolling, keeps the lift, just gives it room.

**R2 — Compensated for the padding instead of leaving the shift.**
The 8px top inset would have pushed the first card row 8px lower than it sat before, which would have looked noticeably different. Subtracting 8px from the count line's `margin-bottom` cancels the shift exactly, so nothing visually moves except the clipping boundary. Used `calc(1.25rem - 8px)` to keep the original `1.25rem` value readable in the source — telegraphs the offset rather than hiding it as a raw `12px`.

---

## 4. Successes

**S1 — Three lines of CSS, zero JS, zero layout reflow.**
The fix is two edits in one CSS file. No component change, no new state, no animation tweak. The card lift and shadow now render correctly within the scroll frame on hover/focus, and the page looks identical to before at rest.

**S2 — Same fix protects the bottom edge too.**
By using vertical-symmetric padding (`8px` top *and* bottom), last-row cards' downward shadow gets the same protection from the bottom scroll edge — a smaller visual issue, but the same root cause, fixed for free.
