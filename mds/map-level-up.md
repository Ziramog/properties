# Map Experience — Level Up Plan

## Current State Audit

### What Exists
| Component | Library | Purpose |
|-----------|---------|---------|
| `MapProperties.jsx` | Leaflet + react-leaflet | Main map section on homepage |
| `MapView.jsx` | Leaflet | Map renderer with price markers |
| `PropertyMap.jsx` | Mapbox GL | Individual property detail map |
| `map-section.css` | CSS | Full styling with design tokens |

### Current Features
- ✅ CARTO Voyager tile layer (clean, professional)
- ✅ Custom price-tag markers (orange, with visited/selected states)
- ✅ Popup with image, name, price, WhatsApp link
- ✅ Property type filter pills (Casa, Depto, Terreno, Campo, Comercial)
- ✅ Price range presets (Todos, Hasta 150k, 150k-300k, +300k)
- ✅ "Gran Inversión" toggle
- ✅ Desktop: map + single-property detail sidebar
- ✅ Mobile: full-screen map + bottom sheet
- ✅ Fly-to animation on marker click
- ✅ ScrollReveal entrance animations

### Issues Found
1. **Two map libraries** — Leaflet (homepage) vs Mapbox (detail page). Inconsistent.
2. **`leaflet.markercluster` installed but unused** — dense areas have overlapping markers
3. **No sidebar property list** — desktop only shows ONE selected property, not a browsable list
4. **Price presets not applied** — `activePrice` state is tracked but never used in filtering
5. **No auto-fit bounds** — map doesn't zoom to show all visible markers
6. **No marker count** — user doesn't know how many properties match filters
7. **No "locate me"** — can't find user's current position
8. **No map style toggle** — only one tile layer, no satellite option
9. **No hover sync** — hovering sidebar card doesn't highlight map marker
10. **Mobile bottom sheet not draggable** — only toggle, no swipe gesture

---

## Level Up Plan — 3 Tiers

### 🔴 Tier 1 — Core UX Fixes (High Impact)
These fix broken/missing functionality that users expect.

| # | Improvement | Impact | Effort |
|---|-------------|--------|--------|
| 1 | **Fix price filter** — wire `activePrice` into `filterProperties` | 🔴 Critical | Low |
| 2 | **Sidebar property list** — show all filtered properties as scrollable cards on desktop | 🔴 High | Medium |
| 3 | **Marker clustering** — use installed `leaflet.markercluster` for dense areas | 🔴 High | Medium |
| 4 | **Auto-fit bounds** — zoom map to fit all visible markers on filter change | 🔴 High | Low |
| 5 | **Property count badge** — show filtered count next to filter pills | 🟡 Medium | Low |

### 🟡 Tier 2 — Interaction Polish (Medium Impact)
These make the map feel alive and responsive.

| # | Improvement | Impact | Effort |
|---|-------------|--------|--------|
| 6 | **Hover sync** — hovering sidebar card highlights marker on map (and vice versa) | 🟡 Medium | Medium |
| 7 | **"Locate me" button** — geolocate user and show on map | 🟡 Medium | Low |
| 8 | **Map style toggle** — switch between Voyager (default) and satellite imagery | 🟡 Medium | Low |
| 9 | **Improved mobile bottom sheet** — draggable with snap points (peek/half/full) | 🟡 Medium | High |
| 10 | **Smooth scroll to marker** — on mobile, tapping a sidebar card scrolls map to marker | 🟡 Medium | Low |

### 🟢 Tier 3 — Premium Features (Nice to Have)
These differentiate from competitors.

| # | Improvement | Impact | Effort |
|---|-------------|--------|--------|
| 11 | **Map search bar** — search for a city/area and fly to it | 🟢 Low | Medium |
| 12 | **Fullscreen toggle** — expand map to fill viewport | 🟢 Low | Low |
| 13 | **Directions link** — open Google Maps directions to property | 🟢 Low | Low |
| 14 | **Keyboard navigation** — arrow keys to cycle through markers | 🟢 Low | Medium |

---

## Implementation Order

### Phase 1: Fix & Foundation
1. Fix price filter wiring
2. Auto-fit bounds on filter change
3. Property count badge on filters

### Phase 2: Sidebar List + Clustering
4. Build scrollable sidebar property list (desktop)
5. Enable marker clustering
6. Hover sync between sidebar ↔ map

### Phase 3: Mobile & Polish
7. "Locate me" button
8. Map style toggle (Voyager ↔ Satellite)
9. Draggable mobile bottom sheet
10. Fullscreen toggle + directions link

---

## Technical Notes

### Marker Clustering Setup
```jsx
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
```
Use `L.markerClusterGroup()` with custom icon factory to maintain price-tag style.

### Auto-fit Bounds
```jsx
import { useMap } from 'react-leaflet';
// In a useEffect, compute bounds from geocoded props and call map.fitBounds()
```

### Hover Sync
- Add `hoveredId` state to `MapProperties`
- Pass to `MapView` (highlight marker) and sidebar list (highlight card)
- Use CSS transitions for smooth highlight

### Mobile Bottom Sheet
- Use touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`)
- Three snap points: peek (80px), half (50%), full (90%)
- Animate with CSS `transform: translateY()`
