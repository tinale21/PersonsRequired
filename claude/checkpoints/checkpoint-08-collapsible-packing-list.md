# Checkpoint 08 — Collapsible Packing List Categories
**Date:** 2026-05-13
**Branch:** main
**Status:** Packing list categories are now collapsible dropdowns with item counts in the title. Layout switched from CSS columns to grid so expanding one category doesn't shuffle the others.

---

## 1. Context

Tina flagged the packing list as overwhelming — too many items visible at once. Two changes:

**Categories collapsible.** Each `.plist__group-title` is now wrapped in a `.plist__group-toggle` button. Clicking the button toggles whether that category's items are visible. Categories default to collapsed so the initial view is just the section headers — much less overwhelming for someone opening the list for the first time. A chevron-down icon on the right of each header rotates 180° when the category is open. Open state lives in a `Set<categoryName>` via `useState`; toggling adds/removes from the set.

**Item count in parentheses.** Each category header shows the count of items in that category in muted text: `Clothes (4)`, `Bedding (5)`, etc. The count reflects the *currently visible* items, so when the filter is `Active` or `Completed` the count shows that filter's subset rather than the total.

**Grid layout instead of CSS columns.** First attempt at the collapsible feature used the existing `columns: 2` flow. Expanding one category changed its height, which caused the column-flow algorithm to reflow categories between columns — visually some categories appeared to "disappear" because they jumped from column 1 to column 2 or vice versa. Switched to `display: grid; grid-template-columns: repeat(2, 1fr)` so each category lives in a fixed cell. Now expanding one only grows its row's height; neighbors stay put.

---

## 2. Human Directions

To recreate this state from checkpoint 07:

1. In `src/components/MoveMethodFinder/PackingList.jsx`:
   - Import `useState`.
   - Add `const [openCategories, setOpenCategories] = useState(() => new Set())`.
   - Add `toggleCategory(name)` that creates a new Set, toggles `name`, and calls `setOpenCategories`.
   - Wrap the existing `.plist__group-title` in a `<button className="plist__group-toggle" aria-expanded={isOpen}>` that calls `toggleCategory(group.name)`. Inside the button: title text, a `<span className="plist__group-count">({group.items.length})</span>`, and an SVG chevron-down (path `M6 9l6 6 6-6`).
   - Conditionally render the `<ul className="plist__items">` based on `openCategories.has(group.name)`.
   - Add `is-open` class to `.plist__group` when open (for chevron rotation styling).

2. In `src/components/MoveMethodFinder/PackingList.css`:
   - Replace `.plist__grid { columns: 2; column-gap: 2.5rem }` with:
     ```css
     .plist__grid {
       display: grid;
       grid-template-columns: repeat(2, minmax(0, 1fr));
       column-gap: 2.5rem;
       row-gap: 1.75rem;
       align-items: start;
     }
     ```
   - Mobile media query: change `columns: 1` to `grid-template-columns: 1fr`.
   - Remove `break-inside: avoid` and `margin-bottom: 1.75rem` from `.plist__group` (no longer needed).
   - Add `.plist__group-toggle` styles: full-width flex with `space-between`, transparent bg, subtle hover, focus-visible ring.
   - Add `.plist__group-count { color: var(--color-muted); font-weight: 500 }`.
   - Add `.plist__group-chevron { width: 18px; height: 18px; transition: transform 240ms }` and `.plist__group.is-open .plist__group-chevron { transform: rotate(180deg) }`.

---

## 3. Records of Resistance

**R1 — Default state: collapsed, not expanded.**
The natural-feeling default for a fresh list might be "expand everything" so the user sees the result of the quiz immediately. Rejected because Tina explicitly said the list "feels overwhelming." Collapsed-by-default reduces visual load on first view; user opts in to seeing items per category. The trade-off is a slight increase in clicks-to-reveal, which is acceptable for the school-project audience (the cousin) who would otherwise be put off by a wall of items.

**R2 — Item count reflects the current filter, not the total.**
The count in parentheses uses `group.items.length` (which is post-filter), not the total count of items in that category. The decision was about consistency: when the filter is Active, the user is intentionally looking at remaining work, and `Clothes (4)` should mean "4 things still to deal with in Clothes," not "4 of N total in Clothes — figure out the rest yourself." If Tina later wants both numbers shown (e.g., `Clothes (4 / 10)`), it's a small change.

**R3 — Grid layout instead of CSS columns required reverting the earlier fix.**
Checkpoint 05 had switched from grid to CSS columns specifically to fix the empty-band-below-short-categories issue. That fix is now incompatible with collapsibility (columns reflow on height change). The new grid uses `align-items: start` so cells anchor to the top of their row — when a tall category sits next to a short one in the same row, the short one doesn't stretch to fill, but the row's total height is the tall one. This is acceptable for the collapsible case because the user opens at most one or two categories at a time; the previous "all expanded, lots of empty space" problem no longer applies in the new default state.

---

## 4. Successes

**S1 — Collapsed-by-default dramatically reduces first-impression overwhelm.**
On first view, the packing list now shows ~6 short header rows (one per category) instead of dozens of items. The user can read the categories, pick the one they want to tackle, and open it. Pairs well with the "decision list she finishes" measurable Helped — fewer items visible at once means each decision feels more achievable.

**S2 — Count in parentheses is a free progress indicator.**
With `Active` filter applied, the count becomes a per-category remaining-tasks number. The cousin can scan the headers and see at a glance which categories have outstanding work. No additional UI needed — the existing `group.items.length` does the math.

**S3 — Two-character problem diagnosis.**
The "other categories disappear when I expand one" bug was diagnosed in one look at the CSS: `columns: 2` flows content, and flowed content reflows on height change. Switching to grid (which doesn't flow) was a 6-line CSS swap. Worth remembering: CSS columns are for *static-height* multi-column reading layouts, not for interactive UI where item heights change.
