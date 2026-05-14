# Checkpoint 09 — Category Picker Modal, Two-Column Stacks
**Date:** 2026-05-13
**Branch:** main
**Status:** Adding a custom item now opens a category picker modal. Packing list switched from CSS grid to two independent flex columns so an expanding category in one column doesn't shift the other.

---

## 1. Context

Two threads on the Move Method Finder packing list:

**Category picker modal on item add.** Previously, typing an item and hitting Add dropped it directly into an "Other" category. New behavior: clicking Add opens a modal showing all existing categories as buttons, plus an "or create new" input. The user picks an existing category or types a new category name. The item is then created with the chosen category, and that category auto-opens so the new item is immediately visible. Cancel button + backdrop click dismiss the modal.

The modal is rendered via `createPortal(..., document.body)` to escape the `shell__panel`'s `transform` (which had turned `position: fixed` into "fixed relative to the panel" and prevented the backdrop from covering the dark header). Backdrop tint strengthened to `rgba(13, 20, 36, 0.6)` with `backdrop-filter: blur(4px)` so the page behind reads as clearly dimmed.

**Layout shift on expand fixed.** Earlier checkpoint switched to CSS Grid (2-column) so collapsible categories didn't reflow between columns. But CSS Grid still synchronizes row heights — expanding a category in column 1 grew the entire row's height, which pushed everything in column 2 down. Switched to two independent flex column stacks (`<div className="plist__col">` each `display: flex; flex-direction: column`). The 2-column grid layout still positions the stacks side-by-side, but each stack is independent. Expanding a category in one column only affects the categories below it in that same column.

**Categories distributed even/odd by index.** `grouped.filter((_, i) => i % 2 === 0)` for left, odd for right. So Clothes → left, Bedding → right, Dorm → left, etc. Reading order is "down then over" rather than "across then down." On mobile (single column), all categories show in original order via the parent grid collapsing to 1fr.

**`makeCustomTask` extended.** Now takes optional `categoryName` and `categoryId` parameters. Default still 'Other' / 'custom' for backwards compatibility, but the new picker passes the user's selection.

---

## 2. Human Directions

To recreate from checkpoint 08:

1. **`src/data/listGenerator.js`** — change `makeCustomTask(label)` to `makeCustomTask(label, categoryName = 'Other', categoryId = 'custom')` and pass those through to the returned task object.

2. **`src/components/MoveMethodFinder/PackingList.jsx`** — major changes:
   - Import `createPortal` from `react-dom`, and `useEffect` from React.
   - Add state: `pendingItem`, `newCategoryName`.
   - Derive `categoryOptions` via `useMemo`: distinct `{ name, id }` pairs from `tasks` (preserves order).
   - Add `commitItem(name, id)`: calls `onChange([...tasks, makeCustomTask(pendingItem, name, id)])`, auto-opens the category, clears `pendingItem`, `draft`, `newCategoryName`.
   - Add `handleCreateCategory`: trims `newCategoryName`, generates a slug-style id (`custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`), calls `commitItem`.
   - Add `cancelAdd`: resets `pendingItem` and `newCategoryName`.
   - Update `handleAdd` to call `setPendingItem(label)` instead of adding directly.
   - Refactor the `grouped.map` block to extract `renderGroup` and render two columns: `grouped.filter((_, i) => i % 2 === 0)` and `i % 2 === 1`, each in its own `<div className="plist__col">`.
   - Render the modal via `createPortal(<div className="plist__modal-backdrop">...</div>, document.body)` at the end of the component.

