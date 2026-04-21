# Roggero & Roma — Nuevo Frontend Inmobiliario

## Meta

Reconstruir el frontend del portal inmobiliario Roggero & Roma inspirándose en [The Blue Ground](https://www.theblueground.com) y Airbnb. Map-first, photos huge, mobile-first. Mantener el backend existente de Property Pulse (MongoDB + API).

**Deadline sugerido:** 3-5 días
**Presupuesto:** $300 USD

---

## Contexto del Proyecto

- **Cliente:** Roggero & Roma — inmobiliaria en Argentina
- **Sitio actual:** WordPress + DreamVilla theme (lento, anticuado)
- **Backend:** Property Pulse (Next.js 14 + MongoDB) — **YA CONFIGURADO Y FUNCIONANDO**
- **Frontend actual de Property Pulse:** funcional pero genérico (UI estándar Brad Traversy)

### Lo que ya existe

```
property-pulse/
├── app/
│   ├── api/                    # Rutas API (GET/POST properties, messages, auth)
│   ├── properties/             # Páginas de listado y detalle
│   ├── profile/                # Perfil de usuario
│   ├── messages/              # Mensajes
│   └── page.jsx                # Home
├── components/                 # ~30 componentes reutilizables
├── models/
│   ├── Property.js             # Schema: title, price, address, lat/lng, images[],amenities[], type, status
│   ├── Message.js
│   └── User.js
└── context/AuthProvider.jsx    # Autenticación
```

### Modelo de datos (Property)

```js
{
  _id: ObjectId,
  owner: ObjectId,           // usuario que creó
  title: String,             // "Departamento en Recoleta"
  type: "Alquiler" | "Venta",
  status: "available" | "sold" | "rented",
  price: Number,             // precio en ARS/USD
  priceLabel: String,        // "USD 200.000" o "$8.000.000/mes"
  address: {
    street: String,
    city: String,            // "Córdoba"
    state: String,           // "Córdoba"
    zipcode: String,
    lat: Number,
    lng: Number
  },
  bedrooms: Number,
  bathrooms: Number,
  garages: Number,
  area: Number,             // m²
  description: String,
  features: String[],        // ["Piscina", "Parrilla", "Balcón"]
  images: String[],         // URLs de Cloudinary
  amenities: String[],      // ["Aire acondicionado", "Calefacción"]
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Inspiración Visual

### The Blue Ground (principal)
- Mapa interactivo GRANDE — lado izquierdo de la pantalla (60-70% del viewport)
- Cards de propiedades pequeñas a la derecha
- Filtros encima del mapa (tipo de operación, rango de precio)
- Click en card → expande detalle en mapa
- Mobile: mapa colapsable, cards scrolleables abajo

### Airbnb (secundaria)
- Fotos grandes, borde redondeado
- Texto mínimo — los números hablan
- Filtros en un dropdown/chip compacto
- Hover states suaves
- Badge de "Nuevo" o "Precio reducido"

### No queremos
- ❌ Sliders pesados tipo Revolution Slider
- ❌ Cards con 15 campos de info
- ❌ Footer largo con 50 links
- ❌ Diseño Desktop-first
- ❌ Colores corporativos genéricos

---

## Guía de Diseño para Franco Roma

### Paleta de colores
- **Primario:** #1A1A2E (azul oscuro, elegante)
- **Secundario:** #E94560 (rojo Roma)
- **Background:** #FFFFFF
- **Surface:** #F8F9FA
- **Texto:** #1A1A2E
- **Texto secundario:** #6C757D

### Tipografía
- **Headings:** Inter Bold o similar sans-serif
- **Body:** Inter Regular
- **Precios:**bold, tamaño grande

### Mobile-first
- Mobile: 100% del viewport
- Mapa colapsable con botón "Ver mapa"
- Cards en grid 1 columna (mobile) → 2 columnas (tablet) → 3-4 columnas (desktop)
- Tap en card → abre detalle

---

## Estructura de Páginas Nuevas

### 1. Home (`/`)

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (logo + links + WhatsApp button)                │
├─────────────────────────────────────────────────────────┤
│  HERO: Título "Encontrá tu próxima propiedad"           │
│  + Filtros rápidos inline (tipo + ciudad + precio)     │
├───────────────────────────────┬─────────────────────────┤
│                               │                         │
│   MAPA GRANDE                 │   CARDS (scrollable)   │
│   (60% width desktop)         │   (40% width)          │
│   markers en tiempo real      │   ~6-8 propiedades     │
│                               │                         │
│   Click marker → highlight    │   Click card → mapa    │
│   Hover card → marker pulse   │   expande detalle      │
│                               │                         │
├───────────────────────────────┴─────────────────────────┤
│  PROPIEDADES DESTACADAS (grid 3 cols)                  │
├─────────────────────────────────────────────────────────┤
│  FOOTER simple: logo + contacto + WhatsApp             │
└─────────────────────────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────┐
│ NAVBAR              │
├─────────────────────┤
│ HERO + Filtros      │
├─────────────────────┤
│ Cards (full width)  │
│ [ Botón "Ver mapa" ]│
└─────────────────────┘
Click "Ver mapa" → mapa fullscreen
```

### 2. Página de Propiedades (`/properties`)

- Igual que home pero sin hero
- Filtros completos (sidebar en desktop, drawer en mobile)
- Paginación o infinite scroll
- Toggle vista: Grid / Mapa

### 3. Detalle de Propiedad (`/properties/[id]`)

```
┌─────────────────────────────────────────────────────────┐
│ NAVBAR                                                  │
├─────────────────────────────────────────────────────────┤
│ GALLERY: Fotos fullwidth, swipe, photoswipe             │
├──────────────────────────┬──────────────────────────────┤
│ INFO PRINCIPAL           │ FORMULARIO CONTACTO          │
│ Precio grande            │ (sticky sidebar desktop)     │
│ Título + ubicación      │ Nombre, teléfono, mensaje    │
│ Stats: dorm/ bath/ m²   │ WhatsApp directo            │
│ Descripción             │ Agendar visita              │
│ Amenities grid          │                              │
├──────────────────────────┴──────────────────────────────┤
│ MAPA pequeño con ubicación exacta                       │
├─────────────────────────────────────────────────────────┤
│ PROPIEDADES RELACIONADAS                               │
└─────────────────────────────────────────────────────────┘
```

### 4. Contacto (`/contact`)
- Mapa + formulario simple
- WhatsApp flotante siempre visible

---

## Componentes a Construir

### MapView (NUEVO)
- Mapbox GL o Leaflet + OpenStreetMap (gratis)
- Markers custom con precio
- Cluster markers cuando hay muchas propiedades
- Click marker → highlight card
- Hover card → marker pulsa

### PropertyCard (NUEVO)
- Foto grande (aspect-ratio 4:3 o 16:9)
- Badge de tipo (Alquiler/Venta)
- Precio prominente
- Location minima
- Hover: scale sutil + shadow

### PropertyFilters (NUEVO)
- Tipo: Alquiler / Venta / Todos
- Ciudad: dropdown
- Rango de precio: slider
- Dormitorios: chips (+1, +2, +3, +4)
- Botón "Aplicar" (mobile)

### Navbar (REEMPLAZAR)
- Logo izquierda
- Links centro: Inicio / Propiedades / Nosotros / Contacto
- Botón WhatsApp derecha
- Mobile: hamburger menu

### Hero (REEMPLAZAR)
- Título grande
- Filtros inline (no revolution slider)
- Fondo: foto de propiedad con overlay oscuro

### Footer (REEMPLAZAR)
- Simple: logo + dirección + teléfono + WhatsApp
- Sin links innecesarios

---

## API Routes — No tocar (ya existen)

```
GET  /api/properties              — lista propiedades (soporta ?type=&city=&minPrice=&maxPrice=&bedrooms=)
POST /api/properties              — crear propiedad (auth requerida)
GET  /api/properties/[id]         — detalle propiedad
PUT  /api/properties/[id]         — actualizar (auth)
DELETE /api/properties/[id]       — eliminar (auth)

POST /api/messages                — enviar mensaje sobre propiedad
GET  /api/messages                — ver mensajes (auth)
```

**Importante:** La API ya filtra por `status: "available"`. No mostrar propiedades vendidas/alquiladas en el frontend público.

---

## Tech Stack para el Frontend

```
Framework:     Next.js 14 (App Router)
Styling:       Tailwind CSS
Maps:          Leaflet + OpenStreetMap (GRATIS, no necesita API key)
                Opcional: Mapbox GL si want más polish
Icons:         react-icons (lucide-react si preferís)
Images:        next/image (optimización automática)
State:         React hooks (useState, useEffect) — no overengineering
Forms:         React Hook Form o nativo
Deployment:    Vercel (gratis para repo público)
```

**Por qué Leaflet en vez de Mapbox:**
- No necesita API key
- Gratis para uso comercial
- Funciona en Vercel sin problemas
-Alternativa: Mapbox si querés más polish (requiere cuenta gratis)

---

## Lo que NO hay que tocar

- ✅ `models/` — schemas no cambian
- ✅ `app/api/` — rutas no cambian
- ✅ `context/AuthProvider.jsx` — autenticación no cambia
- ✅ `components/PropertyAddForm.jsx` — panel admin no cambia
- ✅ `components/PropertyEditForm.jsx` — panel admin no cambia
- ✅ `components/Messages.jsx` — sistema de mensajes no cambia

**Solo rebuiltir:**
- `app/page.jsx` (home)
- `app/properties/page.jsx` (listado)
- `app/properties/[id]/page.jsx` (detalle)
- `components/Navbar.jsx`
- `components/Footer.jsx`
- `components/PropertyCard.jsx`
- `components/PropertyMap.jsx` (reemplazar con MapView nuevo)
- Crear `components/MapView.jsx`
- Crear `components/PropertyFilters.jsx`
- Crear `components/Hero.jsx`

---

## Migración de Datos

Las propiedades de Roggero & Roma están migradas a MongoDB (Property Pulse). El frontend nuevo se conecta a la misma API.

**Verificar que ande:**
```bash
curl "https://tu-api.vercel.app/api/properties?type=Alquiler"
# debe devolver array de propiedades
```

---

## Checklist para validar

- [ ] Home carga en <2s
- [ ] Mapa renderiza sin errores
- [ ] Cards clickeables abren detalle
- [ ] Filtros actualizan resultados
- [ ] Mobile: todo usable sin horizontal scroll
- [ ] WhatsApp button funciona
- [ ] SEO: title tags, meta description por página
- [ ] Images optimizadas con next/image
- [ ] Lighthouse performance > 90

---

## Referencias visuales

- The Blue Ground: https://www.theblueground.com
- Airbnb: https://airbnb.com
- inspiração adicional: https://www.zumper.com (apartamentos, filtro por mapa)

---

## Notas de Juan (propieetario del proyecto)

- Los colores de marca Roma ya están aplicados en el repo local (falta subir)
- Las propiedades de prueba ya están cargadas en MongoDB
- El WhatsApp de contacto es: +54 9 11 XXXX XXXX (agregar número real)
- Franco quiere prioridad mobile
- Inspirado en Blue Ground + Airbnb
