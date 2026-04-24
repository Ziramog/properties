# Level Up Plan — From Current State to WOLFIM Spec

## Gap Analysis: Section by Section

### ✅ Already Close (Minor Polish)

| Section | Current | Spec Target | Gap |
|---------|---------|-------------|-----|
| **Navbar** | Sticky, transparent/scrolled, mobile hamburger | Logo 36px, hover underline animation, CTA 40px | Hover underline animation on nav links |
| **StatsBar** | Moved to #2, mobile fixed, Cormorant font, orange numbers | Same | ✅ Aligned |
| **Map** | Contrast improved, filters, markers | Sidebar property list, 120px thumbnails | Sidebar needs browsable list (Tier 1 from map plan) |

---

### 🟡 Needs Polish (Medium Effort)

| # | Section | What's Missing | Spec Reference |
|---|---------|---------------|----------------|
| 1 | **CategoryCards** | Hover `translateY(-3px)` is currently `-0.5px`; needs stronger lift | §3, line 486 |
| 2 | **FeaturedProperties** | "Explorar todas" CTA should be **primary orange** not dark; card image needs fixed `210px` height | §4, line 655 |
| 3 | **SellerCTA** | Background should be gradient `white → surface-soft`; left card heading 30px, right card 26px (currently both 30px) | §9, line 993 |
| 4 | **Agents** | Specialty label should be **orange** (currently `ink-tertiary`); contact button should be **primary orange** (currently outlined) | §11, line 1219 |
| 5 | **Footer** | Social icons need circular buttons with hover → brand color; copyright strip needs darker `rgba(0,0,0,0.3)` bg | §10, line 1113 |

---

### 🔴 Missing Features (High Impact)

| # | Feature | Description | Spec Reference |
|---|---------|-------------|----------------|
| 6 | **Hero Trust Strip** | Stats bar at bottom of hero (500+ Propiedades · 10+ Años · ⭐ 4.8) — currently only exists as standalone section | §2, line 391 |
| 7 | **Sticky Mobile CTA Bar** | Fixed bottom bar on mobile: "Ver propiedades" (orange) + "Consultar" (outlined) | §12, line 1264 |
| 8 | **WhatsApp Tooltip** | Hover tooltip "Hablar con un asesor" on WhatsApp floating button | §12, line 1252 |
| 9 | **Map Sidebar Property List** | Replace single-property detail with scrollable list of all filtered properties | §5, line 766 |
| 10 | **Marker Clustering** | Use installed `leaflet.markercluster` for dense areas | map-level-up.md |

---

## Implementation Phases

### Phase 1: Quick Wins (1-2 hours)
Polish existing components to match spec.

1. **CategoryCards** — Increase hover lift to `-3px`
2. **FeaturedProperties** — Orange CTA button, fixed image height
3. **SellerCTA** — Gradient background, heading size hierarchy
4. **Agents** — Orange specialty, orange contact button
5. **Footer** — Circular social icons with brand hover, copyright strip bg

### Phase 2: New Features (2-3 hours)
Add missing spec elements.

6. **Hero Trust Strip** — Add stats row at hero bottom
7. **Sticky Mobile CTA Bar** — Fixed bottom bar component
8. **WhatsApp Tooltip** — Hover label on floating button

### Phase 3: Map Level Up (3-4 hours)
The big map improvements from the existing plan.

9. **Map Sidebar Property List** — Scrollable cards replacing single detail
10. **Marker Clustering** — Enable leaflet.markercluster
11. **Auto-fit Bounds** — Zoom to show all markers on filter change
12. **Hover Sync** — Sidebar ↔ map marker highlighting

---

## Files to Modify

| Phase | File | Changes |
|-------|------|---------|
| 1 | `components/sections/CategoryCards.jsx` | Hover translateY |
| 1 | `components/FeaturedProperties.jsx` | Orange CTA, image height |
| 1 | `components/FeaturedPropertyCard.jsx` | Fixed 210px image |
| 1 | `components/sections/SellerCTA.jsx` | Gradient bg, heading sizes |
| 1 | `components/sections/Agents.jsx` | Orange specialty, orange button |
| 1 | `components/Footer.jsx` | Social icons, copyright strip |
| 1 | `footer.css` | Social icon styles |
| 2 | `components/Hero.jsx` | Trust strip at bottom |
| 2 | `components/StickyMobileCTA.jsx` | New component |
| 2 | `app/layout.jsx` | Import StickyMobileCTA |
| 2 | `components/WhatsAppButton.jsx` | Tooltip on hover |
| 3 | `components/MapProperties.jsx` | Sidebar list, bounds |
| 3 | `components/MapView.jsx` | Clustering, hover sync |
| 3 | `assets/styles/globals.css` | Cluster styles |

---

## DO NOT Change (per spec §7)
- Hero photography
- Orange as primary color
- Interactive map section (enhance, don't remove)
- Dual CTA concept (Vender / Invertir)
- Orange star ratings