3. **`src/components/MoveMethodFinder/PackingList.css`** — major changes:
   - Replace the `.plist__grid` rule:
     ```css
     .plist__grid {
       display: grid;
       grid-template-columns: 1fr 1fr;
       column-gap: 2.5rem;
     }
     .plist__col {
       display: flex;
       flex-direction: column;
       gap: 1.75rem;
       min-width: 0;
     }
     ```
   - Mobile: `.plist__grid { grid-template-columns: 1fr; row-gap: 1.75rem }`.
   - Add modal styles: backdrop with `position: fixed; inset: 0; background: rgba(13, 20, 36, 0.6); backdrop-filter: blur(4px); z-index: 9999`. Modal card with `background: #f9f8f8; border: 1px solid #e0e0e0; border-radius: 16px; max-width: 440px; padding: 1.5rem`. Modal-options as a 2-col grid. Modal-divider as a horizontal rule with "or" label. Modal-new as input + Create button (input themed #fff bg, Create button as #000). Modal-cancel as a centered text button.

---

## 3. Records of Resistance

**R1 — Portal was non-obvious but mandatory.**
First attempt at the modal used `position: fixed; z-index: 100` directly inside the PackingList component. The backdrop appeared to "float" over the packing list but did NOT cover the dark header or the top of the page. Diagnosis: `shell__panel` has `transform: translateX(-100%)` (slide animation), and a `transform` on an ancestor turns `position: fixed` into "fixed relative to the transformed ancestor" (CSS containing block rules). Fix: portal the modal to `document.body` so no ancestor has a transform. Lesson noted — any time `position: fixed` doesn't reach the viewport, the cause is almost always an ancestor with `transform`, `filter`, `perspective`, or `will-change: transform`.

**R2 — Two-flex-columns over grid for "expansion doesn't shift neighbors."**
The grid layout with `repeat(2, 1fr)` and `align-items: start` STILL synced row heights — `align-items` controls how cells align within their row, but the row height is still the max of cells in it. To truly decouple columns, each column needs to be its own independent flex container, with the grid only laying out the two columns side-by-side. The new structure (`.plist__grid` > two `.plist__col` > `.plist__group`*) achieves this. Trade-off: lost the even row-by-row reading order — categories now alternate left/down then right/down. Acceptable for a 4-6 category list; might want to revisit if the count grows.

**R3 — Item is created in modal, not pre-filled.**
The modal shows the typed item (`"Tea kettle"` in quotes) but the actual creation only happens when the user picks a category. If they cancel, the input retains its value so they can edit and try again. The decision: pre-creating the item with "Other" category and letting the user re-categorize later would be one fewer click for the common case, but it would also clutter "Other" with mis-categorized items if the user forgets to fix them. The picker forces the categorization decision up front, which matches the design goal of "the list feels organized."

**R4 — Tint strengthened deliberately past my initial taste.**
Started the backdrop at `rgba(13, 20, 36, 0.45)` (a soft dim that feels modern). Tina asked for "just the popup, background tinted" — meaning unambiguous focus on the modal. Bumped to `0.6` + `blur(4px)`. The result is closer to a system-dialog feel than a subtle overlay, but matches the "modal as a focused decision moment" the user wanted.

---

## 4. Successes

**S1 — Category picker auto-opens the chosen category.**
After picking (or creating) a category, `commitItem` does `setOpenCategories(prev => new Set(prev).add(categoryName))`. The category expands automatically, so the user sees their new item immediately rather than having to find and click the category header. Small but high-leverage UX detail — no extra step between "I added this" and "I can see it."

**S2 — Independent flex columns is a clean abstraction.**
Replacing the single grid with two flex columns is structurally simple and visually correct: each column is its own world. No `align-items: start` tricks, no `grid-auto-flow: dense`, no manual row sizing. The two columns get laid out side-by-side via the outer grid (which itself doesn't need row management because each child column manages its own).

**S3 — Portal pattern is the right escape hatch for modal-in-transformed-ancestor.**
The portal is a one-import, one-`createPortal()` call change. The component still "owns" the modal's state and handlers; it's just rendered elsewhere in the DOM. This pattern generalizes — any future overlays (confirms, tooltips, popovers) that need to escape stacking context can use the same approach.

**S4 — Even/odd split is deterministic across renders.**
Using `i % 2` based on the grouped array's index means categories always land in the same column on every render (as long as the input order is stable). No animation glitches from categories jumping columns. Stability matters here because the user has a mental model of "Clothes is on the left" and we don't want to violate it.
