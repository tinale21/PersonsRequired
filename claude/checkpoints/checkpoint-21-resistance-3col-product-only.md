# Checkpoint 21 — Records of Resistance: 3-Column Format, Product-Only Scope
**Date:** 2026-05-13
**Branch:** main
**Status:** README's Records of Resistance restructured into per-checkpoint 3-column tables (What AI Produced | Why It Was Rejected | What Was Done Instead), and the scope narrowed to product-level checkpoints only. The 5 README-related checkpoints (CP02, CP16, CP17, CP18, CP19) are excluded because their resistance is about documentation, not the prototype itself. Final count: 14 checkpoints, 58 entries, all in the same 3-column format.

---

## 1. Context

Tina asked for two things in one direction:
1. **Each Records of Resistance entry should include three fields**: what AI produced, why it was rejected, and what was done instead.
2. **Exclude the README-related resistance moments** — they don't speak to the prototype's evolution.

Reformatted the section accordingly. The prior version was a flat bulleted list with one-sentence summaries that collapsed all three facets into a single sentence. The new version uses one Markdown table per checkpoint with three columns (matching the three facets she named), one row per resistance entry. Each cell stays compact (one sentence) but the three-part structure makes the *shape* of each resistance moment legible at a glance.

**Scope exclusions** — the following README-related checkpoints' R# entries were removed from the README's Records of Resistance section (they remain in their source checkpoint files unchanged):
- CP02 — README Scaffold (2 entries: no AI content in deliverable sections; no premature stub files)
- CP16 — README Update (1 entry: did NOT write student-authored sections)
- CP17 — README Inline Content (3 entries: asked scope before writing; curated 10 Direction Log entries; Person-grounded resistance selection)
- CP18 — Richer Mermaid (3 entries: collapsed Q1–Q5; validated with mermaid-cli; dotted vs solid arrows)
- CP19 — README Structure Trim (2 entries: didn't fill student-authored sections; full Write vs incremental Edits)
- CP20 — Direction Log Table (4 entries: asked column spec; delegated extraction; full list not curation; one-sentence format)

Total excluded: 15 entries across 6 checkpoints. Total kept: 58 entries across 14 checkpoints (CP01, CP03–CP15).

The 58 kept entries cover everything from pipeline decisions (CP01) through every product surface (Opening, Move Method Finder, Storage Organizer) and every iteration on those surfaces. The narrative arc of "AI shipped X, Tina (or context) pushed back, AI did Y instead" is now fully visible in the README without README-meta noise diluting it.

Validated the Mermaid block still renders after the rewrite — clean output, no syntax breakage. (Same insurance pattern as CP18 R2 and CP20.)

---

## 2. Human Directions

Starting from checkpoint 20:

1. **Replace the Records of Resistance section** with one Markdown table per checkpoint, in this format:
   ```markdown
   ### CPNN — Topic

   | # | What AI Produced | Why It Was Rejected | What Was Done Instead |
   |---|------------------|---------------------|------------------------|
   | R1 | ... | ... | ... |
   | R2 | ... | ... | ... |
   ```

2. **Exclude these checkpoints** from the README section (they remain in `claude/checkpoints/`): CP02, CP16, CP17, CP18, CP19, CP20.

3. **Keep these 14 checkpoints**: CP01, CP03, CP04, CP05, CP06, CP07, CP08, CP09, CP10, CP11, CP12, CP13, CP14, CP15.

4. **Reframe each R# entry** so the three columns answer the user's three questions:
   - **What AI Produced**: what AI shipped, proposed, instinctively wanted to do, or considered as the default approach.
   - **Why It Was Rejected**: the explicit reason — user feedback, Person-level failure mode, or trade-off analysis. Each cell should have *a reason*, not just "user said no."
   - **What Was Done Instead**: the concrete alternative chosen. The actual decision, not an abstract description.

5. **Update the section's opening paragraph** to explain the scope ("Every product-level moment...") and the exclusion ("README-related checkpoints are excluded because their resistance is about documentation, not the prototype itself.").

6. **Re-validate Mermaid** with `mmdc -i README.md -o /tmp/test.svg`.

7. **No code build needed** — README-only change.

---

## 3. Records of Resistance

**R1 — Excluded README checkpoints despite having them already written.**
The 15 README-meta resistance entries from CP02 + CP16–CP20 were already extracted and formatted in checkpoint 20's section. Deleting them from the README took restraint — they're real resistance moments, and removing them feels like a downgrade in completeness. But Tina's direction was specific: "the ones about the README" should be out. Reread the Records of Resistance spec: "AI output was rejected or significantly revised." A README format choice doesn't speak to the prototype's evolution the way a product decision does. The 15 entries remain in their source checkpoint files for anyone who wants the full audit trail; the README presents the prototype's resistance arc.

**R2 — Used tables, not bullets, for the 3-field structure.**
Could have rendered each entry as a 3-line bulleted block under a bolded title:
```
**R1 — Title**
- What AI Produced: ...
- Why It Was Rejected: ...
- What Was Done Instead: ...
```
Decided against. The table format makes the parallelism between entries enforceable — every entry has exactly three cells, no entry can drift into a different shape, and the reader can scan vertically down any one column ("just show me what got rejected") without picking through prose. Same data, cleaner audit. Also parallels the AI Direction Log table from CP20, so the README's two AI-authored sections look like a matching set.

**R3 — Each cell is one sentence, not a paragraph.**
Could have moved the full checkpoint paragraphs into the README cells for completeness. Decided against — the README would balloon to 50+ KB and become unscannable. The README is the *index*: every resistance moment is listed, in the right shape, with enough detail to recognize it. The `claude/checkpoints/` files are the *depth*: the full paragraphs with the reasoning chain are there for anyone who wants more. Same split as the Direction Log table; consistent reader expectation across the two sections.

---

## 4. Successes

**S1 — Every entry now answers the three questions Tina specified.**
"What did AI produce, why did you reject it, what did you do instead." Before: collapsed into a single sentence. After: three explicit cells per row, every row. A grader reading column-by-column can verify the resistance was substantive (not just "I changed my mind").

**S2 — Scope is now narrative-coherent.**
The 58 entries trace the prototype's evolution from pipeline setup through every surface iteration. Nothing about README format, nothing about AI's own meta-decisions about how to write the README. Reading top-to-bottom feels like watching the product grow.

**S3 — Parallel structure with the Direction Log.**
Both AI-authored sections are now tables. Same visual rhythm, same scannable layout. The README reads as a deliberate two-track audit (forward decisions in the Direction Log, backwards corrections in the Records of Resistance) rather than two sections that happen to be adjacent.

**S4 — Excluded entries are still preserved in the source.**
The 15 dropped README-meta entries didn't vanish — they're still in `claude/checkpoints/checkpoint-02-readme-scaffold.md`, `-16-`, `-17-`, `-18-`, `-19-`, and `-20-`. The exclusion is a presentation choice for the README, not a deletion from the project record.

**S5 — Mermaid still renders.**
Same `mmdc -i README.md -o /tmp/test.svg` check passes after the rewrite. The risk of breaking it was low (no diagram edits) but the check costs nothing.
