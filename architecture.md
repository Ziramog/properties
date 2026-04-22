# Architecture — Roggero & Roma Inmobiliaria

## Overview

**Stack:** Next.js 14 (App Router) · MongoDB/Mongoose · Tailwind CSS · NextAuth (Google OAuth) · Cloudinary (images) · Vercel (deploy)

**Brand:** Roggero & Roma | Negocios Inmobiliarios — real estate agency in Alta Gracia, Córdoba, Argentina.

**Color palette:**
- Accent: `#E94560` (red/pink)
- Dark: `#1A1A2E` (navy)

---

## Directory Structure

```
app/
  page.jsx                    # Homepage: Hero → MapProperties → FeaturedProperties → Testimonials → Clients
  layout.jsx                  # Root layout: Navbar, Footer, AuthProvider, GlobalContext, ToastContainer
  error.jsx                   # Global error boundary
  loading.jsx                 # Global loading page
  not-found.jsx                # 404 page
  globals.css                  # Tailwind imports + custom utilities
  actions/                     # Server Actions
  api/auth/[...nextauth]/      # NextAuth handler
  contact/page.jsx              # Contact page with WhatsApp
  messages/page.jsx            # User messages inbox (auth)
  profile/page.jsx             # User profile (auth)
  properties/
    page.jsx                   # Listing with filters
    add/page.jsx               # Add property (auth)
    saved/page.jsx             # Bookmarked properties (auth)
    search-results/page.jsx     # Search results
    [id]/
      page.jsx                 # Property detail
      edit/page.jsx            # Edit property (auth, owner only)
  api/
    auth/[...nextauth]/route.js # NextAuth GET/POST handler

components/
  # Layout
  Navbar.jsx                   # Top nav: logo, links, auth state, unread badge
  Footer.jsx                   # Footer: contact, social, WhatsApp float button
  AuthProvider.jsx              # Wraps app with NextAuth SessionProvider
  # Homepage sections
  Hero.jsx                      # Background image + PropertyFilters form
  MapProperties.jsx             # Split view: Leaflet map + property cards
  MapView.jsx                   # Leaflet map with property markers
  FeaturedProperties.jsx        # Server component: is_featured=true properties
  HomeProperties.jsx            # Server component: 3 most recent properties
  InfoBoxes.jsx                 # Buyer/Seller info boxes
  Testimonials.jsx              # Client testimonials carousel
  Clients.jsx                   # Client logos carousel
  # Property components
  PropertyCard.jsx              # Card: image, price, beds/baths/sqft
  FeaturedPropertyCard.jsx      # Variant for featured section
  PropertyFilters.jsx            # Filters: type, city, price, bedrooms
  PropertySearchForm.jsx        # Location + type search
  PropertyDetails.jsx           # Full info: description, amenities, map
  PropertyHeaderImage.jsx       # Top image on detail page
  PropertyImages.jsx            # PhotoSwipe gallery
  PropertyMap.jsx               # Mapbox single-property map
  PropertyContactForm.jsx       # Contact form on property page
  PropertyAddForm.jsx           # Add property form (Server Action)
  PropertyEditForm.jsx          # Edit property form (Server Action)
  # User / messaging
  BookmarkButton.jsx             # Toggle bookmark (Server Action)
  MessageCard.jsx               # Message display + mark read/delete
  ProfileProperties.jsx         # User's listings with edit/delete
  UnreadMessageCount.jsx        # Badge from GlobalContext
  SubmitMessageButton.jsx       # Form submit with useFormStatus
  ShareButtons.jsx              # FB/Twitter/WhatsApp/Email share
  # UI
  Pagination.jsx                # Previous/Next pagination
  InfoBox.jsx                   # Reusable card with heading + CTA
  Spinner.jsx                   # ClipLoader spinner
  WhatsAppButton.jsx            # Fixed WA button: +5493547563911
  icons/                         # SVG icon components (Bed, Bath, Area, etc.)

config/
  database.js                    # Mongoose singleton (skips if no URI at build time)
  cloudinary.js                  # Cloudinary SDK config

context/
  GlobalContext.jsx              # unreadCount state + provider

models/
  Property.js                    # Mongoose schema
  User.js                        # Mongoose schema
  Message.js                     # Mongoose schema

utils/
  authOptions.js                 # NextAuth config + Google provider + callbacks
  convertToObject.js             # Mongoose lean document serializer
  getSessionUser.js              # Server-side session user helper

middleware.js                    # Route protection (NextAuth)

public/
  images/
    clients/                     # Client logos (DINO-GRIS, SANTANDER, etc.)
    testimonials/                # Testimonial photos
    logo-roma.png                # Brand logo
    pin.svg                      # Map marker SVG
```

---

## Pages & Routes

