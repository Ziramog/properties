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



## 7.B. Sistema de Carrusel de Feed de 7 Imágenes (Feed Engine 4:5)

- **Endpoint:** [`/api/feed/[id]`](file:///c:/Projects/property-pulse-nextjs/app/api/feed/%5Bid%5D/route.jsx) (`GET` y `POST` con `?index=0..6`).
- **Formato Canónico:** **Portrait 4:5 nativo (`1080 × 1350 px`)** unificado en las 7 láminas del carrusel.
- **Unificación Geométrica y de Difusión entre Portada (`index = 0`) y Láminas Secundarias (`index = 1..6`):**
  - **Cero bandas negras muertas en la Portada:** Se eliminaron los márgenes muertos de `145px` de la Portada (`index = 0`): el isologo blanco se ancla en `top: 64px` y el bloque editorial inferior cierra en `bottom: 58px`. Las secundarias conservan la zona segura central (ver abajo).
  - **Corrección matemática de gradientes en Satori (`0% -> 100%` del contenedor):**
    - En **Portada (`index = 0`)**: el overlay superior ocupa `height: 28%` (`378px`, `rgba(11,13,16,0.78) 0% -> 0 100%`) y el inferior `height: 46%` (`621px`, `rgba(11,13,16,0.88) 0% -> 0 100%`), eliminando el bloque negro sólido de `235px` al pie.
    - En **Secundarias (`index = 1..6`)**: el overlay superior ocupa `height: 34%` (`459px`, `rgba(11,13,16,0.70) 0% -> 0 100%`) y el inferior `height: 34%` (`459px`, `rgba(11,13,16,0.78) 0% -> 0 100%`). Se corrigió el bug donde `transparent 32%` dentro de un `div` de `height: 32%` extinguía el degradado a los `138px` antes de llegar al logo y al título.
  - **Zona Segura Central en Secundarias (`index = 1..6`) — decisión del 2026-10-29:** al publicar con `Compartir → Instagram → Feed`, la extensión de Instagram recorta las láminas 2–7 a 1:1 (quita `135px` arriba y abajo) mientras la 1 queda en 4:5 (caso real: propiedad Las Pircas, captura `5/7`). Por eso en las secundarias el isologo se ubica en `top: 145px` y el título/ubicación con `padding-bottom: 145px`, de modo que sigan visibles con recorte 1:1 o sin él. La Portada (`index = 0`) se mantiene en `top: 64px` / `bottom: 58px` porque Instagram la conserva en 4:5. **No volver a mover las secundarias a `64px` sin resolver antes el recorte de Instagram.** Se descartó pasar el carrusel a 1:1: el estándar visual de Roggero & Roma es 4:5.
  - **Formato de entrega:** [`utils/convertBlobToJpeg.js`](file:///c:/Projects/property-pulse-nextjs/utils/convertBlobToJpeg.js) convierte en el navegador el PNG de Satori a **JPEG sRGB `1080 × 1350`** (calidad `0.92`, `carrusel-N.jpg`) antes de `navigator.share`; si falla, cae al PNG original.
  - **Detección Precisa de Inmuebles Edificados vs Terrenos (`isLand`):** Inmuebles con tipo edificado (`Casa`, `Departamento`, `Duplex`, etc.) o con dormitorios, baños o superficie cubierta (`beds > 0`, `baths > 0`, `covered_area > 0`) se marcan estrictamente como edificados (`isBuiltType = true`, `isLand = false`). Esto previene que títulos como «Casa en Lote 25 Mza. 477...» activen por error la regla de terrenos baldíos y oculten las características residenciales en Feed y Story.
- **Estabilidad de Recorte `1080 × 1350` en Móviles ([`utils/processImageInBrowser.js`](file:///c:/Projects/property-pulse-nextjs/utils/processImageInBrowser.js) y [`components/FeedShareButton.jsx`](file:///c:/Projects/property-pulse-nextjs/components/FeedShareButton.jsx)):**
  - Al generar 7 imágenes consecutivas en dispositivos móviles (especialmente iOS Safari / WebKit), [`processImageInBrowser`](file:///c:/Projects/property-pulse-nextjs/utils/processImageInBrowser.js) libera explícitamente la memoria de GPU/RAM tras cada exportación (`ctx.clearRect`, `canvas.width = 0`, `canvas.height = 0`, `img.src = ''`), incluye un reintento automático con pausa de `120ms` ante fallos de asignación y añade una pausa de `40ms` entre iteraciones en [`FeedShareButton.jsx`](file:///c:/Projects/property-pulse-nextjs/components/FeedShareButton.jsx).
  - Además, el `<img />` de fondo en Satori declara dimensiones explícitas `width={1080} height={1350}` con `objectFit: 'cover'` para garantizar que incluso ante un eventual fallback al servidor las 7 láminas mantengan exactamente la relación `1080 × 1350` sin cambios de encuadre entre la foto 2 y la 3.

## 8. Social Studio 2.9 con Retoque IA (Editor Social para Superadmin y Franco Roma)

- **Propósito:** Suite de **Social Media Development** y editor autónomo de composiciones para redes sociales de Roggero & Roma (5 piezas de Feed 1080×1350, 5 piezas de Historias 1080×1920 y 1 Portada Facebook 1702×630 / 851×315).
- **Identidad de Marca:** Logotipo institucional de Social Studio (cámara social estilizada en naranja corporativo) y subtítulo «Social Media Development» en la barra superior del editor y en el header de Next.js.
- **Ruta de Acceso:** [`/admin/social-studio`](file:///c:/Projects/property-pulse-nextjs/app/admin/social-studio/page.jsx).
- **Control de Acceso y Seguridad ([`utils/socialStudioAuth.js`](file:///c:/Projects/property-pulse-nextjs/utils/socialStudioAuth.js)):**
  - Acceso reservado para usuarios con rol `superadmin` y específicamente habilitado en modo `admin` exclusivamente para Franco Roma (`franeroma@gmail.com`). Los demás administradores o clientes regulares no tienen acceso.
  - Protegido en [`middleware.js`](file:///c:/Projects/property-pulse-nextjs/middleware.js) y validado en el Server Component vía `isSocialStudioAuthorized(session)`. Redirige a `/admin` ante intentos no autorizados.
  - Accesos en UI: tarjeta destacada en [`/admin`](file:///c:/Projects/property-pulse-nextjs/app/admin/page.jsx) (visible para superadmin y Franco Roma) y enlace directo en el sidebar de [`/superadmin`](file:///c:/Projects/property-pulse-nextjs/app/superadmin/layout.jsx).
- **Arquitectura de Aislamiento:**
  - El editor se almacena en `data/social-studio/Roggero_Roma_Social_Studio_2_9.html` (con inclusión explícita en `outputFileTracingIncludes` dentro de `next.config.mjs`) y se sirve a través de la ruta interna segura [`/admin/social-studio/embed`](file:///c:/Projects/property-pulse-nextjs/app/admin/social-studio/embed/route.js).
  - Montado en contenedor `fixed inset-0 z-[120]` en [`/admin/social-studio/page.jsx`](file:///c:/Projects/property-pulse-nextjs/app/admin/social-studio/page.jsx) para ocupar el 100% del viewport sin solaparse con el `Navbar` público, e integrado con tema oscuro completo (`#rrDarkTheme`). Muestra dinámicamente badge de rol `Superadmin` o `Admin` según el usuario activo.
  - Inyecta en el cliente `window.RR_AI_CONFIG = { enabled: true, endpoint: '/api/social-studio/retouch', copyEndpoint: '/api/social-studio/generate-copy' };`.
- **Backend de Retoque IA:**
  - Endpoint: [`/api/social-studio/retouch`](file:///c:/Projects/property-pulse-nextjs/app/api/social-studio/retouch/route.js) (`POST`, `multipart/form-data`).
  - Autenticación: Valida sesión autorizada mediante `isSocialStudioAuthorized(session)`.
  - Modelo: OpenAI `gpt-image-2.5-sunburst` (`images.edit`) sobre el lienzo fotográfico limpio con `size: 'auto'`, `quality: 'medium'`, `output_format: 'jpeg'` y `output_compression: 92`.
  - Prompt Dinámico y Enmascarado por Bloques Semánticos con Curva Gaussiana de 16 Paradas (`aiTightBoxes` + `aiDrawSoftBlock` + `aiCompositeLocalized`): El cliente mide el ancho real en píxeles de los textos (`measureText`) y agrupa las capas en 4 bloques semánticos (`Logo`, `Bloque de Títulos [category+title+accent]`, `Subtítulo [support]` y `Ubicación [location]`). Al recibir la imagen de `gpt-image-2.5-sunburst`, el editor la integra mediante una **curva Gaussiana real de 16 paradas (`exp(-3.1 * t²) * (1 - t)^1.5`)** de gran radio (`780–820px` de semieje horizontal y anclaje superior para el logo) sin anillos ni bordes ovalados visibles (sin Mach bands), aplicando una densidad central moderada (`46%–48%` de velo atmosférico sumado al gradiente suave de `gpt-image-2.5-sunburst`) **exclusivamente detrás de los títulos, subtítulo y logo**, conservando intacta la luminosidad del resto de la fotografía.
  - Difusión Ceñida a Líneas + Halo de Glifos (`aiTextDiffusion`, `AI_TXT_FX`): sobre el velo Gaussiano amplio, cada línea de texto recibe (1) una difusión oscura ceñida a su silueta (rectángulos acolchados + `blur` Gaussiano de `24–72px` según el tamaño de fuente) y (2) un halo suave pegado a los glifos (`blur` de `5–20px`). La densidad es mayor en el título medio (`title`: 50% / 62%) y en el acento naranja (`accent`: 60% / 74%), que son los de menor contraste sobre fondos claros. Incluye fallback sin `ctx.filter` (reducción + ampliación suavizada) para Safari antiguo. Como el efecto queda integrado en la foto, si se mueven los textos después de aprobar conviene revertir y volver a generar.
  - Optimización de Payload para Vercel: El cliente serializa los lienzos de subida en JPEG (`quality: 0.94`, ~700 KB totales) para respetar holgadamente el límite de 4.5 MB de funciones Serverless en Vercel.
  - Formato de respuesta y Telemetría de Consumo (`calculateConsumption` + `aiMetricsMarkup`): Devuelve `{ imageDataUrl, image_base64, metrics: { durationMs, durationSec, tokens: { total, input, output, textInput, imageInput, isExact }, costUSD, costFormatted } }`. Registra en los logs de Vercel y expone en el panel del editor el desglose exacto de tokens (tarifas `gpt-image-2.5-sunburst`: \$5/1M texto in, \$8/1M imagen in, \$30/1M imagen out), costo estimado por conversión (~0.017 USD) y latencia en segundos, tanto en la propuesta como en el estado de retoque activo.
- **Integraciones adoptadas de Wolfim Visual Studio + Asistente de Copy OpenAI:**
  - **Copy Editorial / Caption con IA:** Modal interactivo (`📝 Copy Post`) con contador en tiempo real de caracteres y palabras, guardado en el estado de cada pieza, copiado al portapapeles y botón **«✨ Redactar con IA»** conectado a [`/api/social-studio/generate-copy`](file:///c:/Projects/property-pulse-nextjs/app/api/social-studio/generate-copy/route.js) (`OpenAI gpt-4o-mini` en español rioplatense).
  - **Zonas Seguras (Safe Zones):** Indicadores visuales calibrados para Instagram Stories y Facebook Cover.
  - **Preload determinista de tipografías:** Asegura carga completa de fuentes antes de la exportación a PNG/JPG.
  - **Mejoras Editoriales y Controles Avanzados (Social Studio 2.9+):**
    - **Interlineado tipográfico regulable (`lineHeight`):** Slider continuo (`0.8` a `2.5`, por defecto `1.15` y `1.1` en ubicación) en el inspector y panel de capas. Sincronizado automáticamente con el renderizado Canvas, cálculo de altura (`heightFor`) y las cajas semánticas de difusión por IA (`aiTightBoxes` / `aiTextRuns`).
    - **Exportación de proyecto con timestamp:** `saveJson()` genera nombres dinámicos con fecha y hora local (`Roggero_Roma_Social_Studio_Proyecto_YYYY-MM-DD_HHhMMm.json`) para facilitar versionado y respaldos cronológicos.
    - **Gestión de color y propagación por clase:** Barra de herramientas de color con copiado al portapapeles (`📋 Copiar`), pegado (`📌 Pegar`) y botón directo `⚡ Aplicar a todos` (`apply-class`) que propaga el color seleccionado a todas las capas de la misma clase (ej. todos los acentos, títulos o CTAs) a lo largo de las 11 piezas del estudio.
    - **Dimensionamiento interactivo de CTA:** Sliders para ajustar ancho (`width`), alto (`height`) y tamaño de texto (`size`) del botón CTA con lectura de píxeles en tiempo real tanto en el inspector rápido como en el panel de capas.
    - **Justificación de texto en Canvas:** Soporte de alineación completa (`align: 'justify'`) con cálculo tipográfico de distribución de espacios entre palabras en líneas intermedias (`linesWithMeta`), manteniendo sangría natural a la izquierda en la última línea del párrafo o líneas cortas (<70% del ancho) para evitar distorsiones visuales. Incluye botón Justificar (`≣`) en el selector de alineación.
    - **Control total de Nube de Contraste para textos y renderizado protegido bajo textos:** Arquitectura de renderizado en dos fases (`drawLayerCloud` y `drawLayerContent`) que garantiza que todos los contrast overlays y nubes se dibujen siempre por debajo de cualquier texto, botón CTA o logotipo, impidiendo que el overlay del texto principal cubra o ensombrezca textos secundarios independientemente del orden de las capas. Panel dedicado (`.cloud-control-card`) con 6 parámetros interactivos: Intensidad / Opacidad (`cloud`, `0%` a `100%`), Dispersión (`cloudSpread`, `0%` a `100%`, regulando la concentración en el núcleo vs difusión suave sin agrandar ni achicar la nube), Ancho horizontal (`cloudWidth`, `0.2×` a `3.0×`), Alto vertical (`cloudHeight`, `0.2×` a `3.0×`), Desplazamiento horizontal (`cloudX`, `-600` a `+600 px`) y Desplazamiento vertical (`cloudY`, `-400` a `+400 px`). Incorpora botón de auto-encuadre `🎯 Ajustar al texto` con amortiguación suave según la alineación (`left`, `center`, `right`, `justify`), botón `↺ Restablecer`, y propagación global `⚡ A todos` entre las 11 piezas. Gradiente calibrado en 4 paradas paramétricas para máxima legibilidad tipográfica y transición orgánica hacia la foto.
    - **Optimización y reestructuración UI de navegación (Social Studio 2.9):** Implementación completa del plan [`docs/plans/social-studio-ui-optimization.md`](file:///c:/Projects/property-pulse-nextjs/docs/plans/social-studio-ui-optimization.md) eliminando 15 puntos de acceso duplicados. Topbar simplificada a 5 controles canónicos con menú desplegable «Proyecto ▾» (Abrir/Guardar JSON con timestamp). Toolbar del lienzo reestructurada en dos grupos («Modo»: Capas, Mover foto, Recentrar, slider de zoom sincronizado; y «Vista»: Guías, Cuadrícula y toggle 1:1/4:5). Rail lateral reducido de 7 a 4 accesos esenciales (Feed, Historias, Portada Facebook y Biblioteca de fotos con botón de restaurar distribución al pie). Inspector simplificado de 5 a 4 pestañas canónicas (`Capas` contextual con selección y alineación sin redundancias, `Fondo` colapsable mediante `<details>` para carga, reutilización FB, filtros y los 4 overlays, `Marca` para identidad `#F26B2E`, logo y tipografías oficiales, y `Retoque IA`). Wrapper Next.js adelgazado a 36px con acento corporativo `#F26B2E`.
    - **Naranja corporativo canónico y plantilla de carga (`#F26B2E`):** Estandarización de la identidad al naranja corporativo oficial de Roggero & Roma (`#F26B2E` · RGB 242, 107, 46) en variables CSS, botones y capas de acento/CTA. Integración del proyecto base actualizado `Roggero_Roma_Social_Studio_Proyecto_2026-11-03_16h47m.json` en `#rrPreload`, donde las 5 historias activas (fotos, textos, nubes de contraste y alineaciones) fueron adaptadas y replicadas correlativamente a los 5 feeds con calibración tipográfica y espaciado vertical armónico para formato 4:5. Los assets se optimizaron a los 5 recursos fotográficos activos + logotipo (~2.0 MB JSON) para prevenir límites serverless.
    - **Calibración sutil de difusión y retoque IA bajo demanda:** Recalibración del pipeline de difusión localizada y adecuación de títulos para evitar oscurecimientos excesivos. Los factores de opacidad de silueta (`plate`) y halo se redujeron de valores saturados (0.50-0.74, que producían hasta 95% de sombra acumulada) a un estándar editorial sutil (0.12-0.28, ~50% de contraste equilibrado en el núcleo), preservando la luminosidad, cielos y texturas de la fotografía arquitectónica. Se incorporó slider continuo `Sutileza / Intensidad del retoque` (10% a 75%, 35% por defecto) con recomposición en tiempo real en el visor antes/después sin coste adicional de tokens ni latencia de API, prompt de OpenAI refinado (`20% a 30% subtle luminous tonal depth`) y conservación del buffer original para ajustes dinámicos.
    - **Exportación en lote ZIP para Historias (1080 × 1920):** Habilitación de descarga en lote para las 5 historias completas (`Roggero_Roma_Historias_5_Piezas.zip`) desde el menú superior de exportación (`ZIP · 5 Historias (9:16)`), disponible tanto en Historias Studio como en Feed Studio. Incluye validación de fotos en piezas 6..10 (`canExport([6..10])`), renderizado de lienzos verticales 9:16 a 1080 × 1920 px sin cortes y nomenclatura canónica limpia (`RR_Historia_01_Institucional_9x16.png`, etc.) con coexistencia directa junto al exportador de 5 publicaciones de Feed (`Roggero_Roma_Feed_5_Piezas.zip`).
    - **Opciones avanzadas para CTA (Transición fluida Botón ↔ Línea fina y supresión total de texto/flecha):** Refinamiento integral del elemento CTA para permitir que el botón se reduzca de manera continua hasta conformar una **línea bien fina** (slider de grosor/alto de `1 px` a `180 px`, con presets de `2 px`, `4 px`, `10 px`, `55 px` y `75 px`), renderizando como línea horizontal nítida sin curvatura (`fillRect`) en espesores `<= 3 px` y con remate suave en grosores mayores. Se implementó la supresión absoluta de textos, flechas (`→`) o símbolos huérfanos siempre que el campo de texto esté vacío o se pulse el botón `✕ Eliminar texto y flecha`, además de incluir interruptores independientes para `Mostrar texto en el botón` y `Incluir flecha (→)`. Incorpora presets rápidos de ancho (`120 px`, `350 px`, `700 px`, `Ancho total`), sliders continuos y numéricos para coordenadas `X` e `Y`, alineación rápida (`Izquierda`, `Centrar X`, `Derecha`), hitbox ampliada para arrastre directo en el lienzo y replicación global con `⚡ Replicar formato a todas las piezas`.
