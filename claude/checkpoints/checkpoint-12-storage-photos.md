# Checkpoint 12 — Real Photos on Storage Cards
**Date:** 2026-05-13
**Branch:** main
**Status:** The six storage-unit cards in the Storage / Shipping Organizer now show real facility photos sourced by Tina, replacing the colored-block placeholder that wrapped a stylized warehouse SVG.

---

## 1. Context

In checkpoint 11 the storage cards had a placeholder header image: a 130px tall block tinted with each unit's `accent` color, with a small white "warehouse" SVG centered on top. The warehouse silhouette was a stand-in until Tina could collect real facility photos. She offered to do so when asked (chose "I'll provide images") and dropped six PNGs in `~/Downloads`, naming each one by which facility it represented:

| Source file                  | Facility               |
| ---------------------------- | ---------------------- |
| `Rectangle 12 (3).png`       | Safeguard Self Storage |
| `Rectangle 13.png`           | StorQuest Self Storage |
| `Rectangle 12 (4).png`       | Extra Space Storage    |
| `Rectangle 22 (1).png`       | Prime Storage          |
| `image 37 (2).png`           | CubeSmart Self Storage |
| `image 39 (2).png`           | Public Storage         |

These were compressed from PNG → JPEG via `sips` (quality 82, max edge 1200px) and dropped into `public/storage/`, named by unit `id` (e.g. `safeguard.jpg`). Resulting `public/storage/` directory weighs ~1.3 MB across six files (the biggest is StorQuest at 345 KB; smallest Prime at 102 KB).

`src/data/storageUnits.js` got a new `image` field on every unit, built with `${import.meta.env.BASE_URL}storage/<id>.jpg` so the path resolves correctly under the GitHub Pages base `/PersonsRequired/` in production and `/` in local dev — without the BASE_URL prefix the asset 404s when deployed.

`StorageOrganizer.jsx` swapped the inline warehouse SVG for an `<img>` tag inside the existing `.storage-card__image` wrapper. The colored accent background was kept intentionally — if a photo ever fails to load (`onError` hides the `<img>`), the card still has a colored header that matches the rest of the design instead of going blank. The image has `alt=""` (decorative; the facility name is already in the card body underneath) and `loading="lazy"` so off-screen cards don't block initial render.

`StorageOrganizer.css` — removed the `.storage-card__image::before` overlay gradient (its purpose was to add depth to the flat color block; with real photos it just muddies them) and the `.storage-card__icon` rule (no longer used). Added `.storage-card__photo { width: 100%; height: 100%; object-fit: cover; display: block }` and `overflow: hidden` on the parent so the image is cropped to the rounded card corners.

---

## 2. Human Directions

To recreate from checkpoint 11:

1. **Drop the source PNGs** in `~/Downloads/` using the filenames in the table above (or any names — just adjust the `cp` mapping).

2. **Convert + place the images**:
   ```bash
   mkdir -p public/storage
   SRC=~/Downloads
   DST=public/storage
   sips -s format jpeg -s formatOptions 82 -Z 1200 "$SRC/Rectangle 12 (3).png" --out "$DST/safeguard.jpg"
   sips -s format jpeg -s formatOptions 82 -Z 1200 "$SRC/Rectangle 13.png"      --out "$DST/storquest.jpg"
   sips -s format jpeg -s formatOptions 82 -Z 1200 "$SRC/Rectangle 12 (4).png" --out "$DST/extraspace.jpg"
   sips -s format jpeg -s formatOptions 82 -Z 1200 "$SRC/Rectangle 22 (1).png" --out "$DST/primestorage.jpg"
   sips -s format jpeg -s formatOptions 82 -Z 1200 "$SRC/image 37 (2).png"     --out "$DST/cubesmart.jpg"
   sips -s format jpeg -s formatOptions 82 -Z 1200 "$SRC/image 39 (2).png"     --out "$DST/public.jpg"
   ```

3. **Add the `image` field** to every entry in `src/data/storageUnits.js`:
   ```js
   image: `${import.meta.env.BASE_URL}storage/safeguard.jpg`,
   ```
   (and similar for `storquest`, `extraspace`, `primestorage`, `cubesmart`, `public`).

4. **Update the JSX** in `src/components/StorageOrganizer/StorageOrganizer.jsx` — replace the inline warehouse `<svg>` inside `.storage-card__image` with:
   ```jsx
   {unit.image && (
     <img
       src={unit.image}
       alt=""
       className="storage-card__photo"
       loading="lazy"
       onError={(e) => { e.currentTarget.style.display = 'none' }}
     />
   )}
   ```

