# Checkpoint 14 — Date-Driven Availability Shuffle
**Date:** 2026-05-13
**Branch:** main
**Status:** The Storage / Shipping Organizer's date pickers + Update button now do something visible. Picking a From and To date and clicking Update marks ~2 of 6 units as "Not available" for that range, pushes them to the bottom of the list, fades them and their map pins, and plays a soft re-shuffle animation on the cards grid. Same dates always produce the same result (deterministic).

---

## 1. Context

The Update button was previously a no-op — Tina noted that picking dates and clicking it produced no visible change, which made the date pickers feel decorative. She wanted: *"when they click update, it shuffles the availability of storage units."*

Implemented as a fully client-side, demo-only availability check:

1. **A new `appliedDates` state** captures the dates that were *submitted* (separate from `fromDate` / `toDate`, which are the live input values). It's null until the user clicks Update with both dates filled in.
2. **A tiny string hash** (`hashCode`, ~5 lines) seeds a deterministic ranking of unit IDs based on the date pair. The two lowest-hashed unit IDs for that seed get marked `_unavailable`. Same dates → same hash → same two units always. Different dates → different two units. Not random; reproducible.
3. **The existing `sortedUnits` memo** got a new annotation step (each unit gets a `_unavailable` boolean) and a final stable-sort pass that pushes unavailable units to the bottom *regardless* of the active sort order. So price-asc still works for the available units; the unavailable ones just slot below them.
4. **Cards** get an `is-unavailable` class when `_unavailable` is true. CSS grayscales the photo, fades the body to 55%, suppresses hover/focus transforms, sets `tabIndex={-1}` and `aria-disabled` so they're skipped by keyboard nav and announced as disabled to screen readers. A dark navy pill in the top-left corner of the photo reads "Not available."
5. **The `<ul>` gets a `key`** of `${from}-${to}` (or `'all'`), which makes React fully remount the list when the applied dates change. That remount triggers a 380ms `cardsShuffle` fade-up keyframe animation on `.storage__cards`, so the user *sees* the change rather than the cards silently rearranging.
6. **Map pins for unavailable units** get an `is-unavailable` class too — rendered grey at 60% opacity, with hover/focus de-emphasized. The map stays in sync with the list.
7. **Tina specifically requested no "X available for [dates]" text** in the count line — kept the original "Showing 1 – 6 of 80 movers · Sorted by …" copy. The shuffle + badges already make the change obvious; an extra text line would add noise.

Clearing either date and clicking Update again resets `appliedDates` to `null`, the `_unavailable` set is empty, the badges and grayscale go away, and the list re-shuffles back to all-available order.

---

## 2. Human Directions

Starting from checkpoint 13:

1. **`src/components/StorageOrganizer/StorageOrganizer.jsx`** — add the hash and new state:
   ```js
   function hashCode(str) {
     let h = 0
     for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
     return h >>> 0
   }

   const [appliedDates, setAppliedDates] = useState(null)
   ```

2. **Add an `unavailableIds` memo** that derives the unavailable set from `appliedDates`:
   ```js
   const unavailableIds = useMemo(() => {
     if (!appliedDates) return new Set()
     const seed = hashCode(`${appliedDates.from}|${appliedDates.to}`)
     const ranked = storageUnits
       .map((u) => ({ id: u.id, k: hashCode(`${u.id}|${seed}`) }))
       .sort((a, b) => a.k - b.k)
     return new Set(ranked.slice(0, 2).map((o) => o.id))
   }, [appliedDates])
   ```

3. **Extend `sortedUnits`** to set `_unavailable` per unit and push unavailable to the bottom:
   ```js
   const withDist = storageUnits.map((u) => ({
     ...u,
     _minPrice: minPrice(u),
     _distance: u.coords ? distanceMi(DORM_COORDS, u.coords) : Infinity,
     _unavailable: unavailableIds.has(u.id),
   }))
   // ... existing sort logic ...
   sorted.sort((a, b) => Number(a._unavailable) - Number(b._unavailable))
   ```
   Add `unavailableIds` to the deps array.

4. **Replace `handleSubmit`'s no-op body** with:
   ```js
   if (fromDate && toDate) setAppliedDates({ from: fromDate, to: toDate })
   else setAppliedDates(null)
   ```

5. **Wrap the `<ul>` with a `key`** for re-mount animation:
   ```jsx
   <ul
     className="storage__cards"
     key={appliedDates ? `${appliedDates.from}-${appliedDates.to}` : 'all'}
   >
   ```

6. **In each `<li>`** add `is-unavailable` to the className, gate hover/focus handlers on `!unit._unavailable`, set `tabIndex={unit._unavailable ? -1 : 0}` and `aria-disabled={unit._unavailable || undefined}`. Inside `.storage-card__image`, render the badge:
   ```jsx
   {unit._unavailable && (
     <span className="storage-card__badge">Not available</span>
   )}
   ```

7. **`StorageOrganizer.css`** — add badge + unavailable card styles:
   ```css
   .storage-card__badge {
     position: absolute; top: 0.55rem; left: 0.55rem; z-index: 2;
     font-family: var(--font-body); font-size: 0.72rem; font-weight: 600;
     color: var(--color-cream); background: rgba(13, 20, 36, 0.82);
     padding: 0.32rem 0.55rem; border-radius: 6px;
     backdrop-filter: blur(4px);
   }
   .storage-card.is-unavailable { cursor: default; }
   .storage-card.is-unavailable .storage-card__photo {
     filter: grayscale(0.85) brightness(0.85);
   }
   .storage-card.is-unavailable .storage-card__body { opacity: 0.55; }
   .storage-card.is-unavailable:hover,
   .storage-card.is-unavailable.is-focused {
     transform: none; border-color: var(--color-border); box-shadow: none;
   }
   ```
   Add the shuffle animation:
   ```css
   .storage__cards {
     animation: cardsShuffle 380ms var(--ease-emphatic) both;
   }
   @keyframes cardsShuffle {
     from { opacity: 0; transform: translateY(6px); }
     to   { opacity: 1; transform: translateY(0); }
   }
   ```

