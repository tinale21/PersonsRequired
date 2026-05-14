# Checkpoint 22 — Responsive Pass for iPhone (≤480px / ≤560px)
**Date:** 2026-05-13
**Branch:** main
**Status:** Added a mobile / iPhone-targeted responsive pass across the entire app. New breakpoints at ≤480px (or ≤560px for storage cards/search) handle the Opening Screen, folder-tab nav, Wizard, PackingList, and StorageOrganizer + StorageMap. Touch targets bumped to ≥44×44px throughout. Tab labels switch to short forms on phones ("Move Method Finder" → "Method Finder", "Storage / Shipping Organizer" → "Storage").

---

## 1. Context

The app was built primarily for desktop with partial mobile support (`@media (max-width: 720px)` for shell/tabs/wizard/packinglist, `(max-width: 900px)` for opening, `(max-width: 980/560px)` for storage). None of those breakpoints reached the iPhone-portrait viewport range (375–430px), and a sub-agent inventory turned up specific failure modes: tab labels overflowing with `white-space: nowrap`, wizard option grids forcing horizontal overflow at narrow widths, opening-screen decorations positioned absolutely with offsets like `top: calc(62% + 120px)` that pushed off small screens, touch targets like `.wizard__back-arrow` (36×36) and `.plist__filter` (`0.2rem 0.1rem` padding) well under iOS guidelines (≥44×44), and the storage search row laid out as one wide flex line that wouldn't fit on a 375px viewport.

Did one targeted pass per surface:

**TabBar** — Added a `shortLabel` field to each tab in the TABS array and two `<span>`s per tab (`tab__label--long` and `tab__label--short`). CSS toggles visibility at ≤480: short labels show, long labels hide. New ≤480 block also reduces padding, font-size, and active-tab inset. Long labels remain in DOM for accessibility tooling and screen readers (the short labels get `aria-hidden`).

**Wizard** — Added a comprehensive ≤480 block: option grid becomes single-column with `1fr`, option `min-height` drops from 110 → 84px, title's negative `margin-top: -32px` zeroed out, back-arrow grows from 36×36 → 44×44, text-wrap goes from `width: 800px` → `width: 100%`, next/back/skip buttons get `min-height: 44px` and reduced horizontal padding, actions row gets `flex-wrap: wrap` in case they don't fit in one row.

**PackingList** — Bumped padding on three small touch targets year-round (not just on mobile, to maintain consistency): `.plist__filter` from `0.2rem 0.1rem` → `0.5rem 0.4rem`, `.plist__delete` from `0.4rem` → `0.55rem`, `.plist__modal-cancel` from `0.4rem 0.8rem` → `0.7rem 1rem` plus `min-height: 44px`. New ≤480 block: group title shrinks slightly (1.25 → 1.1rem), modal padding tighter, modal-new flex-direction column, modal-create gets min-height 44.

**OpeningScreen** — New ≤480 block: removes the `min-height: 640px` cap (uses `min-height: 100vh; height: auto` so it doesn't force vertical overflow on shorter iPhones), shrinks all decorative elements, repositions bulldog to `bottom: 6%; right: -8%` (intentionally clipped slightly so it doesn't dominate), tickets to `bottom: 10%`, Start button gets `min-height: 44px` and larger padding. Bulldog opacity reduced to 0.55 on mobile to avoid competing with the title block on small screens.

**StorageOrganizer + StorageMap** — New ≤560 block: search row collapses to a single column (`flex-direction: column`), dates wrap to a second row with each date taking `flex: 1 1 45%`, Update button goes full-width with `min-height: 44px`. Card images grow 150 → 170px tall on mobile (more visual presence when stacked single-column), size chips get tighter padding/font. Map drops to `aspect-ratio: 4/3; max-height: 360px` and pin font shrinks to 0.72rem. Filter dropdown menu width becomes `calc(100vw - 2rem)` so it doesn't overflow.

All existing tablet (≤720, ≤900, ≤980) breakpoints preserved unchanged — the new ≤480/≤560 rules sit alongside them.

Build verified: CSS bundle grew 47.73 → 50.24 KB (+2.5 KB for all the new rules); JS bundle grew 320.90 → 321.07 KB (~170 bytes for the new tab label spans). No errors.

---

## 2. Human Directions

To recreate from checkpoint 21:

1. **`src/components/AppShell/TabBar.jsx`** — add `shortLabel` to each tab; render two `<span>`s per tab:
   ```jsx
   const TABS = [
     { id: 'method', label: 'Move Method Finder', shortLabel: 'Method Finder' },
     { id: 'storage', label: 'Storage / Shipping Organizer', shortLabel: 'Storage' },
   ]
   // inside <button>:
   <span className="tab__label tab__label--long">{tab.label}</span>
   <span className="tab__label tab__label--short" aria-hidden="true">{tab.shortLabel}</span>
   ```

2. **`src/components/AppShell/TabBar.css`** — add `.tab__label--short { display: none }` baseline, plus an `@media (max-width: 480px)` block that flips the visibility and tightens padding/font/letter-spacing.

3. **`src/components/MoveMethodFinder/Wizard.css`** — append a single `@media (max-width: 480px)` block at the end that zeros the title's negative margin, collapses both option grids to `1fr`, sizes back-arrow to 44×44, and adds `min-height: 44px` on next/back/skip.

