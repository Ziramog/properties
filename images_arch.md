# Almacenamiento de Imágenes — Roggero & Roma Inmobiliaria

## Resumen

El sitio utiliza **Cloudinary** como almacenamiento y CDN de imágenes para las propiedades.

---

## Stack

| Servicio | Uso |
|----------|-----|
| [Cloudinary](https://cloudinary.com) | Almacenamiento + CDN |
| `@/config/cloudinary.js` | Configuración de la conexión |
| MongoDB (`Property.images`) | Guarda las referencias a las imágenes |

---

## Modelo de datos

Las imágenes se guardan en MongoDB como un array de objetos, no como strings planos:

```js
// models/Property.js
images: [
  {
    url: { type: String, required: true },       // URL pública en Cloudinary
    public_id: { type: String, required: true }, // ID para eliminar/edición
  },
],
```

**Ejemplo en la base de datos:**
```json
{
  "images": [
    {
      "url": "https://res.cloudinary.com/xxx/image/upload/v1234/roggero-roma/properties/casona-achaval-11.jpg",
      "public_id": "roggero-roma/properties/casona-achaval-11"
    }
  ]
}
```

> El `public_id` es fundamental: sin él no se pueden eliminar imágenes de Cloudinary.

---

## Configuración de Cloudinary

```js
// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

Variables necesarias en `.env.local`:
```
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## Carpetas en Cloudinary

Las imágenes se organizan en la carpeta `roggero-roma/properties`.

---

## Cómo se suben las imágenes

### Server Actions

**`app/actions/addProperty.js`** — nuevas propiedades:
1. Recibe `FormData` con archivos de imagen
2. Convierte el buffer a dato binario
3. Sube a Cloudinary via `upload_stream` con opciones de optimización
4. Guarda `{ url, public_id }` en MongoDB

**`app/actions/updateProperty.js`** — edición de propiedad:
1. Si hay imágenes nuevas → sube a Cloudinary y agrega al array
2. Si hay imágenes eliminadas → usa `cloudinary.uploader.destroy(public_id)` para borrarlas de Cloudinary
3. Actualiza el array en MongoDB

**`app/actions/deleteProperty.js`** — eliminar propiedad:
1. Recupera todos los `public_id` de la propiedad
2. Hace `destroy()` de cada imagen en Cloudinary
3. Elimina el documento de MongoDB

---

## Optimización de imágenes

Las imágenes se suben con transformaciones automáticas:

```js
{
  folder: 'roggero-roma/properties',
  fetch_format: 'auto',  // WebP/AVIF automático según navegador
  quality: 'auto',       // Compresión automática
  width: 1200,          // Ancho máximo 1200px
  crop: 'limit',        // No enlarge
}
```

---

## URLs permitidas en Next.js

En `next.config.mjs` se configuran los dominios de donde Next.js puede cargar imágenes:

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com' },  // Cloudinary CDN
    { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatars
    { protocol: 'https', hostname: 'images.unsplash.com' }, // Fotos de stock
    { protocol: 'https', hostname: 'roggeroyroma.com.ar' }, // WP legacy (migrado)
    { protocol: 'https', hostname: 'via.placeholder.com' }, // Placeholders
  ],
},
```

---

## Componentes que usan imágenes

Todos leen `images[0]?.url` (no strings planos):

| Componente | Uso |
|------------|-----|
| `PropertyCard.jsx` | `images[0]?.url` — tarjeta en el listing |
| `FeaturedPropertyCard.jsx` | `images[0]?.url` — propiedad destacada |
| `PropertyImages.jsx` | `image.url` — galería completa con PhotoSwipe |
| `PropertyEditForm.jsx` | Muestra thumbnails, maneja eliminación |
| `MapProperties.jsx` | Sidebar con imagen de propiedad |
| `ProfileProperties.jsx` | Grid de propiedades del usuario |

---

## Migración desde WordPress

Las imágenes antiguas de `roggeroyroma.com.ar/wp-content/uploads/` fueron migradas a Cloudinary con el script `scripts/migrateWordpressToCloudinary.js`. El script:

1. Descarga cada imagen del servidor WordPress viejo
2. La sube a Cloudinary en la carpeta correcta
3. Reemplaza la URL en MongoDB por `{ url, public_id }`

---

##Notas

- No se almacenan imágenes en el repositorio ni en Vercel
- Las imágenes no se borran automáticamente al editar — el `updateProperty` se encarga
- El `public_id` incluye la carpeta: `roggero-roma/properties/nombre-archivo`