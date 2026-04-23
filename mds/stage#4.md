

Stage 4 — Hero Section + Search Bar
Context: Continuing the RR Real Estate landing page. Design system tokens live in design-system.css, global button/badge/input components in components.css, and the navbar styles are in navbar.css. The full spec is in WOLFIM_landing_design_spec.md. All rules from the standing brief apply.
Deliverables for this stage:

hero.css — all styles for this section only
hero-demo.html — standalone demo that imports design-system.css, components.css, navbar.css, and hero.css; no inline styles


Build Section 2 — Hero exactly as specified:
Hero container: 100vh, min-height: 700px, position: relative, overflow: hidden.
Background image: Use https://placehold.co/1920x1080/1C1C1A/1C1C1A as a stand-in. object-fit: cover, object-position: center 40%. Overlay: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.55) 100%).
Content block (position: absolute, left: 50%, top: 42%, transform: translate(-50%, -50%), width: 100%, text-align: center, padding: 0 24px):

Eyebrow — "CÓRDOBA, ARGENTINA": var(--t-label), rgba(255,255,255,0.70), margin-bottom: var(--space-4). Display as flex row centered with a 28px horizontal 1px rgba(255,255,255,0.4) line on each side.
Line 1 — "Tu próximo hogar": Cormorant Garamond 400 italic, 76px desktop / 52px tablet / 40px mobile, line-height: 1.0, #FFFFFF, margin-bottom: 6px.
Line 2 — "te está esperando": Cormorant Garamond 700 upright, same sizes, same line-height, #FFFFFF, margin-bottom: var(--space-10).

Apply the entrance animations from Section 5 of the spec (fadeUp stagger on eyebrow → line 1 → line 2).
Search bar (position: absolute, bottom: var(--space-12), centered, width: min(880px, calc(100% - 48px))):

background: rgba(255,255,255,0.10), backdrop-filter: blur(20px), border: 1px solid rgba(255,255,255,0.20), border-radius: var(--radius-xl), padding: 8px 8px 8px 0, display: flex, align-items: center.
Filter group (flex: 1): 4-column CSS grid. Each filter cell: height: 52px, padding: 0 var(--space-5), separated by 1px solid rgba(255,255,255,0.15) on the right (last one omitted). Each cell has a top eyebrow label (10px, 500, letter-spacing 0.1em, ALL CAPS, rgba(255,255,255,0.55)) and a value line (14px, 500, #FFFFFF). Hover: background: rgba(255,255,255,0.08), border-radius: var(--radius-md). Filters: "Operación / Venta", "Tipo / Todos", "Zona / Córdoba", "Precio / Cualquiera".
CTA button (right side): primary orange, height: 52px, padding: 0 var(--space-8), border-radius: 18px, flex-shrink: 0. Label: "BUSCAR".

Trust strip (position: absolute, bottom: 0, width: 100%, height: 48px, background: rgba(0,0,0,0.35), backdrop-filter: blur(8px), flex row centered, gap: var(--space-12)):

Three stats: "500+ Propiedades" · "10+ Años de experiencia" · "⭐ 4.8 Calificación"
Separated by 1px vertical lines 24px tall at rgba(255,255,255,0.2).
Number: DM Sans 600 16px #FFFFFF. Label: DM Sans 400 13px rgba(255,255,255,0.65).

Mobile (< 768px):

height: 100svh; search bar becomes stacked — 2×2 grid of filters + full-width BUSCAR button below; background: rgba(0,0,0,0.60), border-radius: var(--radius-lg), no backdrop-filter.
Trust strip: show only 2 stats (Propiedades + Calificación).

Demo HTML: Include the navbar from Stage 3 (copy the <nav> markup + its JS) above the hero so scroll behavior can be tested together. Add a tall spacer section below so the transparent → scrolled navbar transition is testable.
Wait for approval before proceeding to Stage 5.