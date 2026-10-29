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
  - *Quirk de Despliegue*: Ocasionalmente, las integraciones de PRs vía API/CLI (ej. fast-forwards o merges silenciosos en GitHub) no disparan el webhook de Vercel. Si el código en producción no se actualiza tras un merge a `main`, se requiere empujar un commit vacío a `main` (`git commit --allow-empty -m "trigger: vercel production build"`) para forzar el despliegue automático.
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
4. **Almacenamiento de Despliegues en Vercel (Deployment Storage):** 
   - Vercel almacena para cada commit/deploy el código fuente, los artefactos estáticos (`public/`) y los bundles de funciones Serverless.
   - En septiembre 2026 se detectó un consumo acumulado de 18 GB en 23 despliegues debido a videos pesados no utilizados (~251 MB) e imágenes en `public/images/`.
   - Se purgaron 21 deploys obsoletos en Vercel CLI y se removieron de Git los archivos en desuso, reduciendo `public/` de 306 MB a 57 MB.
   - **Regla estricta:** No subir archivos de video o medios pesados a la carpeta `public/`. Los videos o assets de gran tamaño deben alojarse externamente (Cloudinary / CDN) o comprimirse rigurosamente para evitar inflar el tamaño de los snapshots de deployment.

## 7. Sistema de Generación de Historias para Redes (Story Engine)
- **Endpoint:** `/api/story/[id]` (soporta query `?template=...`).
- **Plantilla Predeterminada:** `rr-story-v2.2` (Story V2 Final con integración de WhatsApp y zonas seguras de Instagram).
- **Especificaciones Visuales e Identidad Gráfica:**
  - **Resolución:** 1080 × 1920 px (9:16 vertical nativo).
  - **Zonas Seguras (Safe Areas):**
    - Zona Superior (0 a 250 px): Protegida para la interfaz nativa de Instagram (barra de progreso, avatar, nombre de usuario y botón cerrar). El Header institucional queda enmarcado entre `top: 70px` y `top: 220px`.
    - Zona Inferior (1590 a 1920 px, margen de 330 px): Protegida para la barra de respuesta nativa de Instagram («Enviar mensaje», «Me gusta», «Compartir»). Todo el contenido editorial se sitúa por encima de los 330 px.
    - Zona de Sticker de Enlace: Entre `bottom: 330px` y el precio, reservando un área limpia y despejada para que el operador coloque el Sticker «Enlace» de Instagram sin tapar información crítica.
  - **Header Institucional:** Isotipo blanco oficial en alta definición con sombra, «SILVIA ROGGERO & ROMA» (PT Serif Bold, 38 px), descriptor «NEGOCIOS INMOBILIARIOS» (sans-serif bold, 24 px) y filete naranja con «ALTA GRACIA, CÓRDOBA · ARGENTINA».
  - **Etiquetas Dinámicas de Publicación:** Ubicadas en la zona superior izquierda (`top: 310px, left: 65px`), con formato rectangular (`borderRadius: 8px`), sombra y texto de alto contraste (26 px bold). Reflejan fielmente los datos reales del inmueble (`DESTACADA`, `APTO CRÉDITO`, `PRECIO MEJORADO`, `ACEPTA PERMUTA`, etc.).
  - **Iconos Oficiales del Sitio (Mosaic Dark):**
    - Reutilización de los SVGs originales (`ico_bed.svg`, `ico_bath.svg`, `ico_sqfoot.svg` y `LandPlot` de `lucide-react`) con grosor de trazo calibrado (`stroke-width: 1.8`) para renderizado nítido en alta resolución.
    - Separación explícita homogénea (`marginRight: 40px`).
    - Eliminación completa de ceros sueltos (`0`): validación estricta numérica y guardas booleanas que garantizan que inmuebles sin dormitorios/baños o con valor 0 solo muestren superficie de terreno sin campos fantasma.
  - **Precio:** Prominente y en renglón exclusivo en PT Serif Bold (`fontSize: 72px`), coloreado en naranja corporativo `#F26B2E`. Compatible con USD (`USD / U$D`), ARS (`$`) y propiedades sin precio informado (`Consultar`).
  - **Rediseño del CTA («CONSULTÁ POR WHATSAPP»):**
    - Se eliminó el gran botón gráfico falso «Ver más →» que prometía una interacción web inexistente en el PNG.
    - Se incorporó una barra orientativa elegante (`rgba(11, 13, 16, 0.65)` con borde `1.5px solid rgba(242, 107, 46, 0.75)` y `borderRadius: 16px`) con isotipo oficial de WhatsApp (`#25D366`), el texto `CONSULTÁ POR WHATSAPP` y la micro-guía `Tocá el sticker enlace o escribinos`, acompañada de un indicador sutil de flecha.
    - Si el operador agrega el sticker nativo, este se fusiona naturalmente con esta zona. Si no lo agrega, la pieza conserva un balance editorial completo y profesional.
