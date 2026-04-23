# Web Design Specification — Real Estate Landing Page
**Project:** RR Real Estate — Córdoba, Argentina  
**Prepared for:** Minimax 2.7 implementation  
**Scope:** Full-page redesign spec with section-by-section measurements, hierarchy corrections, and brand-consistent direction  
**Brand anchor:** Orange `#F26B2E` is the primary action color — every CTA, highlight, and interactive accent must use it.

---

## 1. Design System

### 1.1 Color Tokens

```
/* Brand */
--color-brand:          #F26B2E   /* Primary orange — CTAs, active states, accents */
--color-brand-dark:     #C94E16   /* Hover/pressed state for orange buttons */
--color-brand-light:    #FEE8DC   /* Tinted backgrounds, pill highlights */
--color-brand-muted:    #F9DDD0   /* Very soft orange wash for section backgrounds */

/* Neutrals */
--color-ink:            #1A1A18   /* Headings, primary text */
--color-ink-secondary:  #4B4B48   /* Body text, descriptions */
--color-ink-tertiary:   #8C8C88   /* Labels, captions, placeholders */
--color-border:         #E8E6E0   /* Card borders, dividers */
--color-border-strong:  #CCCAC3   /* Focused inputs, hover borders */

/* Surfaces */
--color-surface:        #FFFFFF   /* Cards, modals */
--color-surface-soft:   #F7F6F2   /* Section alternating background */
--color-surface-dark:   #1C1C1A   /* Footer, dark CTA cards */
--color-surface-darker: #141412   /* Footer strip, deepest dark */

/* Functional */
--color-success:        #16A34A   /* "Disponible" badge */
--color-success-bg:     #DCFCE7
--color-warn:           #D97706   /* "Arrendado" badge */
--color-warn-bg:        #FEF3C7
--color-info-bg:        #EFF6FF
```

### 1.2 Typography

Use **two typefaces only**:

```
/* Display — for hero headline and large section titles */
font-family: 'Cormorant Garamond', Georgia, serif;
/* Available weights: 400 (italic), 600, 700 */

/* UI — for everything else: nav, body, labels, buttons, cards */
font-family: 'DM Sans', system-ui, sans-serif;
/* Available weights: 400, 500, 600 */
```

> Load via Google Fonts:  
> `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600&display=swap`

#### Type Scale

| Token              | Family            | Size     | Weight | Line-height | Letter-spacing | Use                              |
|--------------------|-------------------|----------|--------|-------------|----------------|----------------------------------|
| `--t-hero`         | Cormorant Garamond | 72px    | 700    | 1.05        | -0.02em        | Hero headline                    |
| `--t-hero-italic`  | Cormorant Garamond | 72px    | 400    | 1.05        | -0.01em        | Hero headline italic line        |
| `--t-h1`           | Cormorant Garamond | 52px    | 700    | 1.1         | -0.01em        | Section headlines (map, etc.)    |
| `--t-h2`           | DM Sans            | 32px    | 600    | 1.2         | -0.01em        | Section titles                   |
| `--t-h3`           | DM Sans            | 22px    | 600    | 1.3         | 0              | Card titles, subsection headings |
| `--t-h4`           | DM Sans            | 16px    | 600    | 1.4         | 0              | Card subtitles, labels           |
| `--t-body-lg`      | DM Sans            | 17px    | 400    | 1.7         | 0              | Section descriptions             |
| `--t-body`         | DM Sans            | 15px    | 400    | 1.6         | 0              | Body, card text, testimonials    |
| `--t-small`        | DM Sans            | 13px    | 400    | 1.5         | 0.01em         | Captions, meta, tags             |
| `--t-label`        | DM Sans            | 11px    | 600    | 1           | 0.1em          | ALL-CAPS labels, eyebrows        |
| `--t-button`       | DM Sans            | 14px    | 600    | 1           | 0.04em         | Buttons                          |
| `--t-nav`          | DM Sans            | 13px    | 500    | 1           | 0.08em         | Navigation links                 |

Tablet breakpoint: reduce hero `72px → 52px`, h1 `52px → 40px`, h2 `32px → 26px`.  
Mobile breakpoint: hero `52px → 38px`, h1 `40px → 30px`, h2 `26px → 22px`.

### 1.3 Spacing Scale

All spacing derives from an `8px` base.

```
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
--space-32: 128px
```

**Section vertical padding:** `--space-20` (80px) top and bottom on desktop; `--space-12` (48px) on mobile.  
**Content container:** `max-width: 1280px; margin: 0 auto; padding: 0 48px;`  
On tablet: `padding: 0 32px`. On mobile: `padding: 0 20px`.

### 1.4 Elevation (Box Shadows)

```
--shadow-card:   0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
--shadow-card-hover: 0 8px 32px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06);
--shadow-modal:  0 24px 80px rgba(0,0,0,0.18);
--shadow-nav:    0 1px 0 rgba(0,0,0,0.08);
```

### 1.5 Border Radius

```
--radius-sm:   6px    /* Tags, badges, small inputs */
--radius-md:  10px    /* Category cards, filter pills */
--radius-lg:  16px    /* Property cards */
--radius-xl:  24px    /* CTA cards, search bar */
--radius-full: 9999px /* Pills, avatar circles, circle buttons */
```

### 1.6 Transitions

```
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--transition-fast:   150ms var(--ease-out);
--transition-base:   250ms var(--ease-out);
--transition-slow:   400ms var(--ease-out);
```

Apply `transition: all var(--transition-base)` to cards on hover.  
Apply `transition: background var(--transition-fast), transform var(--transition-fast)` to buttons.

---

## 2. Global Components

### 2.1 Primary Button (Orange)

