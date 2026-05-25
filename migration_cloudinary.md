# Cloudinary Migration — Roggero & Roma Inmobiliaria
> Plug-and-play instructions for DeepSeek v4 / OpenCode
> Execute every step in order. Do not skip sections.

---

## Context & Goal

**Project:** Next.js 14 App Router real estate site.
**Stack:** Next.js 14 · MongoDB/Mongoose · Cloudinary · NextAuth · Vercel.
**Root:** assume project root is the current working directory.

**Current problem:**
- `Property.images` is `[String]` storing old WordPress URLs like:
  `https://roggeroyroma.com.ar/wp-content/uploads/2021/09/CASONA-ACHAVAL-11.jpg`
- No `public_id` is stored, so Cloudinary images can never be deleted.
- `cloudinary.uploader.upload_stream` has arguments in the wrong order (options ignored).

**Target state after migration:**
- `Property.images` becomes `[{ url: String, public_id: String }]`
- All WordPress URLs replaced with Cloudinary URLs in MongoDB.
- All Server Actions fixed to upload correctly and clean up on delete.
- All components updated to read `img.url` instead of `img`.

---

## PHASE 0 — Preflight checks

### 0.1 Verify .env.local has all required keys

Open `.env.local` and confirm these five variables exist and are non-empty.
Do NOT print their values. Just assert they exist:

```
MONGODB_URI
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_DOMAIN
```

If any are missing, stop and ask the user to fill them in before continuing.

### 0.2 Install script dependencies (if needed)

```bash
node --version   # must be >= 18
```

The migration script uses only packages already in package.json
(`mongoose`, `cloudinary`). No new installs needed.

---

## PHASE 1 — Run the one-time database migration script

### 1.1 Create the script file

Create `scripts/migrateWordpressToCloudinary.js` with this exact content:

```js
/**
 * scripts/migrateWordpressToCloudinary.js
 * Safe to re-run — already-migrated documents are skipped.
 * Run: node --env-file=.env.local scripts/migrateWordpressToCloudinary.js
 */

import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const WORDPRESS_DOMAIN = 'roggeroyroma.com.ar';
const CLOUDINARY_FOLDER = 'roggero-roma/properties';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PropertySchema = new mongoose.Schema(
  { name: String, images: mongoose.Schema.Types.Mixed },
  { strict: false }
);
const Property =
  mongoose.models.Property || mongoose.model('Property', PropertySchema);

function isWordpress(img) {
  const url = typeof img === 'string' ? img : img?.url ?? '';
  return url.includes(WORDPRESS_DOMAIN);
}

function getUrl(img) {
  return typeof img === 'string' ? img : img?.url ?? '';
}

async function uploadToCloudinary(sourceUrl) {
  const result = await cloudinary.uploader.upload(sourceUrl, {
    folder:       CLOUDINARY_FOLDER,
    fetch_format: 'auto',
    quality:      'auto',
    width:        1200,
    crop:         'limit',
  });
  return { url: result.secure_url, public_id: result.public_id };
}

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const all        = await Property.find({});
  const toMigrate  = all.filter(
    (p) => Array.isArray(p.images) && p.images.some(isWordpress)
  );

  console.log(`Properties to migrate : ${toMigrate.length}`);
  console.log(`Already migrated      : ${all.length - toMigrate.length}\n`);

  let uploaded = 0;
  let failed   = 0;

  for (const prop of toMigrate) {
    console.log(`\n📦  "${prop.name}" (${prop._id})  [${prop.images.length} images]`);
    const next = [];

    for (let i = 0; i < prop.images.length; i++) {
      const img = prop.images[i];
      const url = getUrl(img);

      if (!isWordpress(img)) {
        next.push(img);
        console.log(`  [${i + 1}] ⏭  already Cloudinary — skipped`);
        continue;
      }

      try {
        const result = await uploadToCloudinary(url);
        next.push(result);
        uploaded++;
        console.log(`  [${i + 1}] ✅  ${url.split('/').pop()}`);
        console.log(`        → ${result.url}`);
      } catch (err) {
        next.push(img); // keep original so property stays visible
        failed++;
        console.error(`  [${i + 1}] ❌  FAILED: ${url}`);
        console.error(`        ${err.message}`);
      }
    }

    await Property.findByIdAndUpdate(prop._id, { images: next });
    console.log(`  💾  saved`);
  }

  console.log('\n──────────────────────────────');
  console.log(`Uploaded : ${uploaded}`);
  console.log(`Failed   : ${failed}`);
  if (failed > 0) console.log('Re-run the script to retry failed images.');

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
```