- **Contacto por WhatsApp Contextualizado (`utils/whatsapp.js`):**
  - Número canónico internacional: `5493547563911` (`wa.me/5493547563911`).
  - Mensaje contextualizado con título, localidad y enlace canónico de la ficha pública:
    `Hola, estoy interesado en la propiedad [Nombre], [Localidad], publicada por Roggero & Roma. Quisiera recibir más información: https://roggeroyroma.com.ar/properties/[id]`
  - Codificación segura con `encodeURIComponent` sin caracteres rotos ni variables indefinidas.
- **Flujo Móvil de Dos Acciones (`StoryShareButton.jsx`):**
  - **Acción 1 (Preparar Historia):** Genera la imagen vía API, descarga el blob y genera el enlace contextualizado de WhatsApp. Intenta copiar automáticamente el enlace al portapapeles.
  - **Acción 2 (Compartir a Instagram):** Invoca la Web Share API (`navigator.share({ files: [fileToShare] })`) **sin incluir el parámetro `url`**, lo que garantiza que iOS Safari y Android Chrome abran directamente el editor de Historias de Instagram con la imagen cargada en el lienzo en lugar de degradar a compartir enlace de texto.
  - **Botón Explícito de Respaldo:** Proporciona el botón secundario «Copiar enlace de WhatsApp» con confirmación visual interactiva (`¡Enlace de WhatsApp Copiado!`), permitiendo al operador copiar o re-copiar el enlace en cualquier momento si el portapapeles automático fue bloqueado por políticas del navegador.
  - **Descarga Alternativa:** Si el navegador no soporta Web Share API, descarga el archivo PNG directamente al almacenamiento local del dispositivo.
- **Compatibilidad hacia atrás (Query params):**
  - Predeterminada (sin query, `template=v2.2`, `template=rr-story-v2.2`): Story V2 Final (WhatsApp CTA + Safe Areas).
  - `template=rr-story-v2.1`: Story V2.1.
  - `template=rr-story-v2`: Story V2.0.
  - `template=v1` o `template=legacy`: Plantilla clásica original V1.



## 8. Social Studio 2.9 con Retoque IA (Editor Social Exclusivo Superadmin)