```
Background:      var(--color-brand)           → #F26B2E
Hover:           var(--color-brand-dark)       → #C94E16
Active:          #B34412
Text:            #FFFFFF
Font:            DM Sans 600, 14px, letter-spacing 0.04em, ALL CAPS
Height:          48px (desktop), 44px (mobile)
Padding:         0 28px
Border-radius:   var(--radius-full)            → 9999px
Transform hover: translateY(-1px)
Transform active: translateY(0)
Box-shadow hover: 0 6px 20px rgba(242,107,46,0.35)
```

### 2.2 Secondary Button (Dark Outlined)

```
Background:      transparent
Border:          1.5px solid var(--color-ink)
Text:            var(--color-ink)
Hover bg:        var(--color-ink)
Hover text:      #FFFFFF
Same dimensions as primary.
```

### 2.3 Ghost Button (White, for use on dark or photo backgrounds)

```
Background:      rgba(255,255,255,0.12)
Border:          1.5px solid rgba(255,255,255,0.5)
Backdrop-filter: blur(8px)
Text:            #FFFFFF
Hover bg:        rgba(255,255,255,0.22)
Same height/radius as primary.
```

### 2.4 Badge

```
Font:            DM Sans 600, 11px, letter-spacing 0.08em, ALL CAPS
Padding:         4px 10px
Border-radius:   var(--radius-sm)   → 6px
Height:          22px

Variants:
  price:       bg #1A1A18, text #FFFFFF
  available:   bg var(--color-success-bg), text var(--color-success)
  rented:      bg var(--color-warn-bg),    text var(--color-warn)
  featured:    bg var(--color-brand),      text #FFFFFF
  consult:     bg #FFFFFF, text var(--color-brand), border 1.5px solid var(--color-brand)
```

> **Important:** Remove the current solid green "Consultar" badge from cards where price is unknown. Replace with the outlined orange `consult` variant above — this makes price-on-request feel premium rather than evasive.

### 2.5 Input / Dropdown

```
Height:          48px
Padding:         0 16px
Border:          1.5px solid var(--color-border)
Border-radius:   var(--radius-md)   → 10px
Background:      #FFFFFF
Font:            DM Sans 400, 14px, color var(--color-ink)
Placeholder:     var(--color-ink-tertiary)
Focus border:    var(--color-brand)
Focus shadow:    0 0 0 3px rgba(242,107,46,0.15)
```

### 2.6 Icon Style

All icons must come from a **single icon library** — use **Lucide Icons** (outline style, 1.5px stroke weight).  
Icon sizes: `16px` for inline/labels, `20px` for card meta, `24px` for navigation/buttons, `28px` for category cards.  
Color: always `currentColor` so they inherit from parent text color.

---

## 3. Section-by-Section Specification

---

### SECTION 1 — Navigation Bar

#### Current Issues
- Logo is very small and hard to read
- Nav links are ALL CAPS but too wide spacing between them; the three links feel disconnected from the logo
- CTA button label appears to say "DOMINAR" — this is likely a custom brand term but must be legible and purposeful; if it's the brand tagline, fine, otherwise change to "CONTACTAR"
- No sticky/scroll behavior defined — the navbar disappears into the hero
- No visual separation between transparent and scrolled states

#### Specifications

**Container:**
```
Position:        fixed, top: 0, left: 0, width: 100%, z-index: 100
Height:          72px (desktop), 60px (mobile)
Padding:         0 48px (desktop), 0 20px (mobile)
Display:         flex, align-items center, justify-content space-between
```

**Transparent state (over hero photo):**
```
Background:      transparent
Transition:      background 300ms ease, backdrop-filter 300ms ease
```

**Scrolled state (after 80px scroll):**
```
Background:      rgba(255,255,255,0.94)
Backdrop-filter: blur(16px)
Border-bottom:   1px solid var(--color-border)
Box-shadow:      var(--shadow-nav)
```

**Logo:**
```
Height:          36px auto
Filter (transparent state): brightness(0) invert(1)   /* white logo */
Filter (scrolled state):    none                       /* original logo */
```

**Nav Links:**
```
Font:            var(--t-nav) — DM Sans 500, 13px, letter-spacing 0.08em
Text-transform:  uppercase
Color (transparent): rgba(255,255,255,0.85)
Color (scrolled): var(--color-ink-secondary)
Hover color:     var(--color-ink) or #FFFFFF (transparent)
Gap between links: 40px
Hover indicator: 2px bottom border in var(--color-brand), animate width 0→100% on hover
```

**CTA Button:**
```
Use primary orange button specs (Section 2.1)
Height: 40px (slightly smaller than page CTAs to not dominate the nav)
Padding: 0 22px
Font-size: 13px
```

**Mobile (< 768px):**
```
Hamburger icon: 24×24px, 3 lines, 2px stroke, color #FFFFFF (transparent) / var(--color-ink) (scrolled)
Mobile menu: full-screen overlay, background var(--color-surface-dark), links stacked vertically centered,
             font Cormorant Garamond 600 32px, gap 32px between links
             CTA button at bottom, full-width
```

---

### SECTION 2 — Hero

#### Current Issues
- The headline "Tu próximo hogar" is in italic serif (good) but "te está esperando" switches to a bold upright — the size and weight feel almost equal between the two lines, flattening the hierarchy
- "CÓRDOBA, ARGENTINA" subtext is too close to the main headline and reads at almost the same weight
- The search bar background is too dark/opaque against the landscape — it blocks the bottom portion of the photo which is the most dramatic part (the cabin and winding road)
- The four filters in the search bar have no clear visual separation between them — they blur together
- No trust signal is visible anywhere in or below the hero

#### Specifications

**Hero Container:**
```
Height:          100vh, min-height: 700px
Position:        relative
Overflow:        hidden
```

