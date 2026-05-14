# Checkpoint 16 — README Refresh
**Date:** 2026-05-13
**Branch:** main
**Status:** `README.md` updated to reflect what's actually been built. Replaced the "Build not yet started" placeholder language with concrete descriptions of all three surfaces, a real Mermaid architecture diagram, and a Tech Stack section. Student-authored sections (Design Argument, AI Direction Log, First Contact, Five Questions, Post-Mortem) left as TBD per the assignment rules.

---

## 1. Context

The original `README.md` was a stub: "Pipeline online. Design Argument pending. Build not yet started." plus placeholders for all the SCAD-required docs. After 15 checkpoints of building, that status line was no longer accurate — Tina has a working prototype across all three surfaces (Opening Screen, Move Method Finder, Storage / Shipping Organizer), and the Mermaid diagram still said "Architecture — TBD."

Updated the README to:
1. **Status line:** "High-fidelity prototype shipped across all three surfaces. Design Argument, AI Direction Log, and First Contact (Session 16) student-authored docs still pending."
2. **New "What's Built" section** describing each surface concretely — opening reveal, 5-question quiz mechanics, packing list (collapsible categories, two-column layout, add-item modal), storage organizer (search row, scrollable card frame, Leaflet map, deterministic availability shuffle on Update).
3. **New "Tech Stack" section** listing Vite/React/Leaflet/localStorage/GitHub Pages versions and rationale.
4. **Real Mermaid diagram** replacing the TBD placeholder. Shows the App → tab nav → three panels → sub-components (Wizard, PackingList, Modal, StorageMap, Cards) plus the localStorage stores and the data flow from the availability shuffle into both cards and map.
5. **Records of Resistance section** now points to the 15 checkpoint docs and surfaces three notable moments (squished frame attempt, dropped "# available" copy, approximate map coordinates) as in-the-meantime examples.

Sections **NOT** touched (per the assignment rule that AI may not write the Design Argument, research documentation, or user testing notes): Design Argument, AI Direction Log, First Contact, Five Questions Reflection, Post-Mortem. All still marked TBD with their original "lives at `claude/...`" pointers.

---

## 2. Human Directions

Just edit `README.md`:

1. Update title to "Persons Required — The Move Book" and update the status line.
2. Replace the empty Mermaid block with the real one (App → tabs → panels → sub-components).
3. Insert two new sections between "Design Argument" and "Mermaid Diagram": **What's Built** (one paragraph per surface) and **Tech Stack** (bullets).
4. Extend the Records of Resistance placeholder with a pointer to the 15 checkpoints and three example moments.
5. Leave all other TBD sections (Design Argument, AI Direction Log, First Contact, Five Questions, Post-Mortem) untouched.

---

## 3. Records of Resistance

**R1 — Did NOT write the Design Argument, AI Direction Log, First Contact, Five Questions, or Post-Mortem.**
Tempting to fill in everything since I have all the context (cousin → Yale → notes app → "finishes packing without abandoning halfway", etc.), but per the assignment rule those are explicitly student-authored. Wrote the technical descriptions instead (What's Built, Tech Stack, Mermaid) which are documentation of the code I shipped — not the design framing Tina has to author and own.

---

## 4. Successes

**S1 — The README is now accurate documentation, not a stub.**
A new reader (instructor, classmate, future self) can land on the repo, read the README, and understand exactly what the app does and how it's structured. Before, they'd see "Build not yet started" and bounce.

**S2 — Mermaid diagram shows the real architecture.**
Replaced "Architecture — TBD" with a flowchart that maps cleanly to the file structure: AppShell → tab nav → Opening, MoveMethodFinder, StorageOrganizer panels, each with their sub-components and data flows. Anyone debugging the code or extending it has a top-down picture to start from.

**S3 — Boundary respected — no student work ghostwritten.**
Five sections still say TBD. That's not a gap; it's correct behavior. Tina's instructor needs to see what she wrote, not what I wrote on her behalf.