8. **`src/components/StorageOrganizer/StorageMap.jsx`** — annotate the pin's class with `is-unavailable` based on `unit._unavailable`, and add `(not available)` to the `aria-label`. Build the class list before the template literal rather than inlining the ternary.

9. **`StorageMap.css`** — fade unavailable pins:
   ```css
   .storage-pin.is-unavailable {
     background: #6f7787;
     border-color: rgba(255, 255, 255, 0.7);
     opacity: 0.6;
   }
   .storage-pin.is-unavailable:hover {
     background: #6f7787;
     color: var(--color-cream);
     transform: translate(-50%, -100%);
   }
   ```

10. **Verify with `npm run build`** — CSS file grows from ~46.85 KB → ~47.72 KB, JS goes from ~320.13 KB → ~321.22 KB. Tiny delta; logic is small.

---

## 3. Records of Resistance

**R1 — Used a deterministic hash, not `Math.random()`.**
First impulse was to pick unavailable units randomly each Update click. That's cheap, but the cousin would lose trust quickly: pick May 15–22, see Safeguard unavailable; pick May 15–22 again, see Safeguard now available — feels like the date doesn't actually matter. Using a hash of the date pair as the seed gives the appearance of a real backend lookup (same input → same output). It's a small detail but it's what makes a demo feel like a product instead of a toy.

**R2 — Marked 2 of 6 as unavailable, not a variable number.**
Considered varying the count based on a second hash — sometimes 1, sometimes 3 unavailable. Decided against. With only 6 units, hitting 0 or 5 unavailable for some date pairs would look glitchy. A constant 2 means the cousin always sees 4 available — predictable visual rhythm, and it's enough to make the shuffle obvious without crippling the list. If the unit count grows past ~10, revisit.

**R3 — Pushed unavailable to the bottom rather than filtering them out.**
Could have filtered the unavailable units from the list entirely. Decided against because (a) the cousin should *see* which facilities aren't available — that's useful info, not noise (she might check back, or it nudges her sense of urgency for the ones that *are* available), and (b) the constant card count keeps the layout stable and the "Showing 1 – 6 of 80 movers" copy stays valid without conditional logic. Bottom-of-list with grayscale + badge is the right middle.

**R4 — Used a `key` to force list remount + CSS animation, not a more sophisticated approach.**
Considered FLIP (First-Last-Invert-Play) animation with the Web Animations API for a real "cards physically reshuffle" effect. Decided against — overkill for this. The `key`-driven remount triggers a single 380ms fade-up on the whole grid, which reads as "the list updated" without being a literal physics simulation. Costs 1 line of JSX + 8 lines of CSS vs. ~100 lines of FLIP plumbing.

**R5 — Dropped the "# available for [dates]" copy at user's request.**
First version of the count line read `"4 available for 2026-05-13 – 2026-05-20 · Sorted by …"` when dates were applied. Tina asked to remove that — the shuffle, the grayscale, and the badges already communicate the change. Extra copy was redundant. Kept the original count line untouched. (See checkpoint 13 R3 for a similar pattern — saying less, letting the design do the talking.)

**R6 — Disabled keyboard focus + hover on unavailable cards, but kept them rendered.**
`tabIndex={-1}`, `aria-disabled`, and gated hover/focus handlers mean unavailable cards exist visually but can't be selected. The map pin's click handler also no-ops naturally because we don't filter by available — clicking still toggles focus, but since the card is keyboard-skipped and visually faded, it feels right. Not perfect, but the alternative (route to a "this is unavailable" modal) is over-engineered for a demo. If Tina wants to surface "why is this unavailable?" later, the affordance is there.

---

## 4. Successes

**S1 — One click on Update produces a clear, visible change.**
Before: clicking Update did nothing. Date pickers felt vestigial. After: clicking Update grays out two specific cards, slides them to the bottom, fades two map pins, and the whole grid plays a soft fade-up animation. The cousin learns immediately that dates matter.

**S2 — Deterministic = trustworthy.**
Same date range always gives the same answer. If the cousin asks her dad "Hey, look at this site, is Safeguard available May 15–22?" and he checks too, they see the same thing. This matters more than I expected for trust in a demo.

**S3 — Map and list stay in sync without extra plumbing.**
The map gets `units` (which is `sortedUnits`) as a prop; the `_unavailable` flag rides along. StorageMap just reads it and tags the pin. No additional state synchronization, no parent ref, no event bus. The flag is a property of the data, and the data flows down — both the card and the pin read the same source.

**S4 — Animation is one keyframe + one key prop.**
The `cardsShuffle` keyframe is 6 lines of CSS. The `<ul>`'s `key={appliedDates ? \`${from}-${to}\` : 'all'}` is 1 line of JSX. React unmounts the old `<ul>` and mounts a new one; the new one animates in. No state machines, no animation library, no `useEffect` to trigger.

**S5 — Accessibility kept up.**
Unavailable cards have `aria-disabled` and `tabIndex={-1}` — screen readers announce them as disabled, keyboard nav skips them. The map pin's aria-label appends "(not available)" for screen reader users. The visual treatment (grayscale + badge) reinforces what assistive tech already announces.