| Route | Type | Description |
|---|---|---|
| `/` | Server | Homepage: Hero, MapProperties, FeaturedProperties, Testimonials, Clients |
| `/contact` | Static | Contact page with WhatsApp link |
| `/properties` | Dynamic | Full listing with filters (type, city, price, bedrooms) |
| `/properties/add` | Dynamic | Add property form (auth required) |
| `/properties/saved` | Dynamic | Bookmarked properties (auth required) |
| `/properties/search-results` | Dynamic | Text/location search results |
| `/properties/[id]` | Dynamic | Property detail: gallery, map, contact form |
| `/properties/[id]/edit` | Dynamic | Edit property (auth + owner only) |
| `/messages` | Dynamic | Messages inbox (auth required) |
| `/profile` | Dynamic | User profile + their listings (auth required) |
| `/api/auth/[...nextauth]` | API | NextAuth handler (GET/POST) |

---

## Server Actions (`app/actions/`)

| Action | File | Description |
|---|---|---|
| `addProperty` | `addProperty.js` | Create property + upload images to Cloudinary |
| `updateProperty` | `updateProperty.js` | Update property fields + images |
| `deleteProperty` | `deleteProperty.js` | Delete property + Cloudinary images |
| `bookmarkProperty` | `bookmarkProperty.js` | Toggle bookmark on/off |
| `checkBookmarkStatus` | `checkBookmarkStatus.js` | Check if property is bookmarked |
| `addMessage` | `addMessage.js` | Send message about a property |
| `markMessageAsRead` | `markMessageAsRead.js` | Toggle read/unread |
| `deleteMessage` | `deleteMessage.js` | Delete message (recipient only) |
| `getUnreadMessageCount` | `getUnreadMessageCount.js` | Count unread messages for navbar badge |

---

## Data Models

### Property
```js
{
  owner: ObjectId,           // ref: User, required
  name: String,
  type: String,              // casa | departamento | terreno | campo | local
  description: String,
  location: { street, city, state, zipcode },
  beds, baths, square_feet: Number,
  amenities: [String],
  rates: { nightly, weekly, monthly },
  seller_info: { name, email, phone },
  images: [String],          // Cloudinary URLs
  is_featured: Boolean,
  covered_area, garage,
  services: [String],
  titles_status: String,
  interior: { aberturas, pisos, calefaccion },
  exterior: { techos },
  price: String,
}
```

### User
```js
{
  email: String (unique),
  username: String,
  image: String,
  bookmarks: [ObjectId],     // ref: Property
}
```

### Message
```js
{
  sender: ObjectId,          // ref: User
  recipient: ObjectId,       // ref: User
  property: ObjectId,        // ref: Property
  name, email, phone, body: String,
  read: Boolean,
}
```

---

## Authentication

**Provider:** Google OAuth via NextAuth v4

**Callbacks:**
- `signIn` — Creates/updates user in MongoDB on first login
- `session` — Injects `user.id` (MongoDB `_id`) into session object

**Protected routes** (via `middleware.js`): `/properties/add`, `/profile`, `/properties/saved`, `/messages`

---

## Maps

- **Homepage map** (`MapView.jsx`): Leaflet + OpenStreetMap — no API key needed
- **Property detail map** (`PropertyMap.jsx`): Mapbox GL — requires `NEXT_PUBLIC_MAPBOX_TOKEN`

**Geocoding:** Nominatim (OpenStreetMap) for Córdoba city coordinates. Property city coordinates stored in DB for map markers.

---

## Image Handling

- **Hosting:** Cloudinary (`cloudinary` npm package)
- **Upload:** `addProperty` / `updateProperty` server actions upload to Cloudinary
- **Gallery:** PhotoSwipe (`react-photoswipe-gallery`) on property detail page
- **Placeholder:** `/assets/images/profile-placeholder.png`

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXTAUTH_URL` | App URL (dev: `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token |
| `NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY` | Google Geocoding API key |
| `NEXT_PUBLIC_DOMAIN` | Production domain |
| `NEXT_PUBLIC_API_DOMAIN` | API domain |

---

## Build & Deploy

- **Dev:** `npm run dev` → `http://localhost:3000`
- **Build:** `npm run build` (runs before commit/push per CLAUDE.md rules)
- **Deploy:** Vercel — auto-deploys from `dev` branch
- **Build behavior:** `connectDB` skips if `MONGODB_URI` is not set, allowing build without DB

---

## Key Conventions

- **Server Components** as default; `'use client'` only when interactivity needed
- **Tailwind CSS** for all styling (no custom CSS)
- **Server Actions** for all mutations (add/update/delete/bmoodmark)
- **Dynamic rendering** (`force-dynamic`) on most pages to ensure fresh data
- **Singleton DB connection** via `connectDB` to avoid multiple connections
- **CLAUDE.md rule:** never commit without `npm run build` passing first
