
###APLY THIS###

This mobile hero is very strong — honestly one of the better mobile real estate heroes I've seen for this market. Let me break it down precisely.This mobile view is actually very close to ideal for this type of site. Here's the precise read:

What's working exceptionally well
The eyebrow "CÓRDOBA, ARGENTINA" with the decorative lines — this was in the spec and it's here, executed correctly. The two thin horizontal lines flanking the text give it editorial weight without taking up space. Keep exactly as is.
The logo placement — centered on mobile with the RR monogram above the full name is the correct hierarchy for a small viewport. On desktop the logo belongs left-aligned; on mobile centering it gives it authority. Good call.
The photo fills 100% of the viewport — no competing panels, no cropping. The winding road and cabin are fully visible. This is the emotional anchor of the whole site and mobile doesn't compromise it at all.
The gradient darkening toward the bottom — the text reads cleanly against the darker lower sky, and the landscape breathes in the middle. The gradient layering is well-calibrated.
Single "BUSCAR AHORA" CTA — perfect mobile decision. Instead of showing the 4-filter search bar (which would either stack awkwardly or be too small to tap), a single prominent CTA opens the full search. This is textually clean and tap-friendly.

Three things to fix
🔴 The search bar button feels too dark and heavy
The "BUSCAR AHORA" pill is currently a very dark brown/charcoal — it's almost the same tone as the bottom gradient of the photo. It disappears. This is the primary CTA on the most important page on mobile — it must contrast sharply.
Fix: change to background: #F26B2E (brand orange), color: #FFFFFF. It will pop against both the dark gradient and the mountains.

🟡 Navbar has no padding/safe-area handling
The logo and nav elements appear to start almost at the very top edge of the screen. On iPhones with a notch or Dynamic Island, this will clip.
Fix: add padding-top: env(safe-area-inset-top, 16px) to the nav container.

🟡 No visible scroll indicator
A visitor landing on this mobile view sees a full-screen photo and a button. There's no signal that there's content below — no chevron, no subtle scroll hint, nothing. On mobile especially, visitors who don't realize there's more content below the fold will bounce.
Fix: add a subtle animated chevron ∨ centered at the very bottom of the viewport, position: absolute, bottom: 80px (above the search bar), rgba(255,255,255,0.6), with a gentle translateY pulse animation — 0px → 8px → 0px on a 2s loop. Small, unobtrusive, but it signals "keep going."

The one creative push worth adding
Since the hero is full-bleed and the photo is this strong — add the slow zoom from the dark HTML file (slowZoom 20s infinite alternate). On mobile it's even more impactful because the photo takes the whole screen. The landscape subtly breathing in and out while the user reads the headline makes the site feel alive in a way no competitor in this market does. It's a transform: scale(1.0) → scale(1.06) CSS animation — two lines of code, massive emotional effect.