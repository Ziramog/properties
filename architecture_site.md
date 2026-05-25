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
  not-found.jsx               # 404 page
  globals.css                 # Tailwind imports + custom utilities
  actions/                    # Server Actions (CRUD, bookmarks, messages)
  api/auth/[...nextauth]/     # NextAuth handler
  contact/page.jsx             # Contact page with WhatsApp
  messages/page.jsx           # User messages inbox (auth)
  profile/page.jsx            # User profile (auth)
  properties/
    page.jsx                  # Listing with filters
    add/page.jsx              # Add property (auth)
    saved/page.jsx            # Bookmarked properties (auth)
    search-results/page.jsx    # Search results
    [id]/
      page.jsx                # Property detail
      edit/page.jsx           # Edit property (auth, owner only)
  api/
    auth/[...nextauth]/route.js

components/
  # Layout
  Navbar.jsx                  # Top nav: logo, links, auth state, unread badge
  Footer.jsx                  # Footer: contact, social, WhatsApp float button
  AuthProvider.jsx            # Wraps app with NextAuth SessionProvider
  # Homepage sections
  Hero.jsx                    # Background image + PropertyFilters form
  MapProperties.jsx           # Split view: Leaflet map + property cards
  MapView.jsx                 # Leaflet map with property markers
  FeaturedProperties.jsx       # Server component: is_featured=true properties
  HomeProperties.jsx          # Server component: 3 most recent properties
  InfoBoxes.jsx              # Buyer/Seller info boxes
  Testimonials.jsx           # Client testimonials carousel
  Clients.jsx                # Client logos carousel
  # Property components
  PropertyCard.jsx            # Card: image, price, beds/baths/sqft
  FeaturedPropertyCard.jsx    # Variant for featured section
  PropertyFilters.jsx        # Filters: type, city, price, bedrooms
  PropertySearchForm.jsx     # Location + type search
  PropertyDetails.jsx         # Full info: description, amenities, map
  PropertyHeaderImage.jsx     # Top image on detail page
  PropertyImages.jsx          # PhotoSwipe gallery
  PropertyMap.jsx            # Mapbox single-property map
  PropertyContactForm.jsx     # Contact form on property page
  PropertyAddForm.jsx         # Add property form (Server Action)
  PropertyEditForm.jsx        # Edit property form (Server Action)
  # User / messaging
  BookmarkButton.jsx          # Toggle bookmark (Server Action)
  MessageCard.jsx            # Message display + mark read/delete
  ProfileProperties.jsx      # User's listings with edit/delete
  UnreadMessageCount.jsx     # Badge from GlobalContext
  SubmitMessageButton.jsx    # Form submit with useFormStatus
  ShareButtons.jsx           # FB/Twitter/WhatsApp/Email share
  # UI
  Pagination.jsx             # Previous/Next pagination
  InfoBox.jsx                # Reusable card with heading + CTA
  Spinner.jsx                # ClipLoader spinner
  WhatsAppButton.jsx         # Fixed WA button: +5493547563911
  icons/                     # SVG icon components (Bed, Bath, Area, etc.)

config/
  database.js                # Mongoose singleton (skips if no URI at build time)
  cloudinary.js              # Cloudinary v2 config

context/
  GlobalContext.jsx          # unreadCount state + provider

models/
  Property.js                # Mongoose schema
  User.js                    # Mongoose schema
  Message.js                 # Mongoose schema

utils/
  authOptions.js             # NextAuth config + Google provider + callbacks
  convertToObject.js         # Mongoose lean document serializer
  getSessionUser.js          # Server-side session user helper

middleware.js                # Route protection (NextAuth)

public/
  images/
    clients/                 # Client logos (DINO-GRIS, SANTANDER, etc.)
    testimonials/            # Testimonial photos
    logo-roma.png            # Brand logo
    pin.svg                  # Map marker SVG
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
  images: [String],          // Cloudinary URLs (stored as strings, NOT binary)
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
  image: String,             // Cloudinary URL for profile picture
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

## Image Handling — Cloudinary Strategy

### Architecture Decision: URLs Only in MongoDB

MongoDB is not designed to store binary data (images). The current architecture stores **only Cloudinary URLs** as strings in the `images: [String]` field. This approach:

- Keeps MongoDB document size small (URLs are ~200 bytes each vs megabytes for binary)
- Leverages Cloudinary's CDN for fast global image delivery
- Avoids MongoDB storage bloat and GridFS complexity
- Uses Cloudinary's automatic optimization (format, quality, responsive images)

### Image Storage Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           IMAGE UPLOAD FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

  Browser                        Next.js Server Action                    Cloudinary
  ───────                        ─────────────────────                    ─────────
  User selects files
  ─────────────────────────────►
                                 formData.getAll('images')
                                 for each file:
                                   arrayBuffer()
                                   Buffer.from()
                                   upload_stream()
                                 ─────────────────────────────►  Upload to cloud
                                                                 ◄────────────────
                                                                 secure_url returned
                                 Push URL to images[]
                                 ───────────────────────────────────────────────►
                                 Property.images = [url1, url2, ...]
                                 property.save()
                                 ───────────────────────────────────────────────►  MongoDB
                                 return { success: true }
  ◄──────────────────────────────────────────────────────────────────────────────
