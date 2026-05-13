# Checkpoint 04 — Opening Screen Rebuild
**Date:** 2026-05-13
**Branch:** main
**Status:** Opening screen rebuilt from layered individual assets + CSS-rendered title. Quality and composition match the Figma reference more closely than the v1 flat-frame approach.

---

## 1. Context

The v1 opening screen (checkpoint 03) stacked 8 sequential Figma export frames as crossfade-stacked JPEG backgrounds. After Tina viewed it locally, she flagged the result as low quality. Diagnosis: each Figma frame is the same skyline plus one new overlay, baked flat and compressed at JPEG q75 at 1600 px max width. That stores the skyline at compressed quality 8 times, and every element on top inherits the softness.

Tina exported individual transparent assets and a higher-resolution skyline (243 PNG-original at ~24 MB raw, then the user uploaded a re-rendered 943.jpg at 17 MB raw). This checkpoint rebuilds the opening as:

- One high-quality skyline JPEG (compressed q88, 2800 px wide → ~2 MB)
- Four individual transparent PNGs for the decorative elements (tickets, seal, bulldog, airplane), each resized and saved at their natural resolution
- The "The Move Book" title and the route + subtitle now rendered in CSS using webfonts (Cinzel for MOVE/BOOK, Pinyon Script for "The", Cormorant Garamond for the route, Inter for the subtitle)

**Files removed:** `public/opening/01-skyline.jpg` through `public/opening/09-start.jpg` (8 frames)

**Files added:** `public/opening/skyline.jpg`, `public/opening/tickets.png`, `public/opening/seal.png`, `public/opening/bulldog.png`, `public/opening/airplane.png`

**Files modified:**
- `index.html` — added Pinyon Script to the Google Fonts request
- `src/index.css` — added `--font-cursive` token
- `src/components/OpeningScreen/OpeningScreen.jsx` — full rewrite with layered elements + CSS text stack
- `src/components/OpeningScreen/OpeningScreen.css` — layout wrapper, per-element positioning, gold-gradient text fills, micro-animations, dark navy veil over the skyline
- `src/components/AppShell/AppShell.css` — pointed the header strip's background-image at the new skyline asset

---

## 2. Human Directions

After Tina ran `npm run dev` and viewed v1, the iteration loop was:

1. **Asset swap.** Tina exported the skyline as a high-res JPG and the four decorative elements as transparent PNGs to `~/Downloads/`. Names: `943.jpg`, `image 10.png` (tickets), `image 11.png` (seal), `image 17.png` (bulldog), `image 21.png` (airplane).
2. **Compression.** Skyline reduced via `sips -s format jpeg -s formatOptions 88 -Z 2800`. Transparent PNGs resized via `sips -Z <maxdim>` with PNG format preserved for alpha. End sizes: skyline ~2 MB, tickets ~900 KB, seal ~625 KB, airplane ~715 KB, bulldog ~430 KB.
3. **Component rewrite.** OpeningScreen now uses individual `<img>` tags for each decorative element plus a CSS-rendered title stack inside `.opening__center`. Each element fades in independently driven by a `step` state advanced on a 420 ms cadence.
4. **Constrained layout wrapper.** Tina noted that decorative elements were drifting to the viewport corners on wide screens. Added `.opening__layout` with `max-width: 1440px; margin: 0 auto` so airplane/seal/bulldog/tickets cluster around the title regardless of viewport width.
5. **Title typography iteration.** Series of explicit nudges, recorded so future-you can recreate the chain:
   - MOVE/BOOK font-size scaled 0.85× → 0.8× → 0.82× → 0.85× → 0.82× of `clamp(2.8rem, 7.2vw, 6.2rem)` original. Final: `clamp(2.05rem, 5.2vw, 4.5rem)`.
   - "The" repositioned several times. Final: `top: calc(-1em - 3px); left: 50%; transform: translateX(-50%)` — bottom of "The" sits 3 px above MOVE's top, horizontally centered.
   - "The" typeface switched from Cormorant Garamond italic to Pinyon Script copperplate (`--font-cursive: 'Pinyon Script'`). Looks more like the Figma's flowing script.
6. **Route + subtitle adjustments.**
   - Route font-style changed from italic to normal serif (Cormorant Garamond, weight 500).
   - Subtitle made `font-weight: 500` (Inter Medium), `line-height: 1.2`, `font-size: clamp(1.05rem, 1.27vw, 1.15rem)` (1.1× of original).
   - Vertical spacing nudged multiple times. Final values: route `margin-top: calc(1.8rem - 1px)`, subtitle `margin-top: calc(1rem + 11px)`.
7. **Start button.** Moved from absolute-positioned at the viewport bottom to a flex child of `.opening__center`, sitting `margin-top: 46px` below the subtitle. Vertical padding reduced from `1rem` to `0.7rem` to shrink the button height. The whole title-route-subtitle-Start block now flows together as one centered unit.
8. **Element scaling.**
   - Airplane scaled to 0.8× of original. Desktop `clamp(144px, 15.2%, 256px)`, mobile `clamp(88px, 17.6vw, 136px)`.
   - Bulldog scaled to 1.45× of original. Desktop `clamp(145px, 15.2%, 239px)`, mobile `clamp(116px, 29vw, 189px)`.
   - Seal scaled to 0.92× of original. Desktop `clamp(101px, 10.1%, 161px)`, mobile `clamp(74px, 15.6vw, 120px)`.
   - Tickets unchanged.
