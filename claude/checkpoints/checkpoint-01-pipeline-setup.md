# Checkpoint 01 — Pipeline Setup
**Date:** 2026-05-11
**Branch:** main
**Status:** Local scaffold + workflow in place. Not yet committed. Live deploy unverified (depends on GitHub Pages settings).

---

## 1. Context

This is Project 3 (Persons Required / The Lore Codex Capstone) for SCAD AI 201, Spring 2026. Today is Session 15 ("Build begins. Design Intent locked. AI translates your spec into a working prototype."). Project 3 is due Session 20 (5/29/26 per syllabus; 5/27 per the Persons Required framework — dates conflict slightly across the two source documents).

This checkpoint covers **pipeline setup only**. No design work has been done. The Design Argument (Person, Problem, Definition of "Helped," Qualification, Platform Decision, Non-Negotiables) is owned by the student and has not yet been shared with AI. Per the assignment, AI is not permitted to author the Design Argument, research documentation, or user testing notes.

**Repo:** `tinale21/PersonsRequired` on GitHub
**Expected live URL:** `https://tinale21.github.io/PersonsRequired/`

**What is built:**
- Vite 5 + React 18 + JavaScript scaffolded manually (not via `npm create vite`)
- `vite.config.js` with `base: '/PersonsRequired/'` for GitHub Pages project-page routing
- `.github/workflows/deploy.yml` — split build/deploy jobs, modeled on prior `test2` workflow
- Placeholder `App.jsx` renders a single dim line of text. No design, no components, no real content.
- `claude/docs/` already contains the two assignment PDFs (Context & Framework, Syllabus)
- `claude/checkpoints/` directory established for the pre-commit documentation protocol

**What is NOT built:**
- Design Argument (student's own work, will be shared when ready)
- Master Spec / Design Intent
- Mermaid architecture diagram
- Any actual product UI or components
- AI Direction Log entries (will start once design work begins)
- Records of Resistance specific to the product (this checkpoint contains process-level resistance only)

**Stack decision (locked):** Vite 5.4.2 + React 18.3.1 + `@vitejs/plugin-react` 4.3.1, JavaScript (no TypeScript). Matches prior P1 (`test2`) and P2 (`ReactiveSandbox`) exactly.

---

## 2. Human Directions

Steps to recreate this exact state from scratch:

1. Create a new GitHub repo named `PersonsRequired` with a LICENSE and initial commit. Clone it locally to `~/Documents/GitHub/PersonsRequired`.
2. Place assignment PDFs in `claude/docs/`.
3. Scaffold the following files manually (do not use `npm create vite`):
   - `package.json` — React 18 + Vite 5, `type: "module"`, scripts `dev`/`build`/`preview`
   - `vite.config.js` — `base: '/PersonsRequired/'`, `@vitejs/plugin-react`
   - `.gitignore` — `node_modules`, `dist`, `.DS_Store`, `*.local`
   - `index.html` — standard Vite entry pointing to `/src/main.jsx`, title "Persons Required"
   - `src/main.jsx` — mounts `<App />` to `#root` inside `<StrictMode>`
   - `src/index.css` — global reset, dark background placeholder
   - `src/App.jsx` — placeholder single-line component
   - `src/App.css` — centered placeholder styling
4. Create `.github/workflows/deploy.yml` — split `build` and `deploy` jobs; `actions/checkout@v4`, `setup-node@v4` (Node 20, npm cache), `npm ci`, `npm run build`, `upload-pages-artifact@v3` (path: `dist`), `deploy-pages@v4`. Trigger on push to `main` and `workflow_dispatch`.
5. Create `claude/checkpoints/` directory.
6. Run `npm install` from the project root.
7. Run `npm run build` and confirm `dist/` is produced without errors.
8. On GitHub: repo → Settings → Pages → set Source to **GitHub Actions**. (Pending — student must do this manually before the first deploy will succeed.)
9. Commit and push to `main` — Actions will build and deploy.

---

## 3. Records of Resistance

Process-level resistance only at this checkpoint. Product-level resistance will appear in later checkpoints once design decisions begin.

**R1 — "Do not build anything until I give you documentation."**
AI was prepared to start scaffolding immediately on the first message about a Vite app for GitHub Pages. User stopped that with an explicit instruction: read the assignment docs first, ask questions, then build. This is the correct ordering for an assignment whose explicit thesis is that the Person/Problem must precede AI engagement. Held the pause.

**R2 — Stack continuity over latest-version novelty.**
AI offered Vite 7 / React 19 as an option. User chose to match the prior P1/P2 stack (Vite 5.4.2 + React 18.3.1, plain JS). Rationale: continuity with prior AI Direction Logs and zero new patterns to learn under a tight deadline. Decision recorded explicitly rather than letting "latest is best" drive the choice.

**R3 — "What have I been using on my past projects?"**
When asked JS vs. TS, the user did not answer the framed question — instead pushed AI to ground the recommendation in actual evidence from prior projects. The right move. Inspecting `test2` and `ReactiveSandbox` showed JavaScript across both. Lesson: when AI presents a choice, the default should be to check what already exists in the user's history before answering, not after.

**R4 — "No this is not a Project 2 carry-over."**
AI's framing question assumed P3 would extend the "favorite toy" from P2 (per the Persons Required framework, which references continuity). User corrected: this is a fresh build. Assumption discarded. Note for later: the P3 framework language about "your strongest design system" does not bind every student to literal P2 code reuse.

---

## 4. Successes

**S1 — Pipeline-first, design-second discipline.**
User explicitly framed the first work session as file/pipeline setup only — no UI, no design decisions, no content. This matches the prior `ReactiveSandbox` pattern and avoids the trap of letting AI start making creative decisions before the Design Argument is in hand.

**S2 — Mirror-the-prior-project as a defensive scaffold strategy.**
Rather than scaffolding from a generic Vite template, AI read the existing `test2` and `ReactiveSandbox` projects and matched their exact conventions (package.json shape, file layout, vite.config base path style, workflow file format). Lower surface area for surprises and consistent with prior commits the student already understands.

**S3 — Build verified locally before commit.**
`npm install` (62 packages, no errors) and `npm run build` (310ms, no errors, dist produced) both succeeded before any commit. Catches base-path and import problems before they reach Actions.
