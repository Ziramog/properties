# Project Map: Roggero & Roma

## 1. Inventario de Rutas y Páginas
- **`/`**: Página de inicio.
- **`/properties`**: Catálogo general de propiedades y resultados de búsqueda.
- **`/properties/[id]`**: Ficha técnica individual de una propiedad.
- **`/properties/map-all`**: Mapa interactivo con todos los clústers de propiedades.
- **`/properties/saved`**: Favoritos del usuario logueado.
- **`/properties/search-results`**: Página de resultados con query strings para filtros complejos.
- **`/admin`**: Panel de gestión para agentes e inmobiliarias (Dashboard de CRM).
- **`/superadmin`**: Panel de administración global (Roles, respaldos, configuraciones del sitio).
- **`/profile`**: Perfil del usuario (comprador/vendedor).
- **`/messages`**: Bandeja de entrada de mensajes internos.
- **`/contact`** (si existe, derivada del Footer): Landing de contacto directo.
- **`/google-maps-pilot`**: Posible ruta de pruebas o experimentación para la transición o características experimentales de mapas.
- **`/p/[slug]`**: Posible acortador de URLs para compartir propiedades.

## 2. Mapa de Secciones (Homepage)
1. **Hero**: Video de fondo (`Francoroggeroyroma_loop.mp4`), eslogan "Vendemos Inmuebles, Construimos Confianza", y buscador central.
2. **StatsBar**: Métricas de prueba social (Propiedades, Años de experiencia, Reseñas).
3. **Featured Properties**: Carrusel de propiedades destacadas (`FeaturedPropertiesCarousel`).
4. **Seller CTA**: Llamado a la acción para vendedores e inversores.
5. **Nuestra Historia**: Sección de Agentes / "Sobre Nosotros".
6. **Reviews**: Carrusel de reseñas (obtenidas presumiblemente de Google Reviews).
7. **Clients**: Tira de logos de clientes empresariales/desarrollistas.
8. **Footer**: Direcciones, datos de contacto y enlaces a redes sociales.

## 3. Server Actions y Modelos Relacionados
- **Modelos (Mongoose)**: 
  - `Property`, `User`, `Message` (Centrales).
  - `Review`, `BusinessInfo`, `SiteConfig` (Gestión de la marca y reputación).
  - `Quotation`, `Quote`, `Payment`, `Subscriber` (Módulos transaccionales y de captación CRM).
  - `SearchTerm` (Registro analítico de búsquedas de usuarios).
- **Acciones Críticas**:
  - *Propiedades*: `addProperty`, `updateProperty`, `deleteProperty`, `bookmarkProperty`.
  - *Mensajes*: `addMessage`, `markMessageAsRead`, `deleteMessage`.
  - *CRM/Finanzas*: `addQuote`, `updateQuotationStatus`, `deleteQuotation`.
  - *Mantenimiento/SEO*: `generateDescription` (Integración de IA), `logSearch`, `getTopSearches`, `bulkImportReviews`.

## 4. Flujos de Datos e Integraciones
- **Imágenes**: Cloudinary. Se comprimen en cliente (`browser-image-compression`) y se suben directamente mediante `upload_preset` unsigned.
- **Mapas**: Vis.gl / Leaflet. Utilización intensiva para mostrar clústeres.
- **Descripciones IA**: Server Action nativa (`generateDescription`) que utiliza OpenAI o DeepSeek para redactar automáticamente textos de propiedades.
- **Notificaciones**: Toastify en el cliente. NextAuth para la capa de permisos y sesiones.

## 5. Tabla de Arquitectura

| Ruta | Función | Componentes Principales | Fuente de Datos | Permisos |
|---|---|---|---|---|
| `/` | Landing/Conversión | `Hero`, `FeaturedPropertiesCarousel`, `ReviewsSection` | `Property.find({is_featured})`, `Review.find()` | Público |
| `/properties` | Catálogo / Filtros | `PropertiesSearch`, `PropertyCard`, `Pagination` | `Property.find()` con filtros de URL | Público |
| `/properties/[id]` | Ficha Propiedad | `PropertyDetails`, `PropertyGallery`, `PropertyMap` | `Property.findById()`, `User` (vendedor) | Público |
| `/admin` | Gestión de CRM | `Dashboard`, Formularios de Propiedades/Cotizaciones | Varios Modelos Mongoose | Admin |
| `/superadmin` | Config. Global | Componentes de configuración de `SiteConfig` | `SiteConfig`, Logs | Superadmin |
| `/messages` | Comunicación | `MessageCard`, `UnreadMessageCount` | `Message.find({recipient})` | Usuario Autenticado |
| `/properties/saved`| Favoritos | `PropertyCard`, `BookmarkButton` | `User.bookmarks.populate()` | Usuario Autenticado |
