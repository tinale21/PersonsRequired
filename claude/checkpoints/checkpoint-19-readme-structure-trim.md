# Checkpoint 19 — README Trimmed to Spec Sections
**Date:** 2026-05-13
**Branch:** main
**Status:** README restructured to contain exactly the 11 sections Tina specified — in her requested order. Three new student-authored sections added (Research Documentation, Platform, Rationale). Three meta sections removed (What's Built, Tech Stack, Local Development). User Testing Evidence renamed from "First Contact." Live URL pulled out of the top into its own bottom section. All previously-written AI content (Direction Log, Records of Resistance, Mermaid) preserved verbatim.

---

## 1. Context

Tina specified the canonical section list for the README submission: Design Argument, Research Documentation, Platform, Rationale, AI Direction Log, Records of Resistance, Five Questions Reflection, Post-Mortem, Mermaid Diagram, User Testing Evidence, Live URL — in that order. The prior README had extra developer-facing sections (What's Built, Tech Stack, Local Development) that weren't part of the spec, was missing three required sections (Research Documentation, Platform, Rationale), and had Live URL as a status-line bullet at the top instead of its own section.

Rewrite is structural only. The substance of the AI-authored sections (Direction Log's 10 entries, Records of Resistance's 3 Person-grounded entries, the detailed Mermaid) carries over unchanged. The student-authored sections (Design Argument, Research Documentation, Platform, Rationale, Five Questions, Post-Mortem, User Testing Evidence) are all TBD with brief italic descriptions of what goes there.

Section descriptions for the three new sections:
- **Research Documentation**: evidence gathered about the Person, the Problem, and surrounding context — interviews, observations, references, alternatives surveyed.
- **Platform**: the chosen delivery format (web app, native app, print, physical artifact, etc.) and the reasons it fits this Person and this Problem better than the alternatives.
- **Rationale**: the connective tissue between the Person's situation, the Problem's shape, and the specific choices made in the prototype.

All three marked as student-authored. Tina fills these in herself.

Also bumped the checkpoint count reference in the Records of Resistance preamble from "Sixteen" → "Eighteen" so it stays accurate as the checkpoints folder grows.

---

## 2. Human Directions

Starting from checkpoint 18:

1. **Replace the whole README** with the new structure. Section order:
   1. Title + tagline (no status line)
   2. Design Argument — TBD
   3. Research Documentation — TBD (new)
   4. Platform — TBD (new)
   5. Rationale — TBD (new)
   6. AI Direction Log — preserve all 10 entries from checkpoint 17
   7. Records of Resistance — preserve all 3 entries; bump checkpoint count to 18
   8. Five Questions Reflection — TBD
   9. Post-Mortem — TBD
   10. Mermaid Diagram — preserve the detailed version from checkpoint 18
   11. User Testing Evidence (renamed from "First Contact") — TBD
   12. Live URL — its own section, single line

2. **Remove** What's Built, Tech Stack, Local Development entirely — not on the spec list.

3. **No build step** for a README change.

---

## 3. Records of Resistance

**R1 — Did NOT fill in the three new student-authored sections.**
Easy to draft plausible content for Research Documentation, Platform, and Rationale given context from earlier conversations (cousin's Notes app usage, Yale move, "she finishes a packing decision list without abandoning it halfway", web app via GitHub Pages, etc.). Per the assignment rule Tina set ("AI may not write the Design Argument, research documentation, or user testing notes") and reinforced in the prior AskUserQuestion answer ("write the technical content for the AI sections" — explicitly excluding Design Argument, First Contact, Five Questions, Post-Mortem), Research Documentation and Platform/Rationale fall on the student-authored side. Wrote brief italic placeholders so the section is structurally complete; Tina fills in the content.

**R2 — Used a full Write rather than incremental Edits.**
Six sections needed to be removed, three added, and Live URL moved from top to bottom. Surgical Edits would have been many calls (delete What's Built, delete Tech Stack, delete Local Development, insert three new sections in the middle, etc.) with brittle ordering dependencies. Read the existing file (already in context), then issued one Write with the final state. One operation, atomic, easy to review.

---

## 4. Successes

**S1 — README matches the spec exactly.**
Eleven sections, in the requested order, no extras. The instructor opening this README sees the structure their spec calls for; nothing missing, nothing extra.

**S2 — All AI-authored content preserved verbatim.**
The 10 Direction Log entries, the 3 Records of Resistance entries, and the detailed Mermaid diagram are bit-for-bit identical to what they were before the restructure. No accidental edits, no rewording, no loss.

**S3 — Live URL is now durable as its own section.**
Previously it was in a status block at the top that also carried a "still pending" sentence — easy to lose track of when the status changed. Now it's `## Live URL` with the bare URL underneath. The instructor or grader can `Cmd-F` "Live URL" and land immediately.
