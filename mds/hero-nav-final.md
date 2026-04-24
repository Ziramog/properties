 need to update the mobile navbar behavior on the Next.js site. Apply all of the following:
1. Scroll state detection
Add a scroll listener that tracks three states on the <nav> element via CSS classes:

nav--hero → user is within the first 80px of scroll (default, over hero)
nav--scrolled-down → user scrolled DOWN past 80px
nav--scrolled-up → user scrolled UP while past 80px

jsuseEffect(() => {
  let lastY = window.scrollY;
  const handler = () => {
    const currentY = window.scrollY;
    if (currentY < 80) {
      setNavState('hero');
    } else if (currentY > lastY) {
      setNavState('down');
    } else {
      setNavState('up');
    }
    lastY = currentY;
  };
  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}, []);
2. Mobile-only styles (max-width: 767px)
nav--hero state (over hero):
cssposition: fixed;
top: 0;
width: 100%;
background: transparent;
transform: translateY(0);
transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
padding-top: env(safe-area-inset-top, 16px);
nav--down state (scrolling down, hide it):
csstransform: translateY(-110%);
nav--up state (scrolling up, show collapsed bar):
csstransform: translateY(0);
height: 52px;
background: rgba(255, 255, 255, 0.96);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border-bottom: 1px solid rgba(0,0,0,0.06);
box-shadow: 0 1px 12px rgba(0,0,0,0.08);
3. Logo collapse on mobile
When navState === 'up' on mobile:

Hide the full text ("SILVIA ROGGERO & ROMA" + "NEGOCIOS INMOBILIARIOS") — display: none or opacity: 0
Show ONLY the RR monogram image at height: 28px
Add a small orange pill button on the right: "Contactar", background: #F26B2E, color: #FFF, height: 32px, padding: 0 16px, border-radius: 9999px, font-size: 12px, font-weight: 600 — links to WhatsApp

When navState === 'hero' on mobile:

Show full logo treatment as it is now (centered monogram + full name)

4. Desktop — no changes
Wrap every single mobile style and behavior in @media (max-width: 767px). The desktop navbar must not be touched.
5. Transition
All nav state changes animate with transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), background 300ms ease, box-shadow 300ms ease. No janky jumps.
Do not change any section below the navbar. Do not change desktop layout. Do not change the hero content or the BUSCAR AHORA button.
