# Checkpoint 07 — Wizard Polish: Back Arrow, Layout, Toggleable Choices
**Date:** 2026-05-13
**Branch:** main
**Status:** Wizard navigation moved to a back arrow next to the progress bar. Choices can now be deselected by clicking again. First-question Back resets the selection.

---

## 1. Context

A round of focused polish on the Move Method Finder wizard:

**Navigation moved to a back-arrow icon next to the progress bar.** "Back" as a text button beside Next felt heavy and competed for attention. The Back text was removed from the actions row entirely; a small circular chevron-left icon button (`M15 18l-6-6 6-6` SVG path) now sits to the left of the progress bar in a new `.wizard__progress-row` container. Same `handleBack` behavior — on Q2+ it moves back a question; on Q1 it clears the current selection.

**Q1 Back resets the selection (not the whole wizard).** On the first question, clicking Back used to be a no-op since there was no prior question. New behavior: `handleBack` checks `if (index === 0)` and deletes `answers[q.id]` so the highlight clears and `hasAnswer` becomes false (hiding the Next button until a new choice is selected). Q2+ behavior unchanged.

**Single-select choices are now toggleable.** `setSingle` was previously a write — clicking an already-selected option just rewrote the same value. New behavior: if the clicked value equals the current answer, the answer is deleted (the choice is deselected). `toggleMulti` already had this behavior for multi-select, so single-select now matches.

**Actions row layout simplified.** Was previously a 3-column grid (Back left, center, empty right). Now that Back lives next to the progress bar, the actions row is just a centered flex with Skip (optional, conditional) and Next.

**Question title moved up 32 px.** Negative `margin-top: -32px` on `.wizard__title` to tighten the space between "QUESTION N" and the question text. Reduced the title font-size from `clamp(1.4rem, 2.6vw, 2rem)` → `clamp(1.2rem, 2.2vw, 1.7rem)`.

**Choices area got a 32 px top margin** plus the gap-between-choices-and-actions was bumped from `calc(2.5rem + 16px)` → `calc(2.5rem + 40px)` (so Next sits 24 px further below the choices).

**Next Question button polish.** Padding adjusted to `0.95rem calc(2rem + 8px)` (8 px less horizontal than at one point); font-size shrunk from `1rem` → `0.875rem`; background switched from `var(--color-ink)` (#1a2438) to pure `#000` (with `#1a1a1a` hover). The earlier experiment of a gold gradient was reverted at Tina's request — too prominent.

**Question-5 textarea sizing fix.** The textarea was rendering at ~200 px wide because `.wizard__text-wrap` had `width: 100%` inside an `inline-flex` parent that sized to its content. Swapped to `width: 800px; max-width: 100%` so the wrap requests an explicit width and the inline-flex parent expands to it. Textarea also re-themed to `background: #f9f8f8; border: 1px solid #e0e0e0` to match the rest of the new palette.

---

## 2. Human Directions

To recreate this state from the end of checkpoint 06:

1. **Title tightening.** `.wizard__title { margin-top: -32px; font-size: clamp(1.2rem, 2.2vw, 1.7rem); }`.
2. **Spacing.** `.wizard__choices-area { margin-top: 32px; }`. Bump the gap between choices and actions to `calc(2.5rem + 40px)` (via the `gap` on `.wizard__choices-area` if actions still nested there, otherwise as `margin-top` on `.wizard__actions`).
3. **Toggleable single-select.** Replace `setSingle` to delete `answers[q.id]` when the clicked value matches the current value; otherwise write the value.
4. **Q1 Back resets selection.** `handleBack` branches on `index === 0`: if true, delete `answers[q.id]`; else `setIndex(i - 1)`.
5. **Always-visible Back.** Remove the `index > 0 &&` guard around the Back button (handled by the conditional handler logic now).
6. **Back arrow next to progress bar.** Wrap the existing `.wizard__progress` in a new `.wizard__progress-row` flex container, prepending a `<button className="wizard__back-arrow">` with an inline `<svg>` containing path `M 15 18 l -6 -6 l 6 -6`. Style as a 36×36 circular button with `color: #000`, transparent bg, subtle hover.
7. **Remove the Back button from the actions row.** Actions now contains only Skip (conditional) + Next, with `display: flex; justify-content: center`.
8. **Next button.** `padding: 0.95rem calc(2rem + 8px); font-size: 0.875rem; background: #000; hover: #1a1a1a`.
9. **Question-5 textarea sizing.** `.wizard__text-wrap { width: 800px; max-width: 100%; }` and `.wizard__textarea { background: #f9f8f8; border: 1px solid #e0e0e0; }`.

---

## 3. Records of Resistance

**R1 — Gold gradient on the Next button was reverted.**
At one point we colored the Next button with the same gold gradient used in the opening screen's Start CTA. Tina rejected it — too prominent against the otherwise muted wizard UI. Reverted to black. The principle: the opening screen is theatrical; the wizard should fade into the background so the user's choices stand out. Two different visual languages for two different screens.

**R2 — Scale-down-actions experiments left a trap.**
We scaled `.wizard__actions` down (0.7 → 0.85 → 0.9 → 0.5 etc.) several times. The first scale didn't appear to take effect because the `actionsIn` keyframe ended with `transform: translateY(0)` — overriding the static `transform: scale(0.X)` on the element. We then bundled `scale()` inside the keyframes so the scale persisted through the animation. When the layout later changed to put the back arrow elsewhere, the scale was removed entirely. Lesson noted: when both static `transform` and keyframe `transform` are set on the same element, the keyframe wins for any property it touches. Use CSS variables or scope the scale to a child element if you want both.

**R3 — Initial back-button-on-the-left attempt left the button invisible.**
First attempt at right-aligning Back used `align-self: flex-end; margin-top: -2.5rem` which lifted Back above the choices area entirely — out of the visible flow. Then I tried absolute positioning anchored to the actions row, which worked but felt cramped. Final solution was the grid 1fr-auto-1fr layout, then ultimately the back arrow next to the progress bar (which solves the problem entirely by relocating Back out of the actions area).

**R4 — Single-select toggle behavior was a small but intentional change.**
The wizard previously required users to commit to a choice once clicked (no way to "unpick" without picking another option). Tina explicitly asked for this — it lets a user start an answer, change their mind, and step away from the question. Pairs well with the Q1-Back-resets-selection change: both treat the user's choice as undoable rather than committed.

---

## 4. Successes

**S1 — Moving Back to a chevron icon out of the actions row reads more naturally.**
The actions row is now visually quieter — just one primary button (Next) with optional Skip. Back is recognizable as navigation via its icon and position next to the progress bar (a standard pattern in wizards / multi-step forms). Less cognitive load on the user to figure out which button is the next-step CTA.

**S2 — Q1 Back as a soft reset instead of a no-op.**
Always-visible Back with `index === 0` branching to clear the answer gives the user consistent behavior: Back means "undo whatever you just did," whether that's a selection or a question advance. Both states converge on the same mental model.

**S3 — Toggle-off single-select via `setSingle` parity with multi-select.**
The single/multi inconsistency (multi could be toggled, single could not) is now resolved. Same gesture, same outcome, same UX.

**S4 — Textarea sizing bug had a clean two-character fix.**
Swapping `width: 100%; max-width: 800px` for `width: 800px; max-width: 100%` is functionally equivalent in a normal flow but radically different inside an `inline-flex` parent. The latter forces the parent to grow; the former requests 100% of an undecided parent and collapses. Worth remembering.
