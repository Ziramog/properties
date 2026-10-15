# Sistema de Publicación y Redes Sociales — Roggero & Roma

> **Documento de Arquitectura y Referencia Técnica**  
> Proyecto: Property Pulse 2.0 (Next.js 14 App Router, MongoDB, Cloudinary, Satori/ImageResponse)  
> Archivo generado: `redes.md`

---

## 1. Visión General

El sistema de publicación y redes de **Roggero & Roma** está compuesto por tres capas integradas:

1. **Motor Dinámico de Piezas Gráficas (Server-Side Graphics Engine)**: Generación en tiempo de ejecución de imágenes publicitarias de alta calidad en formato Historia (9:16) y Carrusel de Feed (4:5) utilizando [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response) de `next/og` (basado en Satori y Node.js).
2. **Distribución y Compartido Móvil Nativo (Web Share API & Social Sharing)**: Empaquetado en memoria de imágenes (`Blob` → `File`), generación automática de copies/captions para Instagram con portapapeles asistido y deep-linking directo hacia aplicaciones móviles y redes sociales.
3. **Ciclo de Vida de Publicación Web (Publishing & Visibility Lifecycle)**: Control granular desde el panel de administración para publicar u ocultar inmuebles al público, destacar propiedades, sincronizar caché (`revalidatePath`) e inyectar metadatos OpenGraph/Twitter Cards dinámicos para previsualizaciones enriquecidas en chats y redes.

---

## 2. Capacidades Actuales (Qué es capaz de hacer hoy)

### A. Generación y Difusión de Historias (Stories)
- **Formato Vertical**: Resolución exacta de **1080 × 1920 px** (relación 9:16), estándar para Instagram Stories, Facebook Stories y estados de WhatsApp.
- **Diseño Editorial Inmersivo**:
  - Imagen principal de la propiedad en full-screen (`object-fit: cover`).
  - Degradados superior e inferior para garantizar legibilidad.
  - Isotipo oficial de Roggero & Roma en alta definición con sombra proyectada.
  - Badge de operación en tono corporativo (`VENTA` o `ALQUILER`).
  - Tipografía destacada con precio formateado en dólares o pesos.
  - Chips de especificaciones: Superficie (`m² cub` o `m² tot`), cantidad de dormitorios y baños.
  - Watermark y marca `roggeroyroma.com.ar`.
- **Publicación con un Clic**:
  - En móviles compatibles (iOS/Android): utiliza la **Web Share API Nivel 2** para abrir la hoja de compartir del sistema operativo y enviar la imagen directamente a Instagram Stories u otras apps.
  - En navegadores de escritorio (fallback): descarga automáticamente la imagen en formato PNG (`roggero-roma-[id]-story.png`).

### B. Generación de Carruseles para Feed de Instagram
- **Formato Vertical de Feed**: Resolución optimizada de **1080 × 1350 px** (relación 4:5), el formato con mayor retención visual en el feed de Instagram.
- **Armado de Multi-Slides (hasta 7 fotos)**:
  - **Slide 0 (Portada)**: Presenta la foto de portada con el isotipo de la marca, badge de estado, tipografía gigante de precio, dirección, localidad e íconos vectoriales SVG de camas, baños y metros cuadrados.
  - **Slides 1 a 6 (Interiores y Exteriores)**: Fotos secundarias limpias, manteniendo el branding con el isotipo R&R centrado y gradiente superior sutil para no tapar los detalles arquitectónicos.
- **Generación Automatizada de Copy / Caption**:
  - Redacta de forma autónoma el texto del post con emojis:
    ```text
    🏠 [Título] en [OPERACIÓN]
    📍 [Localidad, Provincia]
    💰 [Precio formateado]

    ✨ Características:
    📐 [Superficie] m² cub | 🛏️ [N] Dormitorios | 🛁 [N] Baños

    📝 [Descripción resumida a 400 caracteres]...

    🔗 Más info en roggeroyroma.com.ar
    #BienesRaices #Inmobiliaria #RoggeroYRoma #[Ciudad]
    ```
  - **Copia Automática al Portapapeles**: Como Instagram en móviles suele ignorar el texto (`text`) al compartir múltiples archivos por Web Share API, el sistema copia el caption completo al portapapeles del dispositivo y notifica al usuario con un toast (`toast.info`).
  - **Empaquetado Multi-Archivo**: Genera el array de `File[]` y lo envía en un único intent nativo a Instagram.

