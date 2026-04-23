All sections are done then. The next step is the **final assembly** — one `index.html` that stitches every section in order with all CSS files imported. Here's your prompt:

---

## Stage 8 — Full Page Assembly

**Context:** All sections are complete. You have the following CSS files: `design-system.css`, `components.css`, `navbar.css`, `hero.css`, `category-cards.css`, `properties.css` (or equivalent from Stage 5), `stats-bar.css`, `dual-cta.css`, `map-section.css`, `testimonials.css`, `agents.css`, `footer.css`. Full spec in `WOLFIM_landing_design_spec.md`.

**Deliverable:** A single `index.html` — the complete landing page. No new CSS. No inline styles. No `<style>` blocks.

---

**Import order in `<head>`** (strict — do not reorder):
```
design-system.css → components.css → navbar.css → hero.css → category-cards.css → properties.css → stats-bar.css → dual-cta.css → map-section.css → testimonials.css → agents.css → footer.css → floating.css
```

**Section order** (top to bottom, per spec priority):
1. Navbar + mobile overlay (Stage 3 markup)
2. Hero + search bar + trust strip (Stage 4 markup)
3. Category cards — "Explorá por categoría" (Stage 7 markup)
4. Property grid — "Seleccionadas para vos" (Stage 5 markup)
5. Stats bar (Stage 6 markup)
6. Dual CTA — Vender / Invertir (Stage 6 markup)
7. Map section — "Explorá en el mapa" (Stage 7 markup)
8. Testimonials — "Experiencias reales" (Stage 7 markup)
9. Agents — "Nuestros asesores" (Stage 7 markup)
10. Footer (Stage 7 markup)

**Also build `floating.css` and add the floating elements** from Section 12 of the spec (these don't belong to any section file):

- **WhatsApp button:** `position: fixed`, `bottom: 24px`, `right: 24px`, `z-index: 200`. Circle 52px, `background: #25D366`, `border-radius: var(--radius-full)`, `box-shadow: 0 4px 20px rgba(37,211,102,0.40)`. WhatsApp SVG icon 26px white. Hover: `scale(1.08)`, stronger shadow. Tooltip "Hablar con un asesor" appears to the left on hover: `background: var(--color-surface-dark)`, DM Sans 500 13px white, `padding: 6px 12px`, `border-radius: var(--radius-sm)`, opacity 0→1 with 150ms delay.

- **Sticky mobile CTA bar:** `display: none` on desktop; `display: flex` below 768px. `position: fixed`, `bottom: 0`, `width: 100%`, `z-index: 190`, `background: rgba(255,255,255,0.95)`, `backdrop-filter: blur(12px)`, `border-top: 1px solid var(--color-border)`, `padding: 12px 20px`, `padding-bottom: env(safe-area-inset-bottom)`, `gap: 12px`. Two buttons flex:1 height 48px — "Ver propiedades" (`btn-primary`) and "Consultar" (`btn-secondary`).

**Single JavaScript block** at bottom of `<body>` — consolidate all JS from previous stages: navbar scroll handler, hamburger toggle, mobile menu close-on-link-click, scroll-reveal IntersectionObserver (`threshold: 0.15`, adds `.visible` to `[data-reveal]` elements, stagger via `--i` CSS custom property on cards), WhatsApp tooltip hover logic.

**`data-reveal` attributes:** Add to every section header and every card grid — copy the pattern from the spec Section 5. Set `style="--i: 0"` through `--i: N` on individual cards for stagger.

**Google Fonts** `<link>` must be the first `<link>` in `<head>`, before all CSS files:
`https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600&display=swap`

**Meta tags** to include: charset, viewport, `<title>RR Real Estate — Córdoba, Argentina</title>`, `<meta name="description">`.

No placeholder `<style>` blocks, no inline styles, no leftover scroll-spacer divs from demo files.