- **Propósito:** Editor autónomo de composiciones para redes sociales de Roggero & Roma (5 piezas de Feed 1080×1350, 5 piezas de Historias 1080×1920 y 1 Portada Facebook 1702×630 / 851×315).
- **Ruta de Acceso:** [`/admin/social-studio`](file:///c:/Projects/property-pulse-nextjs/app/admin/social-studio/page.jsx).
- **Control de Acceso y Seguridad:**
  - Exclusivo para usuarios con rol `superadmin`.
  - Protegido en [`middleware.js`](file:///c:/Projects/property-pulse-nextjs/middleware.js) y validado en el Server Component vía `getServerSession(authOptions)`. Redirige a `/admin` ante intentos no autorizados.
  - Accesos en UI: tarjeta destacada en [`/admin`](file:///c:/Projects/property-pulse-nextjs/app/admin/page.jsx) (visible sólo para superadmin) y enlace directo en el sidebar de [`/superadmin`](file:///c:/Projects/property-pulse-nextjs/app/superadmin/layout.jsx).
- **Arquitectura de Aislamiento:**
  - El editor se almacena en `data/social-studio/Roggero_Roma_Social_Studio_2_9.html` (con inclusión explícita en `outputFileTracingIncludes` dentro de `next.config.mjs`) y se sirve a través de la ruta interna segura [`/admin/social-studio/embed`](file:///c:/Projects/property-pulse-nextjs/app/admin/social-studio/embed/route.js).
  - Montado en contenedor `fixed inset-0 z-[120]` en [`/admin/social-studio/page.jsx`](file:///c:/Projects/property-pulse-nextjs/app/admin/social-studio/page.jsx) para ocupar el 100% del viewport sin solaparse con el `Navbar` público, e integrado con tema oscuro completo (`#rrDarkTheme`).
  - Inyecta en el cliente `window.RR_AI_CONFIG = { enabled: true, endpoint: '/api/social-studio/retouch', copyEndpoint: '/api/social-studio/generate-copy' };`.
- **Backend de Retoque IA:**
  - Endpoint: [`/api/social-studio/retouch`](file:///c:/Projects/property-pulse-nextjs/app/api/social-studio/retouch/route.js) (`POST`, `multipart/form-data`).
  - Autenticación: Valida sesión `superadmin`.
  - Modelo: OpenAI `gpt-image-2.5-sunburst` (`images.edit`) sobre el lienzo fotográfico limpio con `size: 'auto'`, `quality: 'medium'`, `output_format: 'jpeg'` y `output_compression: 92`.
  - Prompt Dinámico y Enmascarado por Bloques Semánticos con Curva Gaussiana de 16 Paradas (`aiTightBoxes` + `aiDrawSoftBlock` + `aiCompositeLocalized`): El cliente mide el ancho real en píxeles de los textos (`measureText`) y agrupa las capas en 4 bloques semánticos (`Logo`, `Bloque de Títulos [category+title+accent]`, `Subtítulo [support]` y `Ubicación [location]`). Al recibir la imagen de `gpt-image-2.5-sunburst`, el editor la integra mediante una **curva Gaussiana real de 16 paradas (`exp(-3.1 * t²) * (1 - t)^1.5`)** de gran radio (`780–820px` de semieje horizontal y anclaje superior para el logo) sin anillos ni bordes ovalados visibles (sin Mach bands), aplicando una densidad central moderada (`46%–48%` de velo atmosférico sumado al gradiente suave de `gpt-image-2.5-sunburst`) **exclusivamente detrás de los títulos, subtítulo y logo**, conservando intacta la luminosidad del resto de la fotografía.
  - Difusión Ceñida a Líneas + Halo de Glifos (`aiTextDiffusion`, `AI_TXT_FX`): sobre el velo Gaussiano amplio, cada línea de texto recibe (1) una difusión oscura ceñida a su silueta (rectángulos acolchados + `blur` Gaussiano de `24–72px` según el tamaño de fuente) y (2) un halo suave pegado a los glifos (`blur` de `5–20px`). La densidad es mayor en el título medio (`title`: 50% / 62%) y en el acento naranja (`accent`: 60% / 74%), que son los de menor contraste sobre fondos claros. Incluye fallback sin `ctx.filter` (reducción + ampliación suavizada) para Safari antiguo. Como el efecto queda integrado en la foto, si se mueven los textos después de aprobar conviene revertir y volver a generar.
  - Optimización de Payload para Vercel: El cliente serializa los lienzos de subida en JPEG (`quality: 0.94`, ~700 KB totales) para respetar holgadamente el límite de 4.5 MB de funciones Serverless en Vercel.
  - Formato de respuesta: `{ imageDataUrl: "data:image/jpeg;base64,...", image_base64: "..." }`.
- **Integraciones adoptadas de Wolfim Visual Studio + Asistente de Copy OpenAI:**
  - **Copy Editorial / Caption con IA:** Modal interactivo (`📝 Copy Post`) con contador en tiempo real de caracteres y palabras, guardado en el estado de cada pieza, copiado al portapapeles y botón **«✨ Redactar con IA»** conectado a [`/api/social-studio/generate-copy`](file:///c:/Projects/property-pulse-nextjs/app/api/social-studio/generate-copy/route.js) (`OpenAI gpt-4o-mini` en español rioplatense).
  - **Zonas Seguras (Safe Zones):** Indicadores visuales calibrados para Instagram Stories y Facebook Cover.
  - **Preload determinista de tipografías:** Asegura carga completa de fuentes antes de la exportación a PNG/JPG.