### C. Botones de Compartido Social Rápido (Público General)
- Ubicados en la ficha de cada propiedad para todos los usuarios visitantes.
- Conexión directa mediante URLs estructuradas:
  - **WhatsApp**: Link con texto y URL predefinida.
  - **Facebook**: `sharer.php?u=...`
  - **Twitter / X**: `twitter.com/intent/tweet?url=...&text=...`
  - **LinkedIn**: `linkedin.com/sharing/share-offsite/?url=...`

### D. Enlaces Inteligentes de WhatsApp (Deep Linking)
- Centralizado en [`utils/whatsapp.js`](file:///c:/Projects/property-pulse-nextjs/utils/whatsapp.js).
- Mensajes preconfigurados según el punto de entrada:
  - Consulta puntual de propiedad con enlace canónico y título.
  - Mensaje de captación para vendedores / tasaciones.
  - Mensaje para interesados en alquileres.
  - Consulta general desde el botón flotante.

### E. Open Graph & Twitter Cards Dinámicos (Previsualización en Chats)
- Configurado en [`generateMetadata`](file:///c:/Projects/property-pulse-nextjs/app/properties/[id]/page.jsx#L31-L66).
- Al compartir un enlace en WhatsApp, Telegram, iMessage o redes, la app inyecta:
  - `og:title` y `og:description` optimizados con tipo, operación, precio y localidad.
  - `og:image` con la foto principal alojada en Cloudinary.
  - `twitter:card: 'summary_large_image'`.

### F. Control de Publicación y Visibilidad Web
- Atributo `is_published` en [`models/Property.js`](file:///c:/Projects/property-pulse-nextjs/models/Property.js#L89-L92):
  - Permite ocultar propiedades vendidas, reservadas o en revisión técnica sin eliminarlas de la base de datos.
  - El catálogo público (`/properties`), la Home (`/`) y la generación estática (`generateStaticParams`) filtran estrictamente `{ is_published: { $ne: false } }`.
  - Conmutador en vivo desde la tabla de administración (`/admin/properties`) mediante llamada asíncrona a `/api/admin/toggle-published`.

### G. Sistema Cinematográfico de Video para Redes (Cinematic Capture)
- Submódulo en [`cinematic-capture/`](file:///c:/Projects/property-pulse-nextjs/cinematic-capture/README.md).
- Utiliza **Puppeteer + Chrome DevTools Protocol (CDP) + FFmpeg** para filmar recorridos y paneos cinemáticos a 60 FPS con curvas de aceleración arquitectónicas (`cinematic`, `easeOutExpo`).
- Permite renderizar clips en 1920×1080 o 1080×1920 para Reels / TikTok / YouTube Shorts.

---

## 3. Lógica y Flujos de Funcionamiento

```mermaid
flowchart TD
    subgraph UI_Ficha ["Ficha de Propiedad (/properties/[id])"]
        A[Superadmin abre ficha] --> B{¿Rol es superadmin?}
        B -- Sí --> C1["Botón 'Preparar Historia'"]
        B -- Sí --> C2["Botón 'Preparar Carrusel'"]
        B -- No --> D["Botones estándar de compartir (WA, FB, X, LI)"]
    end

    subgraph Backend_Image_Gen ["Motor de Render Satori / next-og"]
        C1 -->|Fetch GET| E1["/api/story/[id]?template=1"]
        C2 -->|Fetch GET en bucle (0..6)| E2["/api/feed/[id]?index=N"]
        
        E1 --> F1[Optimizar URL Cloudinary w_1080,q_70,f_jpg]
        E2 --> F2[Optimizar URL Cloudinary w_1080,q_70,f_jpg]
        
        F1 --> G1[Leer assets locales SVG/PNG en Buffer base64]
        F2 --> G2[Leer assets locales SVG/PNG en Buffer base64]
        
        G1 --> H1["ImageResponse (1080x1920)"]
        G2 --> H2["ImageResponse (1080x1350)"]
    end

    subgraph Client_Dispatch ["Procesamiento en Cliente"]
        H1 --> I1["Blob a File ('roggero-roma-story.png')"]
        H2 --> I2["Array de Files ('carrusel-1.png' ... 'carrusel-7.png')"]
        
        I1 --> J1["Cambiar botón a 'Compartir a Instagram'"]
        I2 --> J2["Generar Caption + Copiar al Portapapeles"]
        
        J1 --> K1{"navigator.canShare({ files })"}
        J2 --> K2{"navigator.canShare({ files })"}
        
        K1 -- Soporta Web Share --> L1[Abre Hoja Nativa de Compartir]
        K1 -- Escritorio / Sin soporte --> M1[Descarga directa del archivo PNG]
        
        K2 -- Soporta Web Share --> L2[Abre Hoja Nativa con 7 fotos listas para Feed]
        K2 -- Escritorio / Sin soporte --> M2[Alerta toast para usar celular]
    end
```

### Detalle de la Optimización de Imágenes para Satori
Para evitar errores de timeout o consumo excesivo de memoria en Vercel durante el renderizado SVG/Canvas de Satori, tanto en [`/api/feed/[id]`](file:///c:/Projects/property-pulse-nextjs/app/api/feed/[id]/route.jsx) como en [`/api/story/[id]`](file:///c:/Projects/property-pulse-nextjs/app/api/story/[id]/route.jsx) se implementa:

```javascript
function optimizeImageUrl(url, width = 1080) {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_70,f_jpg/`);
}
```
Esto fuerza a Cloudinary a entregar una imagen previamente escalada a 1080px de ancho con compresión JPG al 70%, acelerando la conversión a Base64 y evitando que Satori procese archivos pesados de 4K o 10MB.

---

## 4. Estructura de Código y Archivos Clave

| Archivo / Ruta | Tipo | Responsabilidad en el Sistema de Publicación |
|---|---|---|
| [`components/StoryShareButton.jsx`](file:///c:/Projects/property-pulse-nextjs/components/StoryShareButton.jsx) | Client Component | Maneja el estado (`idle`, `preparing`, `ready`), solicita el render a la API, crea el `File` binario y dispara la Web Share API o descarga el PNG. |
| [`components/FeedShareButton.jsx`](file:///c:/Projects/property-pulse-nextjs/components/FeedShareButton.jsx) | Client Component | Itera hasta 7 fotos de la propiedad, solicita las imágenes vía API con índice, genera el caption comercial con hashtags, copia al portapapeles y abre el share nativo. |
| [`components/ShareButtons.jsx`](file:///c:/Projects/property-pulse-nextjs/components/ShareButtons.jsx) | Client Component | Iconos y enlaces directos para compartir en Facebook, Twitter/X, LinkedIn y WhatsApp. |
| [`components/PropertyDetails.jsx`](file:///c:/Projects/property-pulse-nextjs/components/PropertyDetails.jsx#L116-L121) | Client Component | Integra los botones sociales y aplica la condición de seguridad de rol: `{session?.user?.role === 'superadmin' && ...}`. |
| [`app/api/story/[id]/route.jsx`](file:///c:/Projects/property-pulse-nextjs/app/api/story/[id]/route.jsx) | Route Handler (`next/og`) | Genera dinámicamente la imagen de Story 1080×1920 con datos de MongoDB y Cloudinary. |
| [`app/api/feed/[id]/route.jsx`](file:///c:/Projects/property-pulse-nextjs/app/api/feed/[id]/route.jsx) | Route Handler (`next/og`) | Genera dinámicamente cada slide del Feed 1080×1350 según el parámetro `?index=0..6`. |
| [`app/api/admin/toggle-published/route.js`](file:///c:/Projects/property-pulse-nextjs/app/api/admin/toggle-published/route.js) | Route Handler | Cambia el estado `is_published` de la propiedad y revalida las rutas con `revalidatePath`. |
| [`app/api/admin/toggle-featured/route.js`](file:///c:/Projects/property-pulse-nextjs/app/api/admin/toggle-featured/route.js) | Route Handler | Alterna la propiedad como destacada (`is_featured`) para secciones principales. |
| [`models/Property.js`](file:///c:/Projects/property-pulse-nextjs/models/Property.js) | Mongoose Schema | Esquema de datos: define `is_published`, `is_featured`, `status`, `badgeExpiresAt`, `images`, `gallery_order`. |
| [`utils/whatsapp.js`](file:///c:/Projects/property-pulse-nextjs/utils/whatsapp.js) | Utility | Generador canónico de deep links a WhatsApp Business con mensajes contextuales. |
| [`cinematic-capture/`](file:///c:/Projects/property-pulse-nextjs/cinematic-capture/README.md) | Subproyecto Node.js | Script automatizado de grabación Puppeteer + FFmpeg para generar videos cinemáticos para redes. |

---

## 5. Permisos y Seguridad

1. **Restricción de Herramientas de Creación Gráfica**:
   - En [`components/PropertyDetails.jsx`](file:///c:/Projects/property-pulse-nextjs/components/PropertyDetails.jsx#L116-L121), los componentes [`StoryShareButton`](file:///c:/Projects/property-pulse-nextjs/components/StoryShareButton.jsx) y [`FeedShareButton`](file:///c:/Projects/property-pulse-nextjs/components/FeedShareButton.jsx) están condicionados a:
     ```jsx
     {session?.user?.role === 'superadmin' && (
       <div className="mt-6">
         <StoryShareButton property={property} />
         <FeedShareButton property={property} />
       </div>
     )}
     ```
   - Esto previene que visitantes o usuarios regulares generen piezas con la identidad oficial sin autorización de los administradores.
2. **Endpoints Administrativos Protegidos**:
   - [`app/api/admin/toggle-published/route.js`](file:///c:/Projects/property-pulse-nextjs/app/api/admin/toggle-published/route.js#L13-L16) valida la sesión del usuario mediante [`isAdmin(sessionUser)`](file:///c:/Projects/property-pulse-nextjs/utils/isAdmin.js), rechazando cualquier solicitud no autorizada con código `401 Unauthorized`.
3. **Imágenes y CDN**:
   - Todo el proceso de generación consume imágenes subidas bajo el flujo de compresión client-side hacia Cloudinary, sin exponer secretos ni tokens de API privados en el frontend.

---

## 6. Diagnóstico y Oportunidades de Evolución

| Área | Estado Actual | Oportunidad de Evolución |
|---|---|---|
| **Publicación en Instagram** | Asistida por Web Share API móvil y copiado de caption | Integración con **Meta Graph API** (Content Publishing API) para publicación 100% automatizada desde el panel web sin depender del teléfono. |
| **Generación en Escritorio** | Descarga individual de Story; en carrusel Feed muestra toast sugiriendo móvil | Empaquetado ZIP client-side (`JSZip`) para descargar las 7 fotos del carrusel juntas más un archivo `.txt` con el copy listo. |
| **Roles y Permisos** | Limitado estrictamente a `superadmin` | Habilitar también para rol `admin` si se delega la gestión de redes en agentes de la inmobiliaria. |
| **Personalización de Plantillas** | Template único de Story y Feed | Selector de templates visuales (ej. plantilla minimalista clara, plantilla oscura de lujo, plantilla de "Vendida / Reservada"). |
| **Videos / Reels** | Grabación local vía script `cinematic-capture` | Pipeline en la nube para renderizar videos cortos de la propiedad con música y transiciones automáticamente al publicar. |