### 1.2 Add `"type": "module"` support for the script runner

Only needed if the project does not already have `"type": "module"` in `package.json`.
Check `package.json`:
- If `"type": "module"` exists → skip this step.
- If it does NOT exist → run the script with the CommonJS require shim below instead:

```bash
# CommonJS fallback — use only if "type":"module" is absent
node -e "
require('dotenv').config({ path: '.env.local' });
" --require dotenv/config scripts/migrateWordpressToCloudinary.js
```

For module projects (standard Next.js 14), run:

```bash
node --env-file=.env.local scripts/migrateWordpressToCloudinary.js
```

### 1.3 Run the migration

```bash
node --env-file=.env.local scripts/migrateWordpressToCloudinary.js
```

Expected output format:
```
✅ Connected to MongoDB

Properties to migrate : 37
Already migrated      : 0

📦  "Achaval Rodriguez 374" (69fa3b194acb27ba6ab44f08)  [21 images]
  [1] ✅  CASONA-ACHAVAL-11.jpg
       → https://res.cloudinary.com/xxx/image/upload/roggero-roma/properties/xxx.jpg
  ...

──────────────────────────────
Uploaded : 183
Failed   : 0
```

### 1.4 Verify migration in MongoDB

After the script finishes, query MongoDB to confirm the shape changed.
You can check in Atlas Data Explorer or run this aggregation:

```js
// Expected: firstImage should start with https://res.cloudinary.com
db.properties.aggregate([
  { $project: {
      name: 1,
      imageCount: { $size: "$images" },
      firstImageUrl: { $arrayElemAt: ["$images.url", 0] },
      firstImagePid: { $arrayElemAt: ["$images.public_id", 0] }
  }}
])
```

All `firstImageUrl` values must start with `https://res.cloudinary.com/`.
All `firstImagePid` values must be non-empty strings like `roggero-roma/properties/xxx`.

---

## PHASE 2 — Update the Mongoose schema

### 2.1 Edit `models/Property.js`

Find the `images` field and replace it:

```js
// BEFORE
images: [String],

// AFTER
images: [
  {
    url:       { type: String, required: true },
    public_id: { type: String, required: true },
  },
],
```

Do not change any other fields in the schema.

---

## PHASE 3 — Fix Server Actions

### 3.1 Fix `app/actions/addProperty.js`

#### 3.1.a — Fix the Buffer construction

Find:
```js
const imageArray = Array.from(new Uint8Array(imageBuffer));
const imageData = Buffer.from(imageArray);
```
Replace with:
```js
const imageData = Buffer.from(imageBuffer);
```

#### 3.1.b — Fix upload_stream argument order AND store public_id

Find the entire `upload_stream` Promise block (it looks like this):
```js
const result = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    (error, result) => error ? reject(error) : resolve(result),
    { folder: 'propertypulse' }
  );
  stream.write(imageData);
  stream.end();
});
currentImages.push(result.secure_url);
```

Replace with:
```js
const result = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'roggero-roma/properties', fetch_format: 'auto', quality: 'auto', width: 1200, crop: 'limit' },
    (error, result) => (error ? reject(error) : resolve(result))
  );
  stream.end(imageData);
});
currentImages.push({ url: result.secure_url, public_id: result.public_id });
```

#### 3.1.c — Add image count guard (after the newImageFiles filter line)

Find the line that filters new image files (something like):
```js
const newImageFiles = formData.getAll('images').filter(
  (img) => img && img.name && img.name !== '' && img.size > 0
);
```

Add immediately after it:
```js
if (newImageFiles.length > 10) {
  return { error: 'Máximo 10 imágenes por propiedad.' };
}
```

