# Checkpoint 11 — Real Map via Leaflet + OpenStreetMap
**Date:** 2026-05-13
**Branch:** main
**Status:** The Storage / Shipping Organizer map is now a real interactive map of New Haven (drag, zoom, real streets) instead of a CSS-art abstract. Pins are placed at approximate real lat/lng for each storage facility.

---

## 1. Context

Earlier attempts at the storage map used a CSS-only abstract — gradients for land/water, SVG roads, absolutely-positioned price pins. Tina added drag-to-pan in checkpoint 10's iteration, then immediately noted: *"the map is too small and not built out fully so it just looks like the user is moving a picture."* Right — there's no real geography to discover by panning a static artwork.

Switched to **Leaflet** with **OpenStreetMap** tiles. Free, no API key required, standard library. New dep: `leaflet ^1.9.4` (~140 KB). Bundle goes from ~170 KB → ~318 KB JS.

The component initializes a Leaflet map in a `useEffect`, centered on `[41.305, -72.93]` (downtown New Haven / Yale area) at zoom 12. A second `useEffect` syncs markers with the `units` array and `focusedUnitId` — markers are rebuilt on every change for correctness simplicity. Each marker uses `L.divIcon` with custom HTML so the existing `.storage-pin` price-badge styling carries over directly. Click on a pin toggles the focused unit; hover on a pin sets it focused — same wiring as before.

Storage unit data extended: every entry in `src/data/storageUnits.js` got a new `coords: [lat, lng]` field. The old `pin: { left, top }` (percentages for the abstract map) was removed since it's no longer used.

Leaflet's built-in zoom controls, scroll-wheel zoom, and pinch-zoom on touch all work out of the box. OSM attribution is required by their license and shows in the corner.

---

## 2. Human Directions

To recreate from checkpoint 10:

1. **`npm install leaflet`** — adds Leaflet 1.x.

2. **`src/data/storageUnits.js`** — replace each unit's `pin: { left, top }` with `coords: [lat, lng]`. Approximate values used:
   - Safeguard Self Storage → `[41.272, -72.967]`
   - StorQuest → `[41.301, -72.910]`
   - Extra Space Storage → `[41.276, -72.961]`
   - Prime Storage → `[41.293, -72.917]`
   - CubeSmart → `[41.288, -72.964]`
   - Public Storage → `[41.317, -72.916]`

3. **Rewrite `src/components/StorageOrganizer/StorageMap.jsx`**:
   - Import `L from 'leaflet'` and `'leaflet/dist/leaflet.css'`.
   - First `useEffect` (empty deps): create `L.map(...)` with `setView([41.305, -72.93], 12)` and a `L.tileLayer` from OSM. Store in `useRef`. Return cleanup that calls `map.remove()`.
   - Second `useEffect` (deps: `units, focusedUnitId, onFocus`): clear existing markers from a `useRef(new Map())`, then for each unit, create a `L.divIcon` whose HTML is `<button class="storage-pin ${isFocused ? 'is-focused' : ''}">$X+</button>`, place it via `L.marker(unit.coords, { icon, riseOnHover: true })`, wire `.on('click', ...)` to toggle focus and `.on('mouseover', ...)` to set focus.
   - Render `<div className="storage-map"><div ref={mapElRef} className="storage-map__leaflet" /></div>`.

4. **`src/components/StorageOrganizer/StorageMap.css`** — keep `.storage-map` container styles (sticky positioning, aspect-ratio, rounded border). Add `.storage-map__leaflet { width: 100%; height: 100% }`. Style overrides for Leaflet's UI: `.leaflet-control-zoom a` themed to `#f9f8f8` bg with `#e0e0e0` border; `.leaflet-control-attribution` themed to the cream/ink palette. Keep the existing `.storage-pin` styles since the custom divIcon uses that class. Add `.storage-pin-wrap { background: transparent; border: none }` to clean Leaflet's default divIcon styling.

5. Old CSS for the abstract map (land/water/roads/parks/labels) can be deleted — replaced wholesale by Leaflet.

---

## 3. Records of Resistance

**R1 — Bundle size doubled. Acceptable trade-off.**
Leaflet adds ~140 KB minified to the JS bundle (170 KB → 318 KB). For a school-project demo this is acceptable; the value to the cousin (a real map of where the facilities are) is much higher than the cost (slightly slower first load). Worth noting in the AI Direction Log: this is the first new dep added since project setup, and it materially changes the load-time profile. If the project ever needs to optimize, code-splitting Leaflet behind a dynamic import (so it loads only when the Storage tab is opened) would cut the cost.

**R2 — Used raw Leaflet, not react-leaflet.**
`react-leaflet` provides nicer React-idiomatic wrappers (declarative `<MapContainer>`, `<Marker>`, etc.). Decided against it — adds a second dependency for a thin wrapper, and the imperative `useEffect`+`useRef` pattern is short enough (~50 lines) that the abstraction isn't worth the import. The component is self-contained; future maintainers can read the Leaflet API directly.

**R3 — Coordinates are approximate, not geocoded.**
The lat/lng values were hand-picked based on each unit's neighborhood from its address (e.g., "400 Derby Avenue, West Haven, CT" → roughly `[41.272, -72.967]`). They are NOT precise geocoded locations. For a real product, these would come from a geocoding service (Nominatim, Mapbox, etc.). For a demo, "close to the right block" is sufficient and avoids a network call at render time. Documented in this checkpoint so the user knows the data is approximated.

**R4 — Markers are rebuilt on every state change.**
The marker-syncing `useEffect` clears the existing `markersRef.current` Map and rebuilds every marker on every render where `units`, `focusedUnitId`, or `onFocus` change. This is wasteful for large datasets but correct and simple for 6 markers. If the unit count grows past ~50, switching to a "diff and update only the changed marker's icon" pattern would matter. Not yet.

---

## 4. Successes

**S1 — Same `storage-pin` CSS class powers both old and new pins.**
The `L.divIcon` accepts arbitrary HTML — passing `<button class="storage-pin">$X+</button>` means the existing pin styling (price badge with arrow, gold focus state, hover scale) all transfer with zero modification. The "look" of the pin didn't change; the layer underneath it did.

**S2 — Card-pin sync still works through Leaflet.**
The existing pattern (parent `StorageOrganizer` owns `focusedUnitId` state; both `StorageMap` and the cards read it) is unchanged. Hover a card → its pin highlights. Click a pin → its card highlights. Leaflet's marker events just feed into the same `onFocus` callback.

**S3 — OSM attribution is the only legal/cost overhead.**
No API key, no rate limit (within reason), no signup, no billing. The attribution line at the bottom-right is a one-line CSS theme tweak away from looking native to the app palette. For a school project this is the right deal.

**S4 — Real interactivity finally feels like a map.**
Drag, scroll-wheel zoom, pinch-zoom, double-click zoom, zoom controls in the corner — all work because Leaflet ships them. Panning around the map reveals actual streets and neighborhoods the cousin would actually encounter when arriving in New Haven, which is the entire point of the Storage tab.