```

### Property Edit Flow — Request Lifecycle

```
Browser (Client)               Vercel Edge (Middleware)       Vercel Server (Action)        MongoDB Atlas
│                              │                              │                             │
├─ [1] Form submit ────────────┤                              │                             │
│   useFormState fires         │                              │                             │
│   POST /properties/:id/edit  │                              │                             │
│                              ├─ [2] Middleware ─────────────┤                             │
│                              │   POST bypass (no redirect)   │                             │
│                              │   → NextResponse.next()       │                             │
│                              │                              ├─ [3] Server Action ─────────┤
│                              │                              │   updateProperty()          │
│                              │                              │   → connectDB()             │
│                              │                              │   → getSessionUser()        │
│                              │                              │   → Property.findById()     │
│                              │                              │   → cloudinary.upload()     │
│                              │                              │   → prop.set() + prop.save()│
│                              │                              │                             ├─ [4] Write ──
│                              │                              │   return { success: true }  │   MongoDB
│                              │                              │   ←────────────────────────┤   persist
│                              │                              │                             │
│   [5] useFormState state    │                              │                             │
│   → useEffect fires        │                              │                             │
│   → state.success           │                              │                             │
│   → window.location.href    │                              │                             │
│   → /properties            │                              │                             │
```

### Image Upload Code Pattern

```js
// Filter out synthetic blob files from URL.createObjectURL previews
const newImageFiles = formData.getAll('images').filter(
  (img) => img && img.name && img.name !== '' && img.size > 0
);

for (const imageFile of newImageFiles) {
  const imageBuffer = await imageFile.arrayBuffer();
  const imageArray = Array.from(new Uint8Array(imageBuffer));
  const imageData = Buffer.from(imageArray);

  // Cloudinary upload_stream API
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      (error, result) => error ? reject(error) : resolve(result),
      { folder: 'propertypulse' }
    );
    stream.write(imageData);
    stream.end();
  });
  currentImages.push(result.secure_url);
}
```

### Image Removal Flow

```
1. User clicks × on existing image
2. URL added to removedImages[] state
3. Image hidden from display, URL sent as hidden <input name="removedImages">
4. Server: filters out removedImages from existing property images
5. If currentImages is empty → returns { error: 'Es necesario mantener al menos una foto' }
```

### Cloudinary Configuration

**File:** `config/cloudinary.js`
```js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

### Environment Variables for Cloudinary

| Variable | Description |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Server Action Pattern

### Correct Signature (useFormState)

```js
// updateProperty.js — SERVER ACTION
async function updateProperty(prevState, formData) {
  // prevState: the previous useFormState value (initially {})
  // formData: the FormData from the HTML form
  const propertyId = formData.get('propertyId');
  // ...
}
```

### PropertyId Travel Pattern

```
Client:  <input type="hidden" name="propertyId" value={property._id} />
                                     │
                                     ▼
Server:  const propertyId = formData.get('propertyId');
```

**DO NOT** use `.bind()` to pass propertyId:
```js
// BROKEN — useFormState shifts arguments
const bound = updateProperty.bind(null, property._id);
useFormState(bound, {});
```

### Return Shape

```js
// SUCCESS — triggers window.location.href navigation
return { success: true, redirected: '/properties' };

// ERROR — triggers toast.error(state.error)
return { error: 'Mensaje de error descriptivo' };
```

**DO NOT** use `redirect()` from `next/navigation` — useFormState cannot reconcile thrown redirects.

---

## MongoDB Write Strategy

### Current Approach: `prop.set()` + `prop.save()`

```js
const prop = await Property.findById(propertyId);
prop.set({
  type: formData.get('type'),
  name: formData.get('name'),
  images: currentImages,
});
await prop.save();
```

### Number Cleaning

```js
const cleanNumber = (val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const num = parseFloat(val);
  return isNaN(num) ? undefined : num;
};
```

Empty number inputs submit `""` (empty string). Mongoose cannot cast `""` to `Number` → `CastError`. `cleanNumber` returns `undefined` for empty strings, which Mongoose ignores.

---

## Middleware & Authentication

### Middleware Bypass for Server Actions

```js
export default withAuth(
  function middleware(req) {
    // POST = server action → bypass auth (action handles it)
    if (req.method === 'POST') {
      return NextResponse.next();
    }
    // GET = page navigation → enforce auth
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.method === 'POST') return true;
        return !!token;
      },
    },
  }
);
```

### Session Retrieval

```js
export const getSessionUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    user: session.user,
    userId: session.user.id,
    role: session.user.role,
  };
};
```

---

## Common Pitfalls (Lessons Learned)

| # | Pitfall | Symptom | Root Cause | Fix |
|---|---------|---------|-----------|-----|
| 1 | `.bind()` with `useFormState` | Button stuck, no toast | 3-argument shift: `(boundId, prevState, formData)` | Hidden `<input>` for ID, proper `(prevState, formData)` signature |
| 2 | Blob files from `URL.createObjectURL` | Cloudinary ENOENT error | React sends `File(name: "blob", size: 0)` from preview URLs | Add `img.size > 0` to filter |
| 3 | `redirect()` with `useFormState` | Navigation fails | `redirect()` throws NEXT_REDIRECT error | Return `{ success: true, redirected: '...' }`, client uses `window.location.href` |
| 4 | `try/catch` wrapping `redirect()` | Generic error page | `redirect()` throws internally | Never wrap `redirect()` in try/catch |
| 5 | Empty rate strings → CastError | Mongoose cannot cast `""` to Number | Number inputs submit empty string when blank | `cleanNumber()` helper |
| 6 | `|| undefined` on zero values | `beds: 0` becomes `undefined` | `0` is falsy in JavaScript | Use `cleanNumber()` that checks `=== ''` explicitly |

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
- **Server Actions** for all mutations (add/update/delete/bookmark/message)
- **Dynamic rendering** (`force-dynamic`) on most pages to ensure fresh data
- **Singleton DB connection** via `connectDB` to avoid multiple connections
- **Image storage:** Cloudinary URLs only in MongoDB (no binary data)
- **CLAUDE.md rule:** never commit without `npm run build` passing first