#### 3.1.d — Add revalidatePath before the return

Add at the top of the file if not already imported:
```js
import { revalidatePath } from 'next/cache';
```

Find the final `return { ... }` success statement and add before it:
```js
revalidatePath('/properties');
revalidatePath('/');
```

---

### 3.2 Fix `app/actions/updateProperty.js`

#### 3.2.a — Fix Buffer construction (same as 3.1.a above)

#### 3.2.b — Fix upload_stream (same as 3.1.b above)

#### 3.2.c — Add Cloudinary destroy for removed images

Find the section that filters removed images from the existing list. It will look roughly like:

```js
// Something like:
let currentImages = existingImages.filter(
  (img) => !removedImages.includes(img)
);
```

Replace with:

```js
// Destroy removed images from Cloudinary before filtering
const cloudinary = (await import('@/config/cloudinary')).default;
for (const removedUrl of removedImages) {
  const entry = existingImages.find(
    (img) => (typeof img === 'string' ? img : img.url) === removedUrl
  );
  if (entry?.public_id) {
    try {
      await cloudinary.uploader.destroy(entry.public_id);
    } catch (e) {
      console.error('Cloudinary destroy failed:', e.message);
    }
  }
}

let currentImages = existingImages.filter((img) => {
  const url = typeof img === 'string' ? img : img.url;
  return !removedImages.includes(url);
});
```

#### 3.2.d — Add revalidatePath (same pattern as 3.1.d, also include the property id)

```js
revalidatePath('/properties');
revalidatePath(`/properties/${propertyId}`);
revalidatePath('/profile');
```

---

### 3.3 Fix `app/actions/deleteProperty.js`

Find where the property is deleted. It will look something like:

```js
await Property.findByIdAndDelete(propertyId);
```

Replace with:

```js
// Destroy all images from Cloudinary first
const property = await Property.findById(propertyId);
if (property?.images?.length) {
  const cloudinary = (await import('@/config/cloudinary')).default;
  for (const img of property.images) {
    const pid = typeof img === 'string' ? null : img.public_id;
    if (pid) {
      try {
        await cloudinary.uploader.destroy(pid);
      } catch (e) {
        console.error('Cloudinary destroy failed:', e.message);
      }
    }
  }
}
await Property.findByIdAndDelete(propertyId);
```

Add revalidatePath after:
```js
revalidatePath('/properties');
revalidatePath('/profile');
```

---

## PHASE 4 — Update components that read images

All components below treat `images` as `[String]`. They must be updated to read `img.url`.

### 4.1 `components/PropertyCard.jsx`

Find every place that reads the first image. Typically:
```js
src={property.images[0]}
// or
src={images[0]}
```
Replace with:
```js
src={property.images[0]?.url ?? '/images/placeholder.jpg'}
// or
src={images[0]?.url ?? '/images/placeholder.jpg'}
```

### 4.2 `components/FeaturedPropertyCard.jsx`

Same pattern as 4.1 — find `images[0]` and replace with `images[0]?.url`.

### 4.3 `components/PropertyHeaderImage.jsx`

Find:
```js
src={property.images[0]}
```
Replace with:
```js
src={property.images[0]?.url ?? '/images/placeholder.jpg'}
```

### 4.4 `components/PropertyImages.jsx`

This component maps over all images for the PhotoSwipe gallery.

Find a `.map()` over images that uses the image directly as a string:
```js
property.images.map((image, index) => (
  // ... src={image} or href={image}
))
```

Replace all string usages inside the map with `image.url`:
```js
property.images.map((image, index) => (
  // ... src={image.url} href={image.url}
))
```

### 4.5 `components/ProfileProperties.jsx`

If it renders a thumbnail of the first property image, apply the same fix as 4.1.

### 4.6 `components/MapProperties.jsx` and `components/MapView.jsx`

If property cards inside the map panel use `property.images[0]`, apply fix 4.1.

---

## PHASE 5 — Update the image removal state in PropertyEditForm

### 5.1 `components/PropertyEditForm.jsx`

The removed images state tracks URLs. Ensure the `×` button pushes `img.url` (not the whole object) to `removedImages`:

Find:
```js
setRemovedImages([...removedImages, image])
// where `image` might be the whole object
```

Replace with:
```js
setRemovedImages([...removedImages, typeof image === 'string' ? image : image.url])
```

The existing images displayed should also read `.url`:
```js
// Display existing images
{existingImages.map((image, index) => (
  <div key={index}>
    <Image src={typeof image === 'string' ? image : image.url} ... />
    <button onClick={() =>
      setRemovedImages([...removedImages, typeof image === 'string' ? image : image.url])
    }>×</button>
  </div>
))}
```

---

## PHASE 6 — Update middleware (security fix)

### 6.1 `middleware.js`

Find the POST bypass:
```js
if (req.method === 'POST') return true;
// or
if (req.method === 'POST') { return NextResponse.next(); }
```

Replace with:
```js
if (req.method === 'POST' && req.headers.get('next-action')) return true;
// or in the middleware function body:
if (req.method === 'POST' && req.headers.get('next-action')) {
  return NextResponse.next();
}
```

Apply the same change in both locations inside `withAuth` (the function body and the `authorized` callback).

---

## PHASE 7 — Build verification

### 7.1 Run the build

```bash
npm run build
```

**Expected:** build completes with 0 errors.

Common errors after this migration and their fixes:

| Error | Cause | Fix |
|-------|-------|-----|
| `TypeError: Cannot read properties of undefined (reading 'url')` | A component still reads `images[0]` as string | Apply Phase 4 fix to that component |
| `Type 'string' is not assignable to type '{ url: string; public_id: string; }'` | TypeScript/prop-types mismatch | Update the type definition to match new shape |
| `CastError: Cast to string failed` | Mongoose schema still has `[String]` | Confirm Phase 2 was applied |

### 7.2 Test locally

```bash
npm run dev
```

Check:
1. Homepage → property cards show images correctly
2. `/properties` listing → all cards show images
3. `/properties/[id]` detail → gallery loads
4. Add a new property → images upload to Cloudinary (check Cloudinary dashboard: folder `roggero-roma/properties`)
5. Edit a property → remove an image → check Cloudinary dashboard confirms it was deleted
6. Delete a property → check Cloudinary dashboard confirms all its images were deleted

---

## PHASE 8 — Cleanup

### 8.1 Remove migration script from production bundle

The script file lives in `scripts/` and is never imported by Next.js, so it will not be bundled. No action needed — but you can delete it after confirming the migration succeeded:

```bash
rm scripts/migrateWordpressToCloudinary.js
```

### 8.2 Verify MongoDB storage dropped

In MongoDB Atlas → Metrics → Data Size — it should remain roughly the same (URLs are still tiny strings). The real gain is reliability (no WordPress dependency) and Cloudinary CDN delivery.

### 8.3 Verify Cloudinary usage

In Cloudinary Dashboard → Media Library → `roggero-roma/properties` — all migrated images should appear there, organized by property upload date.

---

## Summary of all files changed

| File | Change |
|------|--------|
| `scripts/migrateWordpressToCloudinary.js` | **NEW** — one-time DB migration script |
| `models/Property.js` | `images: [String]` → `images: [{ url, public_id }]` |
| `app/actions/addProperty.js` | Fix `upload_stream` args, Buffer, store `public_id`, add `revalidatePath` |
| `app/actions/updateProperty.js` | Same as above + `destroy()` removed images |
| `app/actions/deleteProperty.js` | `destroy()` all images before delete + `revalidatePath` |
| `components/PropertyCard.jsx` | `images[0]` → `images[0]?.url` |
| `components/FeaturedPropertyCard.jsx` | `images[0]` → `images[0]?.url` |
| `components/PropertyHeaderImage.jsx` | `images[0]` → `images[0]?.url` |
| `components/PropertyImages.jsx` | `image` → `image.url` in map |
| `components/ProfileProperties.jsx` | `images[0]` → `images[0]?.url` |
| `components/PropertyEditForm.jsx` | `removedImages` push and display use `.url` |
| `middleware.js` | POST bypass scoped to `next-action` header only |