**Background Photo:**
```
Width/height:    100% (object-fit: cover, object-position: center 40%)
After overlay:   linear-gradient(
                   to bottom,
                   rgba(0,0,0,0.25) 0%,
                   rgba(0,0,0,0.10) 40%,
                   rgba(0,0,0,0.55) 100%
                 )
```

> The gradient is lighter in the middle to let the mountains and cabin breathe, then darkens at the bottom to make the search bar readable without a heavy opaque block.

**Content Block (centered, positioned at 42% vertical):**
```
Position:        absolute, left 50%, top 42%, transform translate(-50%, -50%)
Width:           100%
Text-align:      center
Padding:         0 24px
```

**Eyebrow label ("CÓRDOBA, ARGENTINA"):**
```
Move ABOVE the headline (currently it's below — this is backwards for visual flow)
Font:            var(--t-label) — DM Sans 600, 11px, letter-spacing 0.18em, ALL CAPS
Color:           rgba(255,255,255,0.70)
Margin-bottom:   16px
Display:         flex, align-items center, gap 10px
Add:             a 28px horizontal line (1px, rgba(255,255,255,0.4)) on each side of the text
```

**Headline Line 1 ("Tu próximo hogar"):**
```
Font:            Cormorant Garamond 400 italic
Size:            76px (desktop), 52px (tablet), 40px (mobile)
Line-height:     1.0
Color:           #FFFFFF
Margin-bottom:   6px
```

**Headline Line 2 ("te está esperando"):**
```
Font:            Cormorant Garamond 700 upright
Size:            76px (desktop), 52px (tablet), 40px (mobile)
Line-height:     1.0
Color:           #FFFFFF
Margin-bottom:   40px
```

> The italic/bold contrast on the same size creates strong typographic rhythm without needing size difference. Do NOT reduce the second line's size — keep them equal; the weight contrast does the work.

**Search Bar:**
```
Position:        absolute, bottom 48px, left 50%, transform translateX(-50%)
Width:           min(880px, calc(100% - 48px))
Background:      rgba(255,255,255,0.10)
Backdrop-filter: blur(20px)
Border:          1px solid rgba(255,255,255,0.20)
Border-radius:   var(--radius-xl)   → 24px
Padding:         8px 8px 8px 0
Display:         flex, align-items center

  Filter group (left side):
    Flex: 1
    Display: grid, grid-template-columns: repeat(4, 1fr)
    Each filter:
      Padding:         0 20px
      Height:          52px
      Border-right:    1px solid rgba(255,255,255,0.15)
      Last filter:     no border-right
      Label (eyebrow): DM Sans 500 10px, letter-spacing 0.1em, ALL CAPS, rgba(255,255,255,0.55)
      Value:           DM Sans 500 14px, #FFFFFF
      Icon (chevron):  16px, rgba(255,255,255,0.5), right-aligned
      Hover bg:        rgba(255,255,255,0.08), border-radius 16px

  CTA Button (right side):
    Use primary orange button (Section 2.1)
    Height:  52px
    Padding: 0 32px
    Font:    14px, letter-spacing 0.06em
    Flex-shrink: 0
    Margin-right: 0 (flush to bar edge via parent padding)
    Border-radius: 18px (slightly inside the bar radius)
```

**Trust Strip (below search bar, anchored to bottom of viewport):**

> This is NEW — does not exist currently. Add it as a slim horizontal row.

```
Position:        absolute, bottom 0, left 0, width 100%
Background:      rgba(0,0,0,0.35)
Backdrop-filter: blur(8px)
Height:          48px
Display:         flex, align-items center, justify-content center, gap 48px

  Each stat item:
    Display: flex, align-items center, gap 8px
    Separator: 1px vertical line, 24px tall, rgba(255,255,255,0.2) between items

    Number: DM Sans 600, 16px, #FFFFFF
    Label:  DM Sans 400, 13px, rgba(255,255,255,0.65)

  Content: "500+ Propiedades"  |  "10+ Años de experiencia"  |  "⭐ 4.8 Calificación"
```

**Mobile hero (< 768px):**
```
Height:       100svh
Content:      vertically centered at 38%
Search bar:   stacked 2×2 grid of filters + full-width CTA below
              background: rgba(0,0,0,0.60), backdrop-filter none
              border-radius: var(--radius-lg) → 16px
Trust strip:  hide or reduce to 2 stats (500+ propiedades + 4.8 calificación)
```

---

### SECTION 3 — Explorá por Categoría

#### Current Issues
- Section heading "Explorá por categoría" is correct in tone but is undersized (appears ~24px, should be at least 32px)
- The subtitle line is too close in size and weight to the heading — they blur together
- The 6 category cards are extremely lightweight: very thin border, small icon, small label. They feel like UI elements rather than navigational anchors
- No active/selected state is visible
- Cards are too wide relative to their content — 6 across on a wide container with thin borders creates a lot of empty air
- Icons are inconsistent in visual weight

#### Specifications

**Section Container:**
```
Background:    var(--color-surface-soft) → #F7F6F2
Padding:       80px 0
```

**Section Header (centered):**
```
Eyebrow label:
  Text:        "CATEGORÍAS"
  Font:        var(--t-label) — DM Sans 600, 11px, letter-spacing 0.18em
  Color:       var(--color-brand) → #F26B2E
  Margin-bottom: 12px

Heading:
  Text:        "Explorá por categoría"
  Font:        var(--t-h2) — DM Sans 600, 32px
  Color:       var(--color-ink)
  Margin-bottom: 10px

Subtitle:
  Text:        "Encontrá el tipo de propiedad que mejor se adapta a vos"
  Font:        var(--t-body-lg) — DM Sans 400, 17px
  Color:       var(--color-ink-secondary)
  Margin-bottom: 48px
```