9. **Centering audit.** Explicit `text-align: center` added to `.opening__route` and `.opening__subtitle`. `.opening__cta` explicitly given `display: flex; justify-content: center; width: 100%` so the Start button stays centered if its width ever changes.
10. **Navy veil intensified.** Both gradient layers of `.opening__sky-veil` multiplied by 1.15× to darken the overlay over the sunset skyline.

To recreate from a clean checkout of checkpoint-03:

1. Place Tina's individual exports in `~/Downloads/` with the names above.
2. Delete `public/opening/01-skyline.jpg` through `public/opening/09-start.jpg`.
3. Run the sips compression commands from step 2 above and place the results in `public/opening/`.
4. Add Pinyon Script to `index.html`'s Google Fonts link.
5. Add `--font-cursive` to `src/index.css`.
6. Update `src/components/AppShell/AppShell.css` to reference `/opening/skyline.jpg`.
7. Replace `src/components/OpeningScreen/OpeningScreen.jsx` and `.css` with the current versions in this commit.

---

## 3. Records of Resistance

**R1 — Used Tina's individual assets instead of recreating decorative illustrations in code.**
The AI instinct was to offer to recreate the tickets, seal, bulldog, and airplane as SVG. Rejected because the originals have textured gold foil, vintage paper, hand-drawn shading that would take hours to approximate and still look worse than the PNGs. Layered transparent PNGs with CSS positioning is the right tradeoff: ~2.5 MB of image payload total, but each element renders at native resolution and animates independently.

**R2 — Rendered the title in CSS instead of using a baked PNG.**
I offered Tina the option to export the title as a transparent PNG for exact Figma fidelity. She did not request that, so I rendered it in CSS using Cinzel (for MOVE/BOOK) with a four-stop gold gradient text fill, Pinyon Script (for "The"), and Cormorant Garamond (for the route). The gold-gradient text won't perfectly match the Figma's foil texture but is close, scales freely with font-size, and stays sharp at any device pixel ratio. If exact foil match is needed later, Tina can export the title as a PNG and we swap.

**R3 — Held the layout wrapper at `max-width: 1440px`.**
Default approach would be to use viewport-percentage positioning everywhere. That caused elements to flee to the screen corners on wide monitors and lose their relationship to the title. The `.opening__layout` wrapper anchors elements to a Figma-proportional stage that centers in the viewport on wide screens. This matched Tina's reference better and required no further explanation.

**R4 — Pinyon Script chosen over Allura, Great Vibes, Italianno.**
For the "The" script, I picked Pinyon Script because its thin, copperplate stroke matches the Figma's elegant fine-line script. Allura is fuller, Great Vibes has more flourish, Italianno is more brush-like. Pinyon Script renders visually smaller than other scripts at the same px size, so I bumped the font-size to `clamp(1.9rem, 3.4vw, 3rem)` (from `clamp(1.4rem, 2.6vw, 2.3rem)`) when switching. Worth noting if she wants to revisit the choice.

**R5 — Did NOT shrink "The" when MOVE/BOOK was scaled down.**
Tina rescaled MOVE/BOOK multiple times (0.85× → 0.8× → 0.82× → 0.85× → 0.82×) without ever scaling "The" to match. I left "The" alone each time. If she wanted "The" to track MOVE proportionally, she'd have said so. Holding back here meant the title proportions are now her explicit choice, not an inferred one.

**R6 — The "Yale Bulldog Spirit" asset is intentionally faded.**
The asset is white/pale on white when viewed alone, so it reads almost invisibly on light backgrounds. On the dark navy veil over the sunset, at `opacity: 0.5`, it reads as a soft watermark — exactly the way the Figma reference treated it. I removed the earlier `mix-blend-mode: screen` because it washed out too much. Plain opacity gives the right feel. Tina then rescaled it 1.3× → 1.6× → 1.3× → 1.4× → 1.45×, ending at 1.45× — larger than the Figma reference suggested. Defensible as an editorial choice to make the watermark more visible.

---

## 4. Successes

**S1 — One-shot identification of the right architecture.**
Going from "flat frames are blurry" to "layered individual assets + CSS text" was a single decision. The component rewrite landed cleanly without intermediate hybrids. The dev server hot-reloaded throughout the iteration without a full page reload, which kept Tina in flow.

**S2 — Constrained layout wrapper made wide-screen layouts predictable.**
Before the wrapper, elements positioned via `right: 7%` on a 2560 px monitor sat way too far from the title. After the wrapper, positions are relative to a 1440 px stage centered in the viewport. Same CSS values, dramatically better composition on big screens. No special breakpoints needed for ultra-wide.

**S3 — Pinyon Script.**
Cormorant Garamond italic for "The" looked like a slightly-slanted serif, not a script. Pinyon Script reads as actual handwriting and matches the Figma reference's flowing "The" much more closely. Tiny single-font swap, large visual upgrade.

**S4 — Tickets asset includes the flight path baked in.**
The user's `image 10.png` export contains both ATL/NHV ticket cards AND the dashed flight path AND the paper airplane arrow as one transparent PNG. This was a happy accident — fewer elements to position, and the geometric relationship between tickets and arrow is preserved exactly as designed. The asset stays a single positioned layer.

**S5 — Tina's directive iteration style.**
The 30+ micro-adjustments (font-size scale 0.85, then 0.82, then 0.85; bulldog 1.3×, 1.6×, 1.3×, 1.4×, 1.45×; margin-top 24px, 40px, 56px, 42px, 46px) all landed in a single CSS file with tiny edits. This is what Vite HMR is for — keep the file small, keep the changes single-property, never have to wait for a rebuild. Good for portfolio video capture too: every nudge is a single git diff.
