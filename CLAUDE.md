# CLAUDE.md — Roggero & Roma Inmobiliaria

## Proyecto
- **Repo:** github.com/Ziramog/properties
- **Stack:** Next.js 14 (App Router), MongoDB/Mongoose, Tailwind CSS, React 18
- **Deploy:** Vercel
- **Color accent:** Roma #E94560
- **Cliente:** Franco Roma — Roggero & Roma Inmobiliaria, Alta Gracia, Córdoba

---

## Reglas de oro (no romper nunca)

1. **Siempre `npm run build`** antes de hacer commit/push — verificar que compila
2. **Commits descriptivos** — no "fix" o "update", decí qué cambió
3. **Tailwind para estilos** — no CSS custom a menos que sea necesario
4. **Server Components** como default — Client Components solo cuando necesita interactividad (`'use client'`)
5. **No hacer deploy sin precio acordado** — esto es portfolio/demo, no producto terminado

---

## Estructura del proyecto

```
app/
  page.jsx              # Homepage: Hero → MapProperties → FeaturedProperties → Testimonials → Clients
  layout.jsx            # Root layout: Navbar, Footer, AuthProvider, GlobalContext, ToastContainer
  properties/           # Rutas de propiedades
    page.jsx            # Lista principal
    add/page.jsx         # Agregar propiedad
    [id]/page.jsx        # Detalle de propiedad
    [id]/edit/page.jsx   # Editar propiedad
    search-results/page.jsx
    saved/page.jsx
  messages/page.jsx      # Sistema de mensajes entre usuarios
  profile/page.jsx       # Perfil de usuario
  api/                   # API routes (Next.js)
    auth/[...nextauth]/  # Auth con NextAuth
  actions/               # Server Actions (addProperty, updateProperty, deleteProperty, etc.)
components/
  Navbar.jsx
  Footer.jsx
  Hero.jsx
  FeaturedProperties.jsx
  MapProperties.jsx
  Testimonials.jsx
  Clients.jsx
  WhatsAppButton.jsx     # Botón flotante WA — número: +5493547563911
models/
  Property.js             # Schema Mongoose
config/
  database.js             # connectDB()
context/
  GlobalContext.jsx
data/
utils/
scripts/
  seedProperties.js      # Seed de datos de prueba
assets/styles/
  globals.css
```

---

## Convenciones de código

### Rutas y archivos
- **Pages:** `app/ruta/page.jsx`
- **Layouts:** `app/ruta/layout.jsx`
- **Server Actions:** `app/actions/nombreAction.js`
- **Components:** `components/Nombre.jsx`

### Nomenclatura
- **Componentes:** PascalCase (`FeaturedProperties.jsx`)
- **Funciones/Variables:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **CSS classes:** Tailwind utilities (no custom CSS)

### Props
- Usar destructuring: `const { title, children } = props`
- Props opcionales con default: `const { title = 'Default' } = props`

### Async/Await
- Siempre try/catch en server actions
- Loading states con `useState` + `isLoading`

---

## Base de datos

- **MongoDB Atlas** — connection string en `.env` (NEXT_PUBLIC_MONGODB_URI)
- **Modelos:** `Property`, `User` (vía NextAuth)
- **Seed:** `npm run seed` o `node scripts/seedProperties.js`

### Schema Property (básico)
```js
{
  title: String,
  description: String,
  price: Number,
  location: String,
  city: String,
  type: 'casa' | 'departamento' | 'terreno' | 'campo' | 'local',
  operation: 'venta' | 'alquiler',
  images: [String],
  features: { bedrooms, bathrooms, area, garage },
  coordinates: { lat, lng },
  owner: ObjectId,
  savedBy: [ObjectId],
  createdAt: Date
}
```

---

## Authentication

- **NextAuth.js** con provider MongoDB
- Rutas protegidas: `/properties/add`, `/profile`
- Session disponible via `useSession()` o `getServerSession()`

---

## geocoding

- usa Nominatim (OpenStreetMap) para geocodificación
- Cache en memoria en `app/page.jsx` (`geoCache`)
- Ciudades de Córdoba hardcodeadas con coords default

---

## Comandos útiles

```bash
npm run dev      # Desarrollo local en :3000
npm run build   # Build de producción
npm run start   # Producción
npm run lint    # ESLint
node scripts/seedProperties.js  # Seed de datos
```

---

## Pending tasks (del último review)

- [ ] `/contact` page — falta crear
- [ ] SEO completo — meta tags, sitemap.xml, robots.txt
- [ ] Demo para Franco — necesita fechar
- [ ] 6 commits listos para pushear a dev (ya están localmente)

---

## Lo que NO es este proyecto

- **No es un SaaS** — es un demo/portfolio para mostrarle a Franco
- **No está monetizado** — no hay pricing, no hay Stripe, no hay Leads
- **El objetivo real:** que Franco vea el sistema y contrate desarrollo completo o servicios