**Category Cards Grid:**
```
Display:               grid
Grid-template-columns: repeat(6, 1fr)    [desktop]
                       repeat(3, 1fr)    [tablet < 1024px]
                       repeat(2, 1fr)    [mobile < 640px]
Gap:                   16px
```

**Each Category Card:**
```
Background:     #FFFFFF
Border:         1.5px solid var(--color-border)
Border-radius:  var(--radius-lg) → 16px
Padding:        28px 16px 24px
Display:        flex, flex-direction column, align-items center, gap 14px
Cursor:         pointer
Box-shadow:     var(--shadow-card)
Transition:     all var(--transition-base)

  Hover state:
    Border-color:  var(--color-brand)
    Box-shadow:    var(--shadow-card-hover)
    Transform:     translateY(-3px)

  Active/selected state:
    Background:    var(--color-brand-light) → #FEE8DC
    Border-color:  var(--color-brand)

  Icon container:
    Width/height:  52px
    Background:    var(--color-surface-soft)
    Border-radius: var(--radius-md) → 10px
    Display:       flex, align-items center, justify-content center
    Icon:          28px, color var(--color-brand)
    Transition:    background var(--transition-fast)

  Card hover icon container:
    Background:    var(--color-brand-light)

  Label:
    Font:          DM Sans 500, 14px
    Color:         var(--color-ink-secondary)
    Text-align:    center
    Transition:    color var(--transition-fast)

  Label on hover:
    Color:         var(--color-brand)
```

---

### SECTION 4 — Seleccionadas para vos (Property Grid)

