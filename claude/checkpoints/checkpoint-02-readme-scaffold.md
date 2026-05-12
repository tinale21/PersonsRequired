# Checkpoint 02 — README Scaffold
**Date:** 2026-05-11
**Branch:** main
**Status:** Deliverable hub README added with empty section markers. No student work authored by AI.

---

## 1. Context

Follow-on to [`checkpoint-01-pipeline-setup.md`](checkpoint-01-pipeline-setup.md). User noticed there was no README and asked for one. Chose the "full deliverable scaffold" option (modeled on the structure of `test2/README.md` and `ReactiveSandbox/README.md`).

**What was added:**
- `README.md` at repo root with section headings for every P3 deliverable, each marked `TBD` and pointing to where the student-authored doc will live (e.g., `claude/design-argument.md`, `claude/ai-direction-log.md`, `claude/records-of-resistance.md`, `claude/first-contact.md`, `claude/post-mortem.md`)
- A placeholder Mermaid diagram stub showing the dependency chain (Design Argument → Master Spec → Architecture) but no real architecture
- Live URL, status line, and Local Development instructions (mechanical content only)
- Working title "Persons Required" — same as the repo. Student may choose a different product-facing name once the Design Argument is in hand.

**What was NOT added:**
- Any text characterizing the Person, the Problem, the Definition of "Helped," the Qualification, the Platform Decision, or the Non-Negotiables
- A real Mermaid architecture diagram (depends on the build, which doesn't exist)
- Five Questions reflection text
- AI Direction Log entries
- Any stub files at `claude/design-argument.md`, etc. — these will be created by the student when authored

---

## 2. Human Directions

To recreate from the state after checkpoint 01:

1. Run `Skill: Read /Users/tinale/Documents/GitHub/test2/README.md` to study the section structure used in the prior project.
2. Write a new `README.md` at the repo root using the same section order, adjusted for P3 deliverables:
   - Add "First Contact (User Testing Evidence)" section (P3-specific, not in P1)
   - Add "Post-Mortem" section (P3-specific)
   - Rename "Design Intent" → "Design Argument" (P3 vocabulary per the framework)
3. Mark every student-authored section as `TBD` with a link to where it will live under `claude/`.
4. Stub the Mermaid diagram with the dependency chain only, not real architecture.
5. Commit with the README + this checkpoint together.

---

## 3. Records of Resistance

**R1 — No AI content in any deliverable section.**
The temptation when writing a README scaffold is to "helpfully" draft placeholder Design Argument copy or invent a working title and tagline. Held back. The P3 framework is explicit: AI may not write the Design Argument, research documentation, or user testing notes. Every section that bears on the Person or the design thesis is `TBD` with no AI-drafted content.

**R2 — No premature stub files.**
AI considered creating empty `claude/design-argument.md`, `claude/ai-direction-log.md`, etc. as stubs. Held back. Those files should appear when the student starts writing them, not before. Empty AI-created stub files would muddy git blame and obscure when the student's intellectual work actually began.

---

## 4. Successes

**S1 — Mirrored prior README structure exactly.**
Following `test2/README.md` as the template (rather than inventing a new one) keeps the deliverable hub format consistent across the student's three projects. Easier to grade, easier to update, and the student already knows what each section is for.

**S2 — TBD markers, not fake content.**
Every section the student must author shows `TBD` in plain English with a one-line description of what belongs there. This makes the gap obvious (no risk of submitting AI-drafted text by accident) while giving a clear target for what to write.
