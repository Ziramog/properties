# Project Context: Roggero & Roma Inmobiliaria (Property Pulse 2.0)

## 1. Visión General
- **Tipo:** Aplicación Web Inmobiliaria (Real Estate).
- **Stack Tecnológico:** Next.js 14.2.4 (App Router), React 18, Tailwind CSS, MongoDB + Mongoose.
- **Autenticación:** NextAuth.js (con Google OAuth).
- **Integraciones Principales:** Cloudinary (gestión de imágenes), Mapbox / Leaflet / Vis.gl (mapas), OpenAI / DeepSeek (integraciones de IA), Vercel Blob.
- **Arquitectura:** Basada fuertemente en **Server Actions** en lugar de API Routes tradicionales.
- **Diseño:** Temática de la agencia "Roggero & Roma" en Alta Gracia, Córdoba.

## 2. Estado del Repositorio (Git)
- **Rama Actual:** `dev` (sincronizada con `origin/dev`).
- **Remotes:** `origin` y `properties` apuntan a `https://github.com/Ziramog/properties.git`.
- **Últimos Commits:** 
  - Correcciones en el panel de administrador (filtros, roles).
  - Ajustes de UI en mapas (clusterizado pixelado).
  - Implementación de etiquetas automáticas y de expiración ("AMOBLADA", "NUEVA").
- **Archivos Modificados (Sin staging):** `scripts/backup-cloudinary.js`.
- **Archivos Untracked:** `test_featured.mjs`, `test_stats.mjs` y la carpeta `scratch/`, indicando pruebas locales recientes.

## 3. Scripts y Comandos (`package.json`)
- `npm run dev`: Inicia el entorno de desarrollo.
- `npm run build`: Genera la build de producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run lint`: Ejecuta el linter.

## 4. Configuración y Despliegue
- **Vercel:** Desplegado en Vercel. El archivo `vercel.json` contiene un Cron Job (`/api/cron/sync-reviews`) que se ejecuta a diario a las 06:00.
- **Next.js (`next.config.mjs`):** 
  - Imágenes desoptimizadas (`unoptimized: true`) y dominios configurados (Cloudinary, Google, Unsplash, dominio propio).
  - El límite de tamaño para Server Actions (`bodySizeLimit`) se ha ampliado a `20mb`, presumiblemente por la carga múltiple de imágenes.
- **Variables de Entorno Requeridas (`.env-example`):**
  - Base de Datos: `MONGODB_URI`
  - Autenticación: `GOOGLE_CLIENT_ID/SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
  - Multimedia: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY/SECRET`
  - Mapas: `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - IA: `DEEPSEEK_API_KEY`

## 5. Arquitectura de Carpetas Destacada
- `app/`: Contiene las rutas (incluyendo `admin`, `superadmin`, `google-maps-pilot`), layouts globales y la carpeta `actions/`.
- `components/`: Gran cantidad de componentes de UI (Hero, Carousels, Forms) y utilidades SEO.
- `models/`: Esquemas de Mongoose que revelan un sistema mucho más amplio que solo propiedades. Incluye: `Property`, `User`, `Message`, además de **Módulos Transaccionales/CRM** (`Quotation`, `Quote`, `Payment`, `Subscriber`), **Gestión de Marca** (`Review`, `BusinessInfo`, `SiteConfig`) y **Analítica** (`SearchTerm`).
- Raíz: Numerosos scripts sueltos y archivos de auditoría/migración que evidencian tareas de mantenimiento de la base de datos.

## 6. Problemas Pendientes y Riesgos Visibles
1. **Rendimiento / Límites de Vercel:** Existe una rama remota llamada `optimize-vercel-cpu-stage1`, lo cual sugiere fuertemente que la app ha enfrentado límites de CPU en Vercel. Esto podría deberse a Server Actions pesadas, serialización de objetos grandes de Mongoose, o un mal uso de las imágenes.
2. **Archivos de Prueba y Scripts Locales:** Hay varios scripts en la raíz (`test_*.mjs`, `check*.js`, `audit*.js`) y archivos modificados sin comitear (`backup-cloudinary.js`). Esto puede causar confusión sobre cuál es el estado real de la base de datos o si hay migraciones en curso.
3. **Decisión Arquitectónica (Imágenes - Client-side Upload):** En `next.config.mjs`, se definió `unoptimized: true` de manera **intencional**. La arquitectura actual utiliza la librería `browser-image-compression` directamente en el navegador del usuario (archivos `PropertyAddForm.jsx` y `PropertyEditForm.jsx`). 
   - Las imágenes se reducen en el frontend a un máximo de **1600px de ancho/alto** y **0.6 MB**.
   - Luego, se envían directamente desde el navegador a **Cloudinary** usando un _upload preset unsigned_.
   - Las _Server Actions_ (`addProperty`, `updateProperty`) solo reciben las URLs finales, evadiendo por completo la carga binaria en Vercel.
   - Volver a activar la optimización de Next.js o permitir la subida binaria al servidor podría disparar los límites y el consumo de CPU en Vercel (implementado originalmente en el commit `b24637f`). Queda estrictamente prohibido revertir este pipeline sin análisis previo.
