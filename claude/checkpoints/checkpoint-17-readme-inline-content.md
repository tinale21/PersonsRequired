# Checkpoint 17 — README Inlined: AI Direction Log + Records of Resistance
**Date:** 2026-05-13
**Branch:** main
**Status:** Replaced the `claude/...` file-link placeholders in the README with inline content for the two sections that document AI behavior. The AI Direction Log now has 10 entries spanning the full arc; the Records of Resistance has 3 Person-grounded entries. Student-authored sections (Design Argument, First Contact, Five Questions, Post-Mortem) remain TBD but no longer link to non-existent files.

---

## 1. Context

In checkpoint 16, the README was refreshed with What's Built + Tech Stack + a real Mermaid diagram, but several sections still pointed to `claude/<section>.md` files that don't exist. Tina asked to drop the external file links and inline the content directly.

Asked her to clarify scope before writing: did she want me to write all sections (including the student-authored ones, which would violate the assignment rule she set earlier)? She picked the middle option: drop the file links and write the AI-behavior sections inline, but leave Design Argument, First Contact, Five Questions, and Post-Mortem as TBD because those are about her Person, her testing, and her own reflection.

**AI Direction Log** — 10 entries chosen to cover the full arc per the P3 spec ("research synthesis, architecture decisions, platform-specific implementation, iteration based on user feedback"):
1. Platform & pipeline decision (Vite/React/Pages stack)
2. Three-surface scaffolding from Figma screenshots
3. Move Method Finder rebuilt to include the missing quiz
4. Packing list: flat → collapsible with counts (and the two-column reflow fix)
5. Modal portal to escape the transform stacking context
6. Folder tab: clip-path polygon → SVG background-image
7. Storage map: CSS abstract → Leaflet + OpenStreetMap
8. Storage card photos: colored placeholders → real images
9. Scrollable results frame matching map height
10. Update button: idle → deterministic availability shuffle

Each entry follows a tight format: **Directed** (what Tina asked), **AI did** (what came back, with technical details), **Kept** (final outcome). Length varies — bigger architectural decisions (Leaflet swap, scrollable frame) get more detail; smaller polish moments get less.

**Records of Resistance** — 3 entries, all Person-grounded per the spec's emphasis on Person-level resistance:
1. **Missing quiz** — A generic packing list would have caused exactly the abandonment behavior the success criterion measures against.
2. **CSS map** — The cousin moving from another state needs real geography; an abstraction with drag-pan failed the use case.
3. **Real storage photos** — Choosing storage sight-unseen needs actual building photos; the cousin sourced the photos herself, the most literal form of Person-level resistance.

Each Resistance entry has three parts: **What AI shipped**, **Why it was rejected/revised** (explicitly tying back to the cousin and the success criterion), and **Revision** (what replaced it). Tied the first one directly to the measurable success definition ("she finishes a packing decision list without abandoning it halfway") so the rejection isn't presented as a taste preference — it's a failure-mode argument.

**Student-authored sections** — Design Argument, First Contact, Five Questions Reflection, Post-Mortem. Dropped the "Lives at `claude/...md`" pointers (those files don't exist and would be confusing); kept the section header with a brief italic description of what goes there + **TBD.** in bold. So the README's structure is complete; Tina just fills in the four sections herself.

**Status line** updated: "Student-authored sections (Design Argument, First Contact, Five Questions Reflection, Post-Mortem) still pending." — drops AI Direction Log and Records of Resistance from the pending list since they're now done.

---

## 2. Human Directions

Starting from checkpoint 16:

1. **`README.md`** — for each of these sections, drop the "Lives at [`claude/...`](claude/...)" reference from the italic description:
   - Design Argument
   - First Contact
   - Five Questions Reflection
   - Post-Mortem

2. **AI Direction Log section**: replace the placeholder block with 10 entries in this format:
   ```markdown
   ### Entry N — Title
   **Directed:** [verbatim or paraphrased user direction]
   **AI did:** [technical detail of what was built/changed]
   **Kept.** [final outcome or revision count]
   ```
   Span from pipeline setup (Entry 1) to the availability shuffle (Entry 10).

3. **Records of Resistance section**: replace the placeholder block with 3 entries in this format:
   ```markdown
   ### Resistance N — "[quote or shorthand title]"
   **What AI shipped:** [...]
   **Why it was rejected:** [Person-level grounding, tied to the success criterion]
   **Revision:** [...]
   ```
   Lead with the missing quiz (highest stakes), then the CSS map, then the placeholder card photos.

4. **Status line**: drop AI Direction Log from the pending list since it's now inline. Final pending list: Design Argument, First Contact, Five Questions, Post-Mortem.

5. **Build is N/A** for a README change — no need to `npm run build` (but it'll still pass).

---

## 3. Records of Resistance

**R1 — Stopped to ask scope before writing.**
Tina said "just write everything out there." That was ambiguous — could have meant "fill in all sections including the ones I'm supposed to author" (which would violate the rule she set earlier: AI may not write Design Argument, research docs, or user testing notes). Used `AskUserQuestion` with three options ranging from minimal to maximal scope, flagging the middle option as recommended and the maximal option as a rule violation. She picked middle. Cost of asking: one extra turn. Cost of writing the wrong thing: ghostwriting student work that her instructor needs to see came from her.

**R2 — Selected 10 Direction Log entries, not all 17 checkpoints.**
Could have written one Direction Log entry per checkpoint. Decided against — many checkpoints are pixel-polish iterations (image height +12px, bullet color from `--ink-soft` → `--muted`) that are noise at the AI-direction level. The 10 entries map to architectural inflection points: tool choices, missing features, wholesale replacements, platform-specific fixes. The 17 checkpoints remain in `claude/checkpoints/` as the detailed record; the Direction Log is the curated narrative.

**R3 — Grounded Records of Resistance in the success criterion, not just preference.**
First instinct was to pull the most visually-discussed resistance moments (folder tab shape, scrollable frame "squished" attempt). Reread the P3 spec: "emphasis on person-level resistance (not just visual)." Switched to three entries where the rejection was about the cousin failing the actual use case — the missing quiz would cause abandonment (the success criterion); the CSS map fails someone moving to an unfamiliar city; the placeholder photos fail someone choosing sight-unseen. Each entry now ties the rejection back to a concrete failure-mode for the Person, not "I don't like how this looks."

---

## 4. Successes

**S1 — Boundary respected: zero ghostwriting of student-authored sections.**
Design Argument, First Contact, Five Questions, Post-Mortem all still say TBD. The instructor opening this README will see exactly what Tina wrote and what came from AI. The boundary line is enforced by section, not by prose-style heuristics — clear and auditable.

**S2 — Direction Log narrative arcs cleanly from setup to polish.**
Entries 1–2 = setup. Entries 3–4 = structural restructures driven by user feedback (missing quiz, overwhelming list). Entries 5–6 = platform-specific implementation (modal portal, SVG fallback). Entries 7–8 = wholesale replacements (Leaflet, real photos). Entries 9–10 = late-stage feature work (scrollable frame, availability shuffle). Anyone reading top to bottom sees the project mature.

**S3 — Records of Resistance has bite.**
The three entries pull from the actual highest-stakes moments. They argue for *why* rejection happened, tied to a real Person and a measurable success criterion — not "AI proposed X, user preferred Y." Reads less like a list of fixed things and more like an argument about what serves the cousin.

**S4 — Self-contained README.**
A reader can land on the repo and understand the project end to end in one document — what it is, what's built, how it's structured, what direction it took, and where it pushed back. No clicking out to files that might not exist yet.
