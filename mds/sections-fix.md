> The map section is still overlapping into testimonials on mobile. The property detail drawer is escaping the map container. Fix this properly across the full component tree.
>
> **Step 1 — Open `MapProperties.jsx`**
>
> Find the outermost returned `<div>` or `<section>` and add these classes:
> ```jsx
> className="relative overflow-hidden isolate z-[1]"
> ```
> Also find the inner map container div (the one that wraps the Leaflet map) and ensure it has:
> ```jsx
> className="relative overflow-hidden"
> style={{ contain: 'layout paint' }}
> ```
>
> Find the property detail drawer panel — the white sliding card at the bottom that shows "Seleccioná una propiedad". It must have:
> ```jsx
> position: 'absolute'  // NOT fixed
> bottom: 0
> left: 0
> right: 0
> zIndex: 10
> ```
> If it's `position: fixed` anywhere — change it to `position: absolute`. If it's conditionally rendered outside the map wrapper, move it inside.
>
> **Step 2 — Open `Testimonials.jsx`**
>
> Find the outermost `<section>` or `<div>` and ensure it has:
> ```jsx
> className="relative isolate z-[2] bg-white"
> // or bg-[#F7F6F2] if the section uses the soft surface color
> ```
> The background MUST be a solid opaque color — not transparent. This is what physically blocks the map from showing through.
>
> **Step 3 — Open `page.jsx` or wherever the homepage sections are assembled**
>
> Between `<MapProperties />` and `<Testimonials />` add this explicit separator:
> ```jsx
> <div className="block w-full h-0 clear-both" style={{ isolation: 'isolate' }} />
> ```
>
> Also wrap `<MapProperties />` in a div:
> ```jsx
> <div className="relative overflow-hidden" style={{ contain: 'layout paint style', isolation: 'isolate' }}>
>   <MapProperties />
> </div>
> ```
>
> **Step 4 — Open `Navbar.jsx`**
>
> The navbar is `position: fixed` with a high z-index. Make sure it is NOT bleeding into the page flow. Confirm:
> ```jsx
> zIndex: 100  // navbar
> // MapProperties: z-[1]
> // Testimonials: z-[2]
> // Nothing in the map should exceed z-index 50
> ```
>
> **Step 5 — Check for any Leaflet popup or tooltip using `position: fixed`**
>
> Search the codebase for `position.*fixed` inside `MapProperties.jsx` or any map-related component. Change every instance to `position: absolute`. Leaflet popups default to absolute — if a custom drawer was built with fixed, that is the bleed source.
>
> **Do not change any visual styles, colors, fonts, or desktop layout. These are structural containment fixes only.**