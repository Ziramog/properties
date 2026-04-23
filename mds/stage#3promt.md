Attached: WOLFIM_landing_design_spec.md, design-system.css, components.css
Your task is Stage 3 only: build the Navbar from Section 3 of the spec ("SECTION 1 — Navigation Bar").
Deliver two files:

navbar.css — all navbar styles, no inline styles
navbar-demo.html — imports all three CSS files and renders a full interactive demo

Build exactly this:

Fixed navbar, z-index: 100, height 72px desktop / 60px mobile
Transparent state (default, over hero photo): transparent background, white logo filter, white nav links at rgba(255,255,255,0.85)
Scrolled state (triggered by JavaScript after 80px scroll): white background with backdrop-filter: blur(16px), border-bottom, var(--shadow-nav), logo returns to normal, links turn var(--color-ink-secondary)
Nav links: DM Sans 500, 13px, letter-spacing: 0.08em, uppercase. On hover: var(--color-brand) color + a 2px bottom border in var(--color-brand) that animates width 0% → 100%
CTA button: use .btn-primary from components.css but override height to 40px, padding to 0 22px, font-size to 13px
Mobile (< 768px): hamburger icon (3 lines, 2px stroke, 24px), clicking it opens a full-screen overlay — background: var(--color-surface-dark), nav links stacked vertically centered, font-family: var(--font-display), font-size: 32px, font-weight: 600, gap: 32px. CTA button full-width at bottom of overlay. Overlay closes on link click or second hamburger tap.

Demo requirements:

The demo page must have a tall placeholder hero section (height: 100vh, dark photo-like background) so the scroll trigger can actually be tested
Place a <div style="height: 200vh"> below the hero so there is enough scroll room
The transparent → scrolled transition must work by actually scrolling the page
Show the mobile hamburger menu working at narrow viewport — test by resizing the browser

Rules:

All colors, spacing, radius, transition values must come from design-system.css tokens — no hardcoded values that have a token equivalent
The scroll listener must use window.addEventListener('scroll', ...) and toggle a .scrolled class on the <nav> element
Hamburger open state uses a .menu-open class on the <nav> — no JavaScript directly manipulating styles
#B34412 (button active color) and rgba() focus shadows are acceptable as the only hardcoded values since they have no token