5. **Update the CSS** in `src/components/StorageOrganizer/StorageOrganizer.css`:
   - Add `overflow: hidden` to `.storage-card__image`.
   - Remove `.storage-card__image::before` (the overlay gradient).
   - Remove `.storage-card__icon`.
   - Add `.storage-card__photo { width: 100%; height: 100%; object-fit: cover; display: block }`.

6. **Verify** with `npm run build` — six images should land in `dist/storage/`, and the bundle should still be ~320 KB (no JS change of consequence).

---

## 3. Records of Resistance

**R1 — Used `import.meta.env.BASE_URL`, not bare `/storage/...` paths.**
First instinct was `image: '/storage/safeguard.jpg'`. That works in `npm run dev` (Vite serves from `/`) but breaks on GitHub Pages where the site is hosted at `/PersonsRequired/`. The image resolves to `tinale.github.io/storage/safeguard.jpg` → 404. Using `${import.meta.env.BASE_URL}storage/safeguard.jpg` makes Vite substitute the configured `base` value at build time, producing `/PersonsRequired/storage/safeguard.jpg` in prod and `/storage/safeguard.jpg` in dev. The opening-screen assets (`/opening/skyline.jpg`, etc.) were referenced from CSS, which Vite rewrites automatically; data-driven URLs from JS don't get that treatment, so the explicit BASE_URL prefix is required.

**R2 — Used `<img>` not `background-image`.**
Could have set the image as a CSS `background-image: url(...)` with `background-size: cover`. Decided against: `<img>` gets lazy-loading for free (`loading="lazy"`), supports `onError` to gracefully hide a broken image and reveal the accent fallback, and has semantic value if accessibility tooling ever wants the alt. Background-image is harder to feature-flag per unit and silently shows nothing when the URL is broken.

**R3 — Dropped the overlay gradient.**
The `::before` was `linear-gradient(135deg, rgba(255,255,255,0.18), rgba(0,0,0,0.2))` over the flat-color placeholder — it added subtle depth and made the white SVG warehouse pop. Over actual photos, it just lowers contrast and makes them look washed out. Deleted rather than kept-but-faded; the photos are already varied enough visually that an overlay would homogenize them in the wrong direction.

**R4 — Kept the colored `--accent` background underneath.**
Could have removed the accent color entirely now that real photos cover it. Kept it so that if any image fails to load (or `onError` fires for any reason), the card doesn't become a blank empty header — it falls back to the previous treatment. Costs nothing (the `<img>` sits opaque on top when present); preserves a clean visual default if something breaks in production.

**R5 — Compressed PNG → JPEG at quality 82.**
Source PNGs from Tina's selection averaged ~500 KB–1.5 MB each. At quality 82, JPEGs come down to 100–350 KB while keeping enough fidelity that you can't tell at the 130px card thumbnail size. Total `public/storage/` is ~1.3 MB → adds ~half-a-megabyte to the deployed site, fine for GitHub Pages and a school project demo. If this were a production app I'd ship WebP/AVIF with multiple sizes via a `<picture>` element; for this project the single-JPEG-per-unit approach is enough.

---

## 4. Successes

**S1 — Six real photos, zero layout change.**
Card dimensions, the price chips below, the rating row, the hover/focus states — all unchanged. The image just slots into the same 130px-tall slot the colored block previously occupied. `object-fit: cover` handles all six photos at whatever aspect ratio they arrive in.

**S2 — Graceful fallback if any file is missing or fails.**
`onError` hides the `<img>` and the parent's `--accent` background paints through. No broken-image icon, no awkward "alt text where the picture should be." The card still looks intentional even when something goes wrong.

**S3 — Lazy-loaded; first card alone paints quickly.**
`loading="lazy"` lets the browser defer photos below the fold until the user scrolls. The first one or two cards visible on the Storage panel are fetched eagerly; the rest are not. Combined with the relatively small JPEG sizes, the Storage tab feels snappy even on the first visit.

**S4 — Total bundle barely moved.**
Build output: `dist/assets/index-…js 319.95 kB`. Same ballpark as checkpoint 11 (`319.81` then). The work was 99% asset, 1% code — exactly what you want for a polish pass.

**S5 — Cousin sees real places, not abstract blocks.**
Earlier the cards advertised "Safeguard Self Storage — $25" with a generic warehouse icon. Now she sees what the actual facility looks like (a real building, with signage and gates and gravel). For someone choosing between six options sight-unseen in a city she hasn't lived in, this is a meaningful upgrade — not just polish.
