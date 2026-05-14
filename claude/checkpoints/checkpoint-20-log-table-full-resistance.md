# Checkpoint 20 — Direction Log as Table, Full Records of Resistance
**Date:** 2026-05-13
**Branch:** main
**Status:** README's AI Direction Log converted from 10 prose entries to a 10-row Markdown table (Date | Prompt | AI Output | Decision | Notes) matching the format Tina used in past projects. Records of Resistance expanded from 3 curated entries to all 73 entries pulled from every R# tag across 19 checkpoints, grouped by checkpoint in chronological order.

---

## 1. Context

Tina asked for two specific README changes:

1. **AI Direction Log → table format**, matching the column/row chart layout she used in past P1/P2 README submissions. Asked her which columns she wanted (didn't have access to her prior README to copy from); she chose the 5-column variant: **Date | Prompt | AI Output | Decision (Kept/Revised/Rejected) | Notes**.

2. **Records of Resistance → every single one captured.** Prior version had 3 curated Person-grounded entries. She wanted completeness over curation. Dispatched a general-purpose agent to read all 19 checkpoint files and extract every R# entry from each `## 3. Records of Resistance` section. Returned 73 entries total. Restructured the README section to list all 73 grouped under their checkpoint headers (CP01–CP19), each as a one-line bolded title + brief summary.

**Direction Log table**: 10 rows, same 10 architectural decisions as the prior prose version (pipeline → scaffolding → quiz rebuild → packing list → modal portal → folder tab → Leaflet → photos → scrollable frame → availability shuffle). All Date cells are `2026-05-13` since every checkpoint was written today (project clock). Decision column uses bolded verdict tags: `Kept`, `Revised`, `Kept (structure) / Revised (contents)`. Notes column captures the rationale/trade-off in one sentence each.

**Records of Resistance**: 73 entries grouped under 19 checkpoint headers (CP01 Pipeline Setup through CP19 README Structure Trim). Within each checkpoint, entries appear in their original R1, R2, R3 order. Each entry: bolded short title (the part after the dash on the `**R1 — Title**` line in the source) followed by one sentence of context distilled from the source paragraph. The original detailed paragraphs remain in `claude/checkpoints/` for anyone who wants the full reasoning.

Validated the Mermaid block still parses after the rewrite using `mmdc -i README.md -o /tmp/test.svg` — clean render, no syntax breakage.

---

## 2. Human Directions

Starting from checkpoint 19:

1. **Replace the AI Direction Log section** with a Markdown table:
   - Header row: `| # | Date | Prompt | AI Output | Decision | Notes |`
   - 10 rows, one per architectural decision from CP01–CP19's most consequential moments.
   - Use `<br/>` if a cell needs internal line breaks (rare in this version).
   - Bold the Decision verdict (`**Kept**`, `**Revised**`, etc.).
   - Escape literal pipes inside cells as `\|` (e.g., `from\|to` in the hash description).

2. **Use a general-purpose agent** (or read all 19 checkpoints manually) to extract every R# entry from each `## 3. Records of Resistance` section. Ask the agent for:
   - Checkpoint number + short topic
   - Tag (R1, R2, ...)
   - Short title (the dash-separated heading)
   - One-sentence summary

3. **Replace the Records of Resistance section** with a chronological list of all 73 entries, grouped under bolded checkpoint headers like `### CP01 — Pipeline Setup`, each entry as a single-line bullet starting with `**R1 — Title**`.

4. **Re-validate Mermaid** after the rewrite:
   ```bash
   npx --yes -p @mermaid-js/mermaid-cli mmdc -i README.md -o /tmp/test.svg
   ```

5. **No code build needed** — README-only change.

---

## 3. Records of Resistance

**R1 — Asked Tina for the table column spec instead of guessing.**
Direction Log "like past projects" is concrete to her but invisible to me (no access to her prior P1/P2 README at the time). Used `AskUserQuestion` with three column-layout options (5-column with Date, 4-column phase-based, 3-column minimal) rather than picking one. She chose the 5-column. Cost of asking: one turn. Cost of picking wrong: a rewrite she'd ask for anyway. Worth the explicit check.

**R2 — Delegated the 19-checkpoint extraction to a sub-agent.**
Could have read the 19 checkpoints in the main thread. Decided to dispatch a general-purpose agent with the task instead — saves my context window from absorbing ~150 KB of checkpoint prose I only need a structured summary of. Asked the agent for grouped output (checkpoint → entry tag → short title → one-sentence summary) and explicitly told it not to drop any entries even if they seemed trivial. Returned 73 entries; I rendered them into the README. Sub-agent paid the read cost; my context stayed clean.

**R3 — Listed all 73 entries instead of re-curating.**
Tempting to keep the 3 Person-grounded narrative entries from the prior version and append a "complete log" subsection below. Decided against — Tina said "make sure every Records of Resistance is there," which reads as "I want all of them visible, not 3 highlighted and 70 in a footer." Replaced the curated 3 entirely with the complete chronological list. The 3 narrative entries are now subsumed under their checkpoint headings (CP03 R1 quiz, CP11 R1 Leaflet, CP12 photos) — same content, different organization.

**R4 — Preserved one-sentence-per-entry format, didn't expand to full paragraphs.**
Each of the 73 entries could be a paragraph (the source checkpoints have full paragraphs). Decided to keep them as one-sentence summaries with a pointer to `claude/checkpoints/` for full detail. Two reasons: (a) the README would balloon to 30+ KB with all paragraphs inlined, hard to skim; (b) the full paragraphs already exist in the checkpoint files and are linked. The README gives a complete *index* of every resistance moment; the checkpoints give the depth.

---

## 4. Successes

**S1 — Direction Log format matches Tina's past-project convention.**
She no longer has to translate between AI's preferred prose format and her own table format when assembling her submission. The table she sees in the rendered README is the same shape she'd write by hand.

**S2 — Every single resistance entry is now in the README.**
73 entries, 19 checkpoints, zero dropped. A grader auditing whether the project actually documents AI pushback can verify it without leaving the README. The depth lives in checkpoint files but the breadth is fully present in one document.

**S3 — Sub-agent ran in parallel with my context.**
Dispatched the extraction agent in one tool call; my context absorbed only the structured summary (~5 KB) rather than the raw checkpoint prose (~150 KB). The README rewrite that followed had room to work without pressuring context limits.

**S4 — Mermaid still renders.**
Validated after the rewrite. The risk of breaking the diagram was low (no edits to the diagram block) but checking takes 10 seconds and prevents an embarrassing "GitHub shows raw mermaid code" situation. Same insurance pattern as CP18 R2.
