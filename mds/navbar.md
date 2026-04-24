Looking at this closely, the hero photo and headline are excellent — but the navbar has **three specific problems** worth fixing:

---

**🔴 The navbar container shape is fighting the hero**

The nav is sitting inside a dark rounded-pill/capsule shape that spans almost the full width. This creates a heavy visual frame at the top that cuts into the sky and mountain gradient — the most dramatic part of the photo. It looks like a UI element dropped on top of a painting rather than a navigation that belongs to the page.

**Fix:** Remove the container background entirely in the transparent state. The nav items should float directly over the photo with no background shape. Use only a subtle `text-shadow: 0 1px 8px rgba(0,0,0,0.4)` on the text to keep it readable against the sky. The glassmorphism blur should only appear after scroll (scrolled state), not on load.

---

**🟡 Nav link font weight is too heavy**

The links PROPIEDADES and CONTACTO appear to be `font-weight: 700` or even `800`. At that weight and uppercase treatment they compete with the headline for attention. Nav links should recede, not shout.

**Fix:** Drop to `font-weight: 500`, `font-size: 13px`, `letter-spacing: 0.08em`. The active link INICIO can stay orange but at the same weight — color alone provides enough differentiation.

---

**🟡 "INGRESAR" still needs to change**

Covered in the diagnostic but worth repeating here visually — the orange pill button labeled "INGRESAR" reads as a login CTA for a members area that doesn't exist. In the context of this beautiful landscape hero it creates cognitive dissonance: *log in to what?*

**Fix:** Change to **"CONTACTAR"** and wire it to the WhatsApp link. Same visual treatment, completely different intent signal.

---

**What's working well in the nav:**
- Logo legibility is good at that size
- Phone number visible in the nav is smart for this market — Argentine buyers call first
- The pill shape of the INGRESAR button is consistent with the search bar's BUSCAR button
- Logo placement left, links center, phone + CTA right is the correct hierarchy

Here's what the transparent state should look like conceptually:

```
No background container
Logo: normal colors (or white version)
Links: white, 500 weight, 13px, 0.08em tracking
Phone: rgba(255,255,255,0.75)
CTA button: orange pill — same as now, just relabeled
```

The hero photo is strong enough to carry the nav without any background treatment. Trust the photo.