# Checkpoint 26 — Records of Resistance: Expanded Detail, CP01 Dropped
**Date:** 2026-05-14
**Branch:** main
**Status:** Records of Resistance section in the README rewritten with two changes: (1) CP01 (Pipeline Setup) excluded from the scope, and (2) each entry's three fields (What AI Produced / Why It Was Rejected / What Was Done Instead) expanded from one sentence to a 2–3 sentence paragraph with concrete detail. Format changed from per-checkpoint Markdown tables to structured bullet-list prose under bold entry titles. Final count: 13 checkpoints (CP03–CP15), 54 entries, every entry now has substantive depth.

---

## 1. Context

Tina asked for two specific changes:
1. **Exclude the CP01 Pipeline Setup entries** from the README's Records of Resistance. They're about project plumbing (Vite/React stack choice, JS vs. TS, framework continuity) rather than the prototype's design evolution.
2. **Make each entry more detailed.** The prior compact one-sentence-per-cell format made it hard to understand the substance of any single resistance moment — too compressed to convey *why* the alternative was rejected or *what specifically* was done instead.

Format change accompanied the detail expansion: per-checkpoint Markdown tables work for one-sentence cells but become unreadable with multi-sentence cells (cells become tall, columns lose alignment). Switched to a structured bullet-list layout:

```markdown
### CPNN — Topic

**R1 — Short title**
- **What AI Produced:** [2–3 sentences with concrete detail]
- **Why It Was Rejected:** [2–3 sentences explaining the reasoning, naming the trade-off]
- **What Was Done Instead:** [2–3 sentences describing the actual decision, with specifics]

**R2 — ...**
- ...
```

Each cell now has room to name specific CSS rules, file paths, numeric values, trade-offs, and the chain of "why this not that." Examples of the depth gained:

- **CP06 R2 (arc sweep-flag)**: was "Rewrote top corners as explicit `A` arc commands with sweep-flag 1." Now includes the diagnosis (`sweep-flag 0` rendered concave, flipped to `1` for convex), the underlying SVG semantics (clockwise traversal, chord-bulging behavior), and the lesson logged for future tweaks.
- **CP09 R1 (portal)**: was "Inline `position: fixed` modal failed because of ancestor `transform`." Now includes the four CSS properties (`transform`, `filter`, `perspective`, `will-change: transform`) that create containing blocks, and the diagnostic rule for future debugging.
- **CP14 R1 (deterministic hash)**: was "Used a hash so same dates always produce the same result." Now explains the trust argument (cousin picks May 15–22 twice, gets the same result both times, so dates feel load-bearing) and contrasts with `Math.random()`'s failure mode.

Re-read the older checkpoint files (CP03–CP10) via Bash to pull accurate details for the older entries — relying on memory or one-sentence summaries would have been thin. The newer ones (CP11–CP15) I had direct context on from recent work.

Mermaid block validated after the rewrite via `mmdc -i README.md -o /tmp/test.svg` — clean render, no syntax breakage in the rest of the document.

---

## 2. Human Directions

Starting from checkpoint 25:

1. **Delete the entire `### CP01 — Pipeline Setup` block** from the Records of Resistance section.

2. **Convert each remaining `### CPNN` block** from a Markdown table to a bullet-list format:
   ```markdown
   ### CP03 — Move Book Build

   **R1 — Title**
   - **What AI Produced:** ...
   - **Why It Was Rejected:** ...
   - **What Was Done Instead:** ...
   ```
   Each bullet's content should be 2–3 sentences with specific detail — file paths, CSS rule names, numeric values, trade-offs named.

3. **Update the section's opening paragraph** to reflect the new exclusion: "Pipeline-setup and README-related checkpoints are excluded because they speak to project plumbing or documentation, not the prototype itself."

4. **Pull accurate detail from the source checkpoint files** for older entries (CP03–CP10) — the agent-extracted one-sentence summaries from CP20 aren't enough to write a multi-sentence cell. Bash dump:
   ```bash
   for f in checkpoint-03 ... checkpoint-10; do
     awk '/^## 3\. Records of Resistance/,/^## 4\./' claude/checkpoints/${f}-*.md
   done
   ```

5. **Re-validate Mermaid** with `mmdc -i README.md -o /tmp/test.svg`.

6. **No code build needed** — README-only change.

---

## 3. Records of Resistance

**R1 — Switched format from tables to bullet lists despite continuity with CP21.**
Checkpoint 21 established the 3-column table format for the Records of Resistance, matching the table format used for the AI Direction Log. Maintaining format consistency was a reason to keep the tables and just lengthen the cells. Rejected — tables with multi-sentence cells become unreadable. Column widths collapse, cell content wraps at unpredictable points, the visual parallelism that made the table compelling at one sentence per cell breaks at three. Switched to bullet-list-under-bold-heading format, accepting the loss of visual parallelism with the Direction Log table because the Direction Log entries are inherently more parallel (one decision, one outcome) than Records of Resistance (multi-faceted trade-off analysis).

**R2 — Read the source checkpoints, didn't rely on memory or summaries.**
Tempting to expand each cell by elaborating on the one-sentence summaries from CP20's prior version. Decided against — for CP03–CP10 the source paragraphs in the actual checkpoint files contain technical detail (file paths, specific CSS property names, numerical values, the exact diagnostic chain) that I wouldn't have invented correctly from memory. Ran an `awk` dump of the Records of Resistance sections from CP03–CP10 to pull verbatim content, then synthesized into the 2–3 sentence cells. Cost: ~30 seconds of file reading. Benefit: every claim in the expanded entries is grounded in what was actually written at the time, not what I think happened.

**R3 — Did NOT include the CP01 Pipeline Setup entries even though they're arguably "AI resistance moments."**
The CP01 entries (Vite 7 vs. Vite 5, JS vs. TS, framework continuity) are legitimate resistance moments where AI defaulted to one choice and Tina chose another. Could have argued they belong in the Records of Resistance just like any other AI default that got overridden. Per Tina's explicit direction, excluded them. The reasoning that holds: those decisions are about project setup, not about the *prototype design*, which is what the case study is evaluating. The Records of Resistance now reads as a tight design-evolution arc starting at CP03 (when actual product building began) rather than a project history that includes plumbing.

---

## 4. Successes

**S1 — Every entry now answers "what, why, what instead" with substance.**
Before: 54 entries, one sentence per cell, ~150 words of resistance content per checkpoint. After: 54 entries, 2–3 sentences per bullet, ~400 words per checkpoint. The content is now dense enough that a grader reading any single entry can understand the alternative considered, the trade-off, and the chosen path — without needing to leave the README for the source checkpoint files.

**S2 — Bullet-list format scales with detail.**
Switching from tables to bullets means each entry can grow without breaking layout. Future revisions that add a fourth field (e.g., "Lessons logged") or expand any single cell to a longer paragraph won't require a format rewrite.

**S3 — CP01 cleanly removed without disturbing the narrative.**
The Records of Resistance now starts at CP03 — the first checkpoint where actual product code was written. The opening paragraph reframes the scope ("Pipeline-setup and README-related checkpoints are excluded...") so the reader knows the omission is intentional, not a gap.

**S4 — Mermaid still renders.**
Validated with `mmdc` after the rewrite. The diagram block was untouched but adjacent edits can introduce subtle Markdown breakage; a 10-second check confirms the document is still consumable by GitHub's renderer.
