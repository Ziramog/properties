# Plan: Match Roggero & Roma to SenadaAdzem.com

Reference: https://www.senadaadzem.com/
Current: https://properties-srs5.vercel.app/

---

## A. Overall Architectural Patterns to Adopt

| Ref Pattern | Current State | Action |
|---|---|---|
| `rounded-container` white cards on gray bg | Section backgrounds vary | Standardize all sections to white rounded-box cards (rounded-xl/2xl) with shadow on `bg-[#F6F6F6]` |
| Every page footer has Partners + CTAs | Homepage only has clients | Make Clients + DualCTA reusable across all pages |
| `container-xs` max-width wrapper | Varies | Enforce consistent max-width (~1200px) for all content sections |

---

## B. Homepage Sections (Side-by-Side)

| Ref Section | Your Section | Gap |
|---|---|---|
| **Hero slider** (video + images) | **Hero** (single video) | Add image slides (at least 2-3 premium property photos) alongside video |
| **Search form** with autocomplete + expandable "Show More" | **Search bar** (4 fields always visible) | Collapse advanced filters behind "Buscar mas" toggle, add popular cities suggestions |
| **"Meet the Team"** (image + text + animated counters) | **StatsBar** (counters only) | Add team image + intro paragraph + dual CTA buttons + 4 stats counters in one section |
| **Featured Listings** (12-card grid) | **FeaturedPropertiesCarousel** (6 cards) | Show more (12+) properties in grid, add "SEE ALL" CTA link |
| **Featured Exclusive Areas** (swiper carousel) | **NOT PRESENT** | Add area/location carousel with images for Alta Gracia, Cordoba zones |
| **Signature Neighborhoods + Developments CTAs** | **SellerCTA** (2 panels) | Refine into 2-column CTA grid like reference |
| **Partners/Media logos** (auto-swiper) | **Clients** (static) | Add auto-scrolling carousel behavior |

---

## C. Navbar

| Ref Feature | Current State | Action |
|---|---|---|
| Call button with phone icon | Present but styled differently | Match icon-based side menu pattern |
| Search icon linking to /properties | "Propiedades" text link | Add icon-based search shortcut |
| "Show More" dropdown | Not present | Add dropdown for auxiliary links |
| Transparent → solid on scroll | Already implemented | Fine-tune glass effect timing/opacity |
| Mobile: right-side overlay slide animation | Already implemented | Fine-tune cubic-bezier timing (should be 0.9s) |

---

## D. Footer

| Ref Feature | Current State | Action |
|---|---|---|
| 2-column layout (contact left, nav right) | 4-column grid | Restructure to left/right split |
| Newsletter signup form | Not present | Add Mailchimp-style email subscription |
| Social icons row (FB, IG, LI, YT) | Already present | Match icon styling |
| Copyright + "Powered by" line | Present | Keep, refine layout |

---

## E. Pages to Create/Refine

| Page | Status | Action |
|---|---|---|
| `/story` (Nuestra Historia) | Does not exist | Create biography page with hero image + rich text sections + Partners carousel |
| `/team` (El Equipo) | Does not exist | Create team listing page with photo cards + roles + descriptions |
| `/contact` | Exists, basic | Refine to match "Engage" page: hero image, intro text, contact methods, CTA areas |
| `/properties` (listing) | Exists | Add "Explore Areas" carousel + CTA sections + Partners at bottom |
| `/properties/[id]` (detail) | ✅ DONE | Refactored with composed gallery subheader, full gallery, ReadMore, Community Info |

---

## F. Property Card Refinement

| Ref | Current | Action |
|---|---|---|
| Image fills card 100% width | Likely already | Verify |
| Status tag (NEW TO MARKET, PENDING) top-left | May use badge | Match uppercase styling, font-size, padding |
| Features (beds/baths/sqft) overlaid on image bottom | Check current | Ensure semi-transparent dark overlay with white text/icons |
| Price inline with features | Check current | Match placement inline with features |
| Title + location in card footer | Check current | Ensure h3 heading + p location pattern |
| Schema.org markup on cards | Check current | Add schema markup (RealEstateListing, Offer, PostalAddress) |

---

## G. Technical Polish

| Item | Action |
|---|---|
| Favicons | Add full set (apple-touch-icon, 32x32, 192x192, safari-pinned-tab, site.webmanifest) |
| OG meta tags | Ensure title, description, og:image on all pages |
| JSON-LD schema | Add LocalBusiness schema to layout.tsx |
| Font preload | Add `<link rel="preload">` for Lato/PT Serif woff2 files |
| Scroll animations | Verify `.js-animate` triggers on all visible sections |
| Page loader | Consider adding initial loader animation |

---

## Implementation Order (Recommended)

1. ~~Navbar refinement~~ (call/search icons, Show More dropdown)
2. ~~Footer restructuring~~ (2-column, newsletter form)
3. ~~rounded-container pattern~~ (standardize section wrappers)
4. ~~Property card design match~~ (features overlay, tags, schema.org)
5. ~~Homepage: Hero slider + expandable search~~
6. ~~Homepage: Meet the Team section~~ (replacing current StatsBar + Agents combo)
7. ~~Homepage: Featured Areas carousel~~ (new component)
8. `/story` page (new)
9. `/team` page (new)
10. `/contact` page refinement
11. All pages: Partners carousel at bottom
12. Technical polish (favicons, SEO, schema, font preload)

---

## ✅ Completed

- **Property Detail Page** (`/properties/[id]`) — Full Senada-style refactor:
  - Composed gallery subheader: big image + 2x3 thumb grid side-by-side on desktop, horizontal scroll on mobile
  - Status/operation display in dark info bar right side
  - "See all X photos" button scrolls to full gallery
  - Features restructured to 8-box grid (Price, Area Total, Dorms, Baths, Garage, Type, Operation, Titles)
  - "Read more" / "Read less" toggle for long descriptions (400 char threshold)
  - Share buttons inline inside description card
  - Community Info card (Provincia, Ciudad, Direccion)
  - Full photo gallery at bottom with all images
  - Contact form restyled as white rounded card
  - WhatsApp + Bookmark + Share CTAs properly positioned