#### Current Issues
- Section heading "Seleccionadas para vos" lacks a clear eyebrow label and feels unanchored at the top of a white section
- The 3-column grid is correct, but card image height is inconsistent between rows — all cards must have fixed image height
- Price badge sits on top of the image (good), but its dark background (#1A1A18) is almost invisible on darker property photos — needs a subtle outline or a consistent placement rule
- The "Consultar" badges (solid green) look like success/confirmation states rather than CTAs — this is misleading
- Favorite button (circle icon, top-right) is too small and blends into light-colored images
- Third row, last card has a placeholder icon instead of a real photo — this must not reach production
- "Explorar todas las propiedades" CTA button is dark/charcoal — should be primary orange for consistency
- The agent logo badge at bottom-left of image overlaps with the price badge area on some cards
- No hover state on cards in current design

#### Specifications

**Section Container:**
```
Background:   #FFFFFF
Padding:      80px 0
```

**Section Header:**
```
Layout:       flex, justify-content space-between, align-items flex-end
Margin-bottom: 40px

  Left:
    Eyebrow:  "PROPIEDADES DESTACADAS" — var(--t-label), color var(--color-brand)
    Heading:  "Seleccionadas para vos" — DM Sans 600, 32px, var(--color-ink)
    Gap:      10px between eyebrow and heading

  Right:
    Link:     "Ver todas →"
    Font:     DM Sans 500, 14px, color var(--color-brand)
    Hover:    underline
```

**Grid:**
```
Display:               grid
Grid-template-columns: repeat(3, 1fr)     [desktop ≥ 1024px]
                       repeat(2, 1fr)     [tablet 640–1023px]
                       1fr                [mobile < 640px]
Gap:                   24px
```

**Property Card:**
```
Background:     #FFFFFF
Border:         1.5px solid var(--color-border)
Border-radius:  var(--radius-lg) → 16px
Overflow:       hidden
Box-shadow:     var(--shadow-card)
Cursor:         pointer
Transition:     transform var(--transition-base), box-shadow var(--transition-base)

  Hover:
    Transform:   translateY(-4px)
    Box-shadow:  var(--shadow-card-hover)
    Border-color: var(--color-border-strong)
```

**Card Image Area:**
```
Position:       relative
Height:         210px                        ← FIXED height for all cards, no exceptions
Overflow:       hidden
Background:     var(--color-surface-soft)    ← fallback if image fails to load

  Image:
    Width/height: 100% (object-fit: cover)
    Transition:   transform 500ms var(--ease-out)

  Card hover image:
    Transform:    scale(1.04)

  Price badge (top-left, 12px from edges):
    Use badge "price" variant — bg #1A1A18, text #FFFFFF
    Back-drop:    add a subtle drop-shadow: 0 2px 8px rgba(0,0,0,0.3)
    Font-size:    13px, font-weight 600

  Status badge (top-left, stacked below price if both exist):
    Available → "Disponible" — use badge "available" variant
    Rented    → "Arrendado"  — use badge "warn" variant
    Consult   → "A consultar" — use badge "consult" variant (outlined orange)

  Favorite button (top-right, 12px from edges):
    Width/height: 32px
    Background:   rgba(255,255,255,0.90)
    Backdrop:     blur(4px)
    Border-radius: var(--radius-full)
    Icon:         Heart, 16px, color var(--color-ink-tertiary)
    Active state: Heart filled, color var(--color-brand)
    Transition:   all var(--transition-fast)
    Box-shadow:   0 2px 8px rgba(0,0,0,0.15)

  Agent logo (bottom-left, 10px from edges):
    Width/height: 28px
    Border-radius: var(--radius-full)
    Border:       2px solid #FFFFFF
    Background:   #FFFFFF
    Object-fit:   contain
    Box-shadow:   0 1px 4px rgba(0,0,0,0.2)
```

**Card Body:**
```
Padding:        16px 18px 18px

  Title:
    Font:        DM Sans 600, 15px
    Color:       var(--color-ink)
    Line-height: 1.4
    Max 2 lines: -webkit-line-clamp 2
    Margin-bottom: 6px

  Location:
    Font:        DM Sans 400, 13px
    Color:       var(--color-ink-tertiary)
    Display:     flex, align-items center, gap 4px
    Icon:        MapPin 14px
    Margin-bottom: 14px

  Divider:
    Height:      1px
    Background:  var(--color-border)
    Margin-bottom: 14px

  Meta row (beds / baths / area):
    Display:     flex, gap 16px, align-items center
    Font:        DM Sans 500, 13px, color var(--color-ink-secondary)
    Icon:        Lucide 16px (Bed, Bath, Maximize2), color var(--color-ink-tertiary)
    Each item:   display flex, gap 5px, align-items center
```

**Bottom CTA:**
```
Margin-top:      48px
Text-align:      center

  Button: "Explorar todas las propiedades"
  Use PRIMARY ORANGE button — NOT the current dark button
  Width:          auto, min-width 240px
  Add right arrow icon: ArrowRight 16px
```

---

### SECTION 5 — Explorá en el Mapa

#### Current Issues
- The "MAPA INTERACTIVO" eyebrow label is correctly orange (good — keep this)
- The main heading "Explorá en el mapa" is in very large bold which is the correct direction, but the font switch to a slab/condensed treatment there is inconsistent with the heading system — align to DM Sans 600
- Filter tabs (Casa, Departamento, etc.) use an orange active pill — correct, keep it
- The price-range sub-filter bar has too many items for the width; "Total" appears as an active item alongside numeric ranges which is confusing (Total means "all" but looks like a specific range)
- Map and sidebar split (roughly 50/50) is fine but the sidebar "37 propiedades" header with "Más recientes" dropdown is too cramped
- The sidebar property cards show a small thumbnail + text — the thumbnail is too small (approx 90px wide) to convey anything useful; either enlarge to 120px or show a text-only list

#### Specifications

**Section Container:**
```
Background:     var(--color-surface-soft) → #F7F6F2
Padding:        80px 0 0       ← no bottom padding — map goes edge to edge at bottom
```

**Section Header:**
```
Padding:        0 48px
Margin-bottom:  32px

  Eyebrow:      "MAPA INTERACTIVO" — var(--t-label), color var(--color-brand)   ← keep as-is
  Heading:      "Explorá en el mapa"
  Font:         Cormorant Garamond 700, 52px    ← use display font here for distinction
  Color:        var(--color-ink)
  Margin-bottom: 24px
```

**Filter Row:**
```
Display:        flex, align-items center, flex-wrap wrap, gap 10px
Margin-bottom:  24px
Padding:        0 48px

  Type pills (Casa, Departamento, etc.):
    Height:      36px
    Padding:     0 16px
    Background:  #FFFFFF
    Border:      1.5px solid var(--color-border)
    Border-radius: var(--radius-full)
    Font:        DM Sans 500, 13px
    Color:       var(--color-ink-secondary)

    Active:
      Background:   var(--color-brand)
      Border-color: var(--color-brand)
      Color:        #FFFFFF

  Price range selector:
    Separate it visually from type pills with a 1px vertical divider (20px tall, var(--color-border))
    Replace "Total" label with "Todos los precios" to avoid confusion
    Same pill style as type pills
    Group them in a subtle container: background rgba(0,0,0,0.04), border-radius var(--radius-full), padding 3px
```

**Map + Sidebar Layout:**
```
Display:        grid
Grid-template-columns: 1fr 420px    [desktop ≥ 1200px]
                       1fr 360px    [tablet 900–1199px]
                       1fr          [mobile — stacked, map first, sidebar below]
Height (desktop): 560px
Overflow:       hidden
```

**Map Container:**
```
Height:         100%
Border-radius:  0
Overflow:       hidden
Position:       relative

  Map price pins:
    Font:       DM Sans 600, 12px
    Background: var(--color-surface-dark)
    Color:      #FFFFFF
    Padding:    4px 8px
    Border-radius: var(--radius-sm)
    Box-shadow: 0 2px 6px rgba(0,0,0,0.3)

    Active pin:
      Background: var(--color-brand)
      Transform:  scale(1.1)
      Z-index:    higher
```

**Sidebar:**
```
Background:     #FFFFFF
Border-left:    1px solid var(--color-border)
Display:        flex, flex-direction column
Overflow:       hidden

  Sidebar Header:
    Padding:    20px 24px 16px
    Display:    flex, justify-content space-between, align-items center
    Border-bottom: 1px solid var(--color-border)
    Count text: DM Sans 600, 16px, var(--color-ink)  e.g. "37 propiedades"
    Sort dropdown: DM Sans 400, 13px, var(--color-brand), no visible border
    Arrow icon: ChevronDown 16px

  Sidebar List:
    Flex: 1
    Overflow-y: auto
    Scrollbar: thin, color var(--color-border)

  Sidebar Card (each property):
    Padding:    16px 24px
    Border-bottom: 1px solid var(--color-border)
    Display:    grid, grid-template-columns: 120px 1fr, gap 14px
    Align:      center
    Cursor:     pointer
    Transition: background var(--transition-fast)

    Hover:
      Background: var(--color-surface-soft)

    Thumbnail:
      Width:      120px         ← increase from current ~90px
      Height:     80px
      Border-radius: var(--radius-md) → 10px
      Object-fit: cover
      Flex-shrink: 0

    Info:
      Price:     DM Sans 600, 15px, var(--color-ink)
      Title:     DM Sans 400, 13px, var(--color-ink-secondary), 2-line clamp
      Location:  DM Sans 400, 12px, var(--color-ink-tertiary), flex + MapPin icon 12px
      Meta row:  DM Sans 400, 12px, var(--color-ink-tertiary), gap 10px
```

---

### SECTION 6 — Stats Bar (Currently mid-page, standalone)

#### Current Issues
- The three numbers (500+, 10+, 4.8) are very small relative to the white space around them — the section feels accidentally empty
- No visual differentiation between numbers and labels — they blend at a glance
- This section does NO work as a standalone element this far down the page — visitors have already formed an opinion by now
- **Recommendation: Move this section immediately below the hero** as a trust strip. A condensed version should also appear in the hero (see Section 2 specs). The full stats section should still exist here but with upgraded styling.

#### Specifications

**Section Container:**
```
Background:     var(--color-surface-soft) → #F7F6F2
Padding:        64px 0
Border-top:     1px solid var(--color-border)
Border-bottom:  1px solid var(--color-border)
```

**Stats Grid:**
```
Display:        grid
Grid-template-columns: repeat(3, 1fr)
Max-width:      800px
Margin:         0 auto
Gap:            0
```

**Each Stat Item:**
```
Text-align:     center
Padding:        0 40px
Border-right:   1px solid var(--color-border) [on first 2 items]

  Number:
    Font:       Cormorant Garamond 700, 64px
    Color:      var(--color-brand) → #F26B2E    ← make the numbers orange, not black
    Line-height: 1

  Label:
    Font:       DM Sans 400, 15px
    Color:      var(--color-ink-secondary)
    Margin-top: 8px
```

**Tablet/mobile:** reduce number size to `48px` / `36px`. Stack vertically on mobile with horizontal dividers.

---

### SECTION 7 — Testimonials

#### Current Issues
- Star ratings are orange (correct — keep)
- Quote text is appropriately small but the cards lack visual differentiation from the background — white-on-white is too flat
- Avatar + name area is too small and visually disconnected from the quote
- The three cards have equal visual weight — there is no "featured" testimonial

#### Specifications

**Section Container:**
```
Background:     #FFFFFF
Padding:        80px 0
```

**Section Header (centered):**
```
Eyebrow:    "LO QUE DICEN NUESTROS CLIENTES" — var(--t-label), color var(--color-brand)
Heading:    "Experiencias reales" — DM Sans 600, 32px
Subtitle:   "Personas que encontraron su hogar con nosotros" — DM Sans 400, 17px
Margin-bottom: 48px
```

**Grid:**
```
Display:               grid
Grid-template-columns: repeat(3, 1fr)   [desktop]
                       1fr              [mobile — use swipeable carousel]
Gap:                   24px
```

**Testimonial Card:**
```
Background:     #FFFFFF
Border:         1.5px solid var(--color-border)
Border-radius:  var(--radius-lg) → 16px
Padding:        32px 28px
Box-shadow:     var(--shadow-card)
Position:       relative

  Quote mark (decorative):
    Content:    """
    Font:       Cormorant Garamond 400, 72px
    Color:      var(--color-brand-light) → #FEE8DC
    Position:   absolute, top 20px, left 24px
    Line-height: 1
    Z-index:    0

  Stars:
    Color:      var(--color-brand)  ← keep orange stars
    Gap:        3px
    Margin-bottom: 16px
    Icon:       Star (Lucide, filled), 16px

  Quote text:
    Font:       DM Sans 400, 15px, line-height 1.7
    Color:      var(--color-ink-secondary)
    Margin-bottom: 24px
    Position:   relative, z-index 1

  Author area:
    Display:    flex, align-items center, gap 12px
    Margin-top: auto
    Padding-top: 20px
    Border-top: 1px solid var(--color-border)

    Avatar:
      Width/height: 44px
      Border-radius: var(--radius-full)
      Object-fit:   cover
      Border:       2px solid var(--color-brand-light)

    Name:
      Font:     DM Sans 600, 14px, var(--color-ink)
    Role/city:
      Font:     DM Sans 400, 12px, var(--color-ink-tertiary)
```

**Featured card (middle card — visually elevated):**
```
Background:     var(--color-brand-muted) → #F9DDD0
Border-color:   var(--color-brand)
Transform:      translateY(-8px)    ← physically elevated
Box-shadow:     var(--shadow-card-hover)
```

---

### SECTION 8 — Partner Logos

#### Current Issues
- The section label "EMPRESAS QUE CONFÍAN EN NOSOTROS" is good
- Logos are very muted/gray — they need a small amount of opacity animation on hover to feel interactive
- The logos appear at inconsistent heights — needs a uniform container height

#### Specifications

**Section Container:**
```
Background:     var(--color-surface-soft)
Padding:        48px 0
Border-top:     1px solid var(--color-border)
```

**Label:**
```
Text:           "EMPRESAS QUE CONFÍAN EN NOSOTROS"
Font:           var(--t-label) — DM Sans 600, 11px, letter-spacing 0.18em
Color:          var(--color-ink-tertiary)
Text-align:     center
Margin-bottom:  32px
```

**Logo Row:**
```
Display:        flex
Justify:        center
Align-items:    center
Gap:            56px
Flex-wrap:      wrap

  Each logo:
    Height:     28px
    Width:      auto
    Filter:     grayscale(100%) opacity(0.45)
    Transition: filter var(--transition-base)

    Hover:
      Filter:   grayscale(0%) opacity(1)
```

---

### SECTION 9 — Dual CTA Cards (Vender / Invertir)

#### Current Issues
- Both cards are the same size, weight, and darkness — no hierarchy between the two audiences
- The icons (house, chart) are very small and lack visual presence
- Button text on both cards uses the same label style — the CTAs don't feel distinct from each other
- Cards have no hover effect
- The section sits on a plain white background with no visual transition from the testimonials

#### Specifications

**Section Container:**
```
Background:     linear-gradient(to bottom, #FFFFFF 0%, var(--color-surface-soft) 100%)
Padding:        80px 0
```

**Grid:**
```
Display:        grid
Grid-template-columns: 1fr 1fr   [desktop ≥ 768px]
                       1fr        [mobile]
Gap:            24px
Max-width:      960px
Margin:         0 auto
Padding:        0 48px
```

**LEFT card — "¿Querés vender?" (PRIMARY — larger visual weight):**
```
Background:     var(--color-surface-dark) → #1C1C1A
Border-radius:  var(--radius-xl) → 24px
Padding:        48px 40px
Box-shadow:     0 8px 40px rgba(0,0,0,0.20)
Transition:     transform var(--transition-base), box-shadow var(--transition-base)

  Hover:
    Transform:  translateY(-4px)
    Box-shadow: 0 16px 60px rgba(0,0,0,0.28)

  Icon container:
    Width/height: 56px
    Background:   rgba(242,107,46,0.15)   ← brand-tinted dark
    Border-radius: var(--radius-md)
    Icon:          Home, 28px, color var(--color-brand)
    Margin-bottom: 24px

  Eyebrow:
    "PROPIETARIOS"
    Font: var(--t-label), color var(--color-brand)
    Margin-bottom: 12px

  Heading:
    "¿Querés vender tu propiedad?"
    Font: Cormorant Garamond 700, 30px, color #FFFFFF
    Line-height: 1.2
    Margin-bottom: 14px

  Body:
    Font: DM Sans 400, 15px, rgba(255,255,255,0.65), line-height 1.6
    Margin-bottom: 32px

  CTA:
    Use PRIMARY ORANGE button (Section 2.1)
    Text: "Solicitar tasación gratuita"
    Full-width: yes
    Height: 52px
```

**RIGHT card — "¿Buscas invertir?" (SECONDARY — slightly lighter):**
```
Background:     var(--color-surface-dark) → #1C1C1A  [same bg]
Border:         1.5px solid rgba(255,255,255,0.08)
Border-radius:  var(--radius-xl) → 24px
Padding:        48px 40px

  Scale difference: this card should be visually 92% of the left card's presence.
  Achieve this by:
    - Slightly smaller heading font: Cormorant Garamond 700, 26px
    - No box-shadow (rely only on the border)
    - Icon bg opacity: rgba(242,107,46,0.10) instead of 0.15

  CTA:
    Use GHOST BUTTON (Section 2.3 — white outlined)
    Text: "Buscar inversión"
    Full-width: yes
    Height: 52px
```

> The left card dominates because it is the more frequent scenario (sellers) and a higher-intent action (free valuation = clear value exchange). The ghost button on the right card creates the hierarchy difference without needing different background colors.

---

### SECTION 10 — Footer

#### Current Issues
- Footer background is dark charcoal (correct)
- Logo at top-left is good but small
- The 4-column link layout is correct but column labels (PROPIEDADES, EMPRESA, CONTACTO) are barely distinguishable from the link items below them
- Social icons are very small and have no hover state described
- No visible separation between the main footer and the copyright strip

#### Specifications

**Footer Container:**
```
Background:     var(--color-surface-darker) → #141412
Padding:        64px 0 0
```

**Footer Grid:**
```
Display:        grid
Grid-template-columns: 2fr 1fr 1fr 1fr   [desktop ≥ 1024px]
                       1fr 1fr           [tablet]
                       1fr               [mobile]
Gap:            48px 64px
Padding:        0 48px 64px
```

**Column 1 — Brand:**
```
  Logo:
    Height:    40px
    Filter:    brightness(0) invert(1)   ← white version

  Tagline:
    Font: DM Sans 400, 14px, rgba(255,255,255,0.50)
    Margin: 16px 0 24px

  Social icons:
    Display: flex, gap 12px

    Each icon button:
      Width/height: 36px
      Background:   rgba(255,255,255,0.07)
      Border:       1px solid rgba(255,255,255,0.10)
      Border-radius: var(--radius-full)
      Icon:         20px, rgba(255,255,255,0.65)
      Hover bg:     var(--color-brand)
      Hover border: var(--color-brand)
      Hover icon:   #FFFFFF
      Transition:   all var(--transition-fast)
```

**Columns 2–4 — Links:**
```
  Column heading:
    Font:    DM Sans 600, 11px, letter-spacing 0.14em, ALL CAPS
    Color:   rgba(255,255,255,0.90)
    Margin-bottom: 20px

  Links:
    Font:    DM Sans 400, 14px
    Color:   rgba(255,255,255,0.50)
    Line-height: 2.2   ← generous spacing between links
    Display: block

    Hover:
      Color:    #FFFFFF
      Padding-left: 4px  ← subtle indent on hover
      Transition: all var(--transition-fast)
```

**Copyright Strip:**
```
Background:     rgba(0,0,0,0.3)
Border-top:     1px solid rgba(255,255,255,0.06)
Height:         52px
Display:        flex, align-items center, justify-content space-between
Padding:        0 48px

  Left:
    Font: DM Sans 400, 12px, rgba(255,255,255,0.35)
    Text: "© 2025 RR Real Estate. Todos los derechos reservados."

  Right:
    Font: DM Sans 400, 12px, rgba(255,255,255,0.35)
    Text: "Córdoba, Argentina"
```

---

### SECTION 11 — NEW: Agents Section (Currently Missing)

> This section does not exist and must be added between Testimonials and Partner Logos.

**Rationale:** Real estate is a trust-based, relationship-driven industry. The current site shows zero human faces from the team (testimonial avatars are clients, not agents). Adding agent profiles dramatically increases contact-form conversion rates.

**Section Container:**
```
Background:     var(--color-surface-soft)
Padding:        80px 0
```

**Section Header:**
```
Eyebrow:    "EL EQUIPO" — var(--t-label), color var(--color-brand)
Heading:    "Nuestros asesores" — DM Sans 600, 32px
Subtitle:   "Profesionales con conocimiento profundo del mercado cordobés"
Margin-bottom: 48px
```

**Agent Cards Grid:**
```
Display:               grid
Grid-template-columns: repeat(4, 1fr)   [desktop ≥ 1024px]
                       repeat(2, 1fr)   [tablet]
                       1fr              [mobile]
Gap:                   24px
```

**Each Agent Card:**
```
Background:     #FFFFFF
Border:         1.5px solid var(--color-border)
Border-radius:  var(--radius-lg) → 16px
Padding:        28px 24px
Text-align:     center
Transition:     all var(--transition-base)
Box-shadow:     var(--shadow-card)

  Hover:
    Transform:   translateY(-3px)
    Box-shadow:  var(--shadow-card-hover)
    Border-color: var(--color-brand)

  Photo:
    Width/height: 80px
    Border-radius: var(--radius-full)
    Object-fit:   cover
    Border:       3px solid var(--color-brand-light)
    Margin:       0 auto 16px

  Name:
    Font:  DM Sans 600, 16px, var(--color-ink)
    Margin-bottom: 4px

  Specialty:
    Font:  DM Sans 400, 13px, var(--color-brand)  ← orange specialty label
    Margin-bottom: 12px

  Stats (total listings, years):
    Display: flex, justify-content center, gap 16px
    Font:    DM Sans 500, 12px, var(--color-ink-tertiary)
    Margin-bottom: 20px

  Contact button:
    Height:  38px, padding 0 20px
    Use PRIMARY ORANGE, small variant
    Text:    "Contactar"
    Icon:    MessageCircle 14px
```

---

### SECTION 12 — Floating Elements

**WhatsApp Floating Button (already present):**
```
Position:         fixed, bottom 24px, right 24px, z-index 200
Width/height:     52px
Background:       #25D366
Border-radius:    var(--radius-full)
Box-shadow:       0 4px 20px rgba(37,211,102,0.40)
Icon:             WhatsApp SVG, 26px, #FFFFFF
Transition:       transform var(--transition-fast), box-shadow var(--transition-fast)

  Hover:
    Transform:    scale(1.08)
    Box-shadow:   0 6px 28px rgba(37,211,102,0.55)

  Label tooltip (on hover):
    Text:         "Hablar con un asesor"
    Position:     right 64px, same vertical center
    Background:   var(--color-surface-dark)
    Color:        #FFFFFF
    Font:         DM Sans 500, 13px
    Padding:      6px 12px
    Border-radius: var(--radius-sm)
    White-space:  nowrap
    Opacity 0 → 1 on hover (150ms delay)
```

**NEW — Sticky Mobile CTA Bar:**
```
Display:          none on desktop; flex on mobile (< 768px)
Position:         fixed, bottom 0, left 0, width 100%, z-index 190
Background:       rgba(255,255,255,0.95)
Backdrop-filter:  blur(12px)
Border-top:       1px solid var(--color-border)
Padding:          12px 20px
Gap:              12px
Safe-area:        padding-bottom: env(safe-area-inset-bottom)

  Button:         "Ver propiedades" — PRIMARY ORANGE, flex: 1, height 48px
  Button:         "Consultar" — outlined dark (Section 2.2), flex: 1, height 48px
```

---

## 4. Responsive Breakpoints

```
--bp-mobile:   640px     /* < 640px: single column, reduced font sizes */
--bp-tablet:   1024px    /* 640–1023px: 2-column grids, mid-range sizes */
--bp-desktop:  1280px    /* ≥ 1024px: full layout */
--bp-wide:     1440px    /* ≥ 1440px: max-width container, no further expansion */
```

**Mobile navigation:** Replace nav links with hamburger → full-screen overlay drawer.  
**Mobile hero:** Full-screen, headline 38px, search bar stacked 2×2.  
**Mobile property grid:** Single column; show 4 cards with "Ver más" button.  
**Mobile map:** Map full width, 280px height; sidebar appears below as horizontal scroll.  
**Mobile dual CTA:** Stacked vertically, equal size on mobile.

---

## 5. Animation Guidelines

```css
/* Page entrance — stagger hero elements */
.hero-eyebrow    { animation: fadeUp 0.6s var(--ease-out) 0.1s both; }
.hero-headline   { animation: fadeUp 0.7s var(--ease-out) 0.25s both; }
.hero-search     { animation: fadeUp 0.7s var(--ease-out) 0.45s both; }
.hero-trust      { animation: fadeIn 0.5s ease 0.70s both; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Scroll reveal — apply to section headers and card grids */
[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
}
[data-reveal].visible {
  opacity: 1;
  transform: none;
}
/* Use IntersectionObserver with threshold: 0.15 to trigger .visible */
/* Stagger cards: add transition-delay: calc(var(--i, 0) * 80ms) to each card */
```

---

## 6. Priority Implementation Order

| Priority | Section              | Impact                         |
|----------|----------------------|--------------------------------|
| 1        | Design system tokens | Unblocks all other work        |
| 2        | Navbar               | Every page visit sees this     |
| 3        | Hero + search bar    | Highest-traffic element        |
| 4        | Property cards       | Core product display           |
| 5        | Stats bar (moved up) | Trust lift near top of funnel  |
| 6        | Dual CTA section     | Direct conversion section      |
| 7        | Agents section (new) | Relationship trust builder     |
| 8        | Testimonials         | Social proof refinement        |
| 9        | Map section          | Feature polish                 |
| 10       | Footer + floating    | Detail and mobile UX           |

---

## 7. DO NOT Change

- The Córdoba landscape hero photography — it is the strongest asset on the page
- Orange as the primary action color (`#F26B2E` or equivalent in current brand)
- The interactive map section — this is a genuine differentiator; enhance, do not remove
- The dual audience CTA concept (Vender / Invertir) — the segmentation is correct, only the visual hierarchy needs adjustment
- Orange star ratings in testimonials

---

*End of specification.*