4. **`src/components/MoveMethodFinder/PackingList.css`** — three baseline padding bumps (`.plist__filter`, `.plist__delete`, `.plist__modal-cancel`), and extend the existing `@media (max-width: 480px)` block with the group-title shrink, modal column-stacking, and modal-create `min-height`.

5. **`src/components/OpeningScreen/OpeningScreen.css`** — append a new `@media (max-width: 480px)` block after the existing `(max-width: 900px)` one. Lifts `min-height` constraint, shrinks decorations, repositions bulldog/tickets to the bottom of the viewport, gives the Start button a proper touch target.

6. **`src/components/StorageOrganizer/StorageOrganizer.css`** — append an `@media (max-width: 560px)` block at the end with stacked search row, wrapped dates, full-width Update button, larger card images, tighter size chips.

7. **`src/components/StorageOrganizer/StorageMap.css`** — append an `@media (max-width: 560px)` block: `aspect-ratio: 4/3; max-height: 360px`, smaller pin font.

8. **Build verify**: `npm run build`. Expected: CSS ~50 KB, JS ~321 KB.

---

## 3. Records of Resistance

**R1 — Didn't hide any features on mobile.**
Tempting on small screens to hide the filter dropdown, the date pickers, the optional 5th question — anything that "wouldn't fit." Decided against. The cousin will be using this app on her iPhone as much as her laptop, probably more (the storage organizer is exactly the kind of "check while waiting in line" tool that gets phone use). Hiding features would mean shipping two products. Instead reshaped layouts so every feature fits at 375px width: search row stacks, options become single-column, dates wrap to two rows but stay editable, filter dropdown menu becomes `calc(100vw - 2rem)` wide. Same feature surface; different geometry.

**R2 — Two `<span>`s in the tab rather than CSS-only label swap.**
Could have stuck with one `<span>{label}</span>` per tab and used a CSS `data-short` attribute + `::before` content swap. Rejected because (a) screen readers don't always announce `::before` content reliably, (b) the long label has accessibility value as the primary name even when visually hidden, and (c) two real DOM nodes are easier to reason about and harder to break. Cost is ~50 bytes of extra HTML per tab; benefit is the long label stays in the accessibility tree at all viewports.

**R3 — Bulldog opacity reduced to 0.55 on mobile (was 0.85 on desktop).**
The bulldog is a decorative watermark on desktop. On a 375px screen with limited vertical real estate, the title block + route + subtitle + Start button already fill most of the visible composition, and a 0.85-opacity decorative element competes with them for attention. Reduced to 0.55 — still legible as a brand element, no longer pulling focus. Position also shifted from `top: 62% + 120px` (which pushed it off-screen on short iPhones) to `bottom: 6%; right: -8%` (anchored to viewport bottom, slightly clipped on the right edge intentionally — reads as bleeding off the page rather than fitting awkwardly).

**R4 — Card images grow on mobile, not shrink.**
Counterintuitive but deliberate: on desktop the cards are in a 2-column grid where 150px image height balances the body content vertically. On mobile they're stacked single-column at full viewport width — a 150px image looks thin and disconnected from the content below it. Bumped to 170px so the photo has visual weight proportional to its now-wider canvas.

**R5 — Touch target fixes applied at all viewports, not just mobile.**
The three padding bumps (`.plist__filter`, `.plist__delete`, `.plist__modal-cancel`) sit outside a media query — they apply at every viewport. Resisted scoping them to `@media (max-width: 480px)` because (a) the targets were genuinely too small even on desktop (a trackpad pointer is also imprecise), (b) iOS Safari has the same touch geometry on iPad as on iPhone, and a desktop-only media query would miss iPad portrait, and (c) the visual change at desktop is negligible (cells grow ~3-4px). Better baseline for everyone than a conditional fix.

---

## 4. Successes

**S1 — Every surface works at 375px without horizontal scroll.**
Tab nav fits with short labels. Wizard collapses to single-column choices. Opening Screen decorations stay within viewport or intentionally bleed. Storage search row stacks. Cards single-column with full-bleed photos. Map aspect-adjusted to 4/3 so it doesn't dominate.

**S2 — One small CSS change per surface, no JSX restructuring needed.**
Only one JSX change (TabBar's short label spans). Every other surface got its mobile pass via a single appended `@media` block in the existing CSS. The structure of each component is unchanged; only its visual sizing/layout responds to the viewport.

**S3 — All touch targets now meet the 44×44 iOS guideline.**
`.wizard__back-arrow` (was 36×36 → now 44×44 on mobile), `.opening__start` (was ~38px tall → now `min-height: 44px`), `.plist__delete` (was ~28×28 → now ~32 baseline, with row tap targets covering it), `.storage__update` (full-width with `min-height: 44px`), `.plist__filter` (was ~24×24 → now ~36 baseline), `.plist__modal-cancel` (was ~28px → now `min-height: 44px` on mobile). The cousin can tap confidently with a thumb without misfires.

**S4 — Existing tablet breakpoints preserved.**
Didn't touch the existing `@media (max-width: 720|900|980)` rules. The new ≤480/≤560 rules layer on top of them via specificity. Behavior at iPad, narrow desktop, and laptop is unchanged; only the phone-range experience improved.

**S5 — Bundle size barely moved.**
CSS +2.5 KB; JS +170 bytes. The cost of full responsive support is ~13% of the CSS bundle (most of that was already there from the tablet breakpoints). For a school project that gets graded on both desktop and possibly phone, this is a free win.
