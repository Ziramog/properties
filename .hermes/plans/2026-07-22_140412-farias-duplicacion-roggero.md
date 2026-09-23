# Farias & Asociados — Plan de duplicación del sitio Roggero & Roma

> **Para Hermes:** plan documental. No ejecutar cambios de código sin aprobación explícita de Juan. La implementación la debe realizar Antigravity sobre una copia aislada del proyecto.

**Fecha:** 2026-07-22  
**Proyecto base revisado:** `C:\Projects\property-pulse-nextjs`  
**Referencia comercial:** Roggero & Roma  
**Cliente destino:** Farias & Asociados  
**Objetivo:** replicar el sitio de Roggero & Roma “en todo sentido” para Farias & Asociados, manteniendo diseño, estructura y módulos, pero con infraestructura, datos, cuentas y credenciales separadas para evitar contaminación entre clientes.

---

## 1. Resumen ejecutivo

El proyecto `property-pulse-nextjs` ya es una base sólida para Farias: tiene sitio público inmobiliario, catálogo de propiedades, fichas individuales, panel admin, imágenes en Cloudinary, mapas, login con Google, reseñas, propuestas/PDF, Vercel Blob para PDFs/logos, analytics y cron para sincronización de reseñas.

La duplicación recomendada **no debe hacerse como multi-tenant dentro del mismo deploy de Roggero**, sino como **nuevo proyecto independiente** basado en el código de Roggero.

### Recomendación principal

Crear para Farias:

1. **Repositorio separado** o carpeta/proyecto separado desde el código actual.
2. **Proyecto Vercel separado** dentro de la cuenta/team de Wolfim.
3. **Base de datos MongoDB separada** para Farias.
4. **Cloudinary separado** — idealmente cuenta/cloud separado; mínimo preset/folder separado.
5. **Vercel Blob separado o prefijos estrictos por cliente**.
6. **Google Cloud/OAuth/Places separado** o por lo menos credenciales separadas por dominio.
7. **GA4/Meta Pixel separados** para Farias.
8. **Dominio y DNS propios**.

Motivo: si se comparten DB, Cloudinary, analytics o claves, cualquier error puede mezclar propiedades, imágenes, métricas o accesos entre Roggero y Farias. Para un cliente inmobiliario, eso es un riesgo operativo y comercial alto.

---

## 2. Estado técnico detectado en Roggero

### Stack confirmado

Desde `package.json`:

- Next.js `14.2.4`
- React `18`
- MongoDB + Mongoose
- NextAuth `4.24.7`
- Cloudinary SDK `cloudinary ^2.2.0`
- Vercel Blob `@vercel/blob ^2.4.0`
- Mapbox / Google Maps:
  - `mapbox-gl`
  - `react-map-gl`
  - `@vis.gl/react-google-maps`
  - `@googlemaps/markerclusterer`
- React PDF `@react-pdf/renderer`
- OpenAI package `openai`
- Browser image compression `browser-image-compression`
- Photoswipe gallery
- TailwindCSS

### Módulos funcionales que conviene replicar

- Sitio público con home inmobiliaria premium.
- Catálogo de propiedades.
- Fichas individuales por propiedad.
- Buscador/filtros.
- Vista mapa.
- Panel admin.
- Alta, edición, eliminación, publicación/despublicación y destacados.
- Carga y reordenamiento de fotos.
- Etiquetas comerciales para propiedades.
- WhatsApp/contacto por propiedad.
- Login con Google vía NextAuth.
- Roles `client`, `admin`, `superadmin`.
- Reseñas manuales/curadas y base para sync con Google Places.
- Propuestas/PDF desde admin.
- Link público de propuesta.
- Vercel Blob para PDFs/logos.
- Configuración editable parcial vía `SiteConfig`.
- Analytics GA4 + Meta Pixel con exclusión parcial de admin.
- Cron diario para reseñas.

---

## 3. Decisión clave: cuentas separadas vs compartir cuentas existentes

### Recomendación corta

| Recurso | ¿Cuenta separada? | Recomendación |
|---|---:|---|
| GitHub repo | Sí | Nuevo repo para Farias o fork privado limpio. |
| Vercel account | No necesariamente | Puede estar en la cuenta/team Wolfim, pero como **proyecto separado**. |
| Vercel project | Sí | Obligatorio. Proyecto Farias independiente. |
| MongoDB | Sí | DB/cluster separado para Farias. |
| Cloudinary | Sí recomendado | Ideal cuenta/cloud separado. Mínimo cloud/preset/folder separado. |
| Vercel Blob | Sí recomendado | Store/token separado o prefijos estrictos por cliente. |
| Google Cloud | Sí recomendado | Proyecto/API keys/OAuth separados por dominio. |
| Mapbox | Token separado | Puede ser misma cuenta, pero token restringido al dominio Farias. |
| GA4 | Sí | Propiedad web de Farias independiente. |
| Meta Pixel | Sí si hay Ads | Pixel/dataset de Farias separado. |
| Dominio | Sí | Dominio propio o subdominio controlado. |
| Email transaccional | Si se agrega | Cuenta/dominio de envío propio o subdominio Wolfim claramente configurado. |

### Por qué separar

- Evita mezclar propiedades e imágenes de clientes.
- Evita que un admin de un proyecto acceda por error a datos del otro.
- Permite métricas limpias por cliente.
- Facilita backups/restores sin tocar Roggero.
- Facilita soporte y mantenimiento mensual.
- Reduce riesgo si una clave se filtra o vence.
- Permite transferir/entregar el proyecto a futuro sin desarmar el de Roggero.

---

## 4. Cloudinary — detalle crítico

### Estado actual detectado

El código actual sube imágenes de propiedades directamente desde el navegador a Cloudinary:

- `components/PropertyAddForm.jsx`
- `components/PropertyEditForm.jsx`

Valores hardcodeados detectados:

```js
uploadData.append('upload_preset', 'property_pulse_unsigned');
fetch('https://api.cloudinary.com/v1_1/dunkbcery/image/upload', ...)
```

Además existe configuración server-side:

- `config/cloudinary.js`

```js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

Y se usa para eliminar imágenes removidas:

- `app/actions/updateProperty.js`
- `app/actions/deleteProperty.js`

### Problema actual para duplicación

Si se duplica el proyecto sin tocar esto, Farias subiría fotos al cloud actual `dunkbcery` y al preset `property_pulse_unsigned`. Eso mezcla assets de Farias con Roggero y deja dependencia cruzada.

### Recomendación Cloudinary

**Opción A — recomendada:** crear una cuenta/cloud Cloudinary exclusiva para Farias.

- Cloud name propio: ejemplo `farias-asociados` o similar.
- Unsigned upload preset propio: `farias_properties_unsigned`.
- Folder por defecto: `farias/properties`.
- Transformaciones y límites propios.
- API key/secret propios para borrado y scripts.

**Opción B — aceptable si Juan quiere ahorrar gestión:** usar la misma cuenta Cloudinary, pero con aislamiento estricto:

- Preset nuevo: `farias_properties_unsigned`.
- Folder obligatorio: `clients/farias/properties`.
- Tags: `client:farias`, `project:farias-web`.
- Scripts de backup/limpieza filtrados por folder/tag.
- Nunca usar el preset de Roggero.

### Cambios técnicos necesarios

Antigravity debe reemplazar hardcodes por variables:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_CLOUDINARY_FOLDER=farias/properties
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Y construir URL de upload así:

```js
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

uploadData.append('upload_preset', uploadPreset);
if (folder) uploadData.append('folder', folder);

const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  method: 'POST',
  body: uploadData,
});
```

### Seguridad Cloudinary

El upload actual usa unsigned preset desde cliente. Es operativo y rápido, pero hay que configurarlo bien:

- Restringir formatos permitidos: jpg, jpeg, png, webp.
- Tamaño máximo razonable.
- Folder fijo.
- Evitar overwrite.
- Moderar si Cloudinary lo permite.
- No exponer API secret al browser.

Para una versión más robusta: crear endpoint server-side firmado, pero eso puede quedar fase 2 si el presupuesto manda.

---

## 5. Vercel — estructura recomendada

### Estado actual detectado

Existe `vercel.json` con cron:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-reviews",
      "schedule": "0 6 * * *"
    }
  ]
}
```

El proyecto usa Next.js App Router y debería funcionar como proyecto Vercel independiente.

### Recomendación Vercel

No hace falta crear una cuenta Vercel nueva si Wolfim ya centraliza deploys, pero hay una salvedad importante: en cuentas Hobby/free los recursos y límites pueden compartirse a nivel cuenta/team. Un proyecto separado aísla variables, dominio, deploys y logs, pero no necesariamente aísla consumo de cuota.

Decisión actual para Farias:

1. **Cuenta Vercel separada para Farias usando un email/usuario distinto** — opción elegida para hoy. El objetivo es que Farias tenga su propia cuota Hobby/free y que su consumo no se mezcle con Roggero ni con otros proyectos.
2. **Proyecto Vercel separado dentro de esa cuenta Farias** — `farias-asociados`, con dominio, variables, logs y deploys propios.
3. **No comprar Vercel Pro todavía** — con dos sitios activos no se justifica el costo. Recién evaluarlo cuando Wolfim tenga aproximadamente **5 mantenimientos en marcha** que justifiquen absorber hosting/soporte como costo fijo centralizado.
4. **Wolfim mantiene control operativo** — crear/administrar la cuenta con email controlado por Wolfim o con acceso compartido seguro, para poder dar soporte sin depender del cliente.
5. **Migración futura** — si Wolfim pasa a Pro/team, migrar proyectos desde las cuentas Hobby separadas hacia el team Pro manteniendo repo, dominio, env vars y recursos externos documentados.

Sí hay que crear ahora:

- Proyecto Vercel nuevo: `farias-asociados`.
- Variables de entorno propias por ambiente.
- Dominio propio conectado.
- Cron propio.
- Blob propio si se usa.
- Preview deploys separados.

### Ambientes

Configurar mínimo:

- `Production`: dominio real Farias.
- `Preview`: ramas de prueba.
- `Development`: local de Juan/Antigravity.

### Variables en Vercel

Variables detectadas o necesarias:

```env
# Base app
NEXT_PUBLIC_DOMAIN=https://www.dominio-farias.com.ar
NEXTAUTH_URL=https://www.dominio-farias.com.ar
NEXTAUTH_SECRET=

# MongoDB
MONGODB_URI=

# Auth Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_CLOUDINARY_FOLDER=farias/properties
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Maps
NEXT_PUBLIC_MAP_PROVIDER=mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_API_KEY=
GOOGLE_PLACE_ID=

# Reviews cron
CRON_SECRET=

# PDF / assets persistentes
BLOB_READ_WRITE_TOKEN=

# IA descripción / propuestas
OPENAI_API_KEY=
DEEPSEEK_API_KEY=

# Analytics si se decide por env en vez de DB
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

Nota: algunas variables pueden no estar cableadas todavía como `NEXT_PUBLIC_GA_ID`, porque hoy `SiteConfig` guarda `analyticsId` y `facebookPixelId`. Igual conviene definir una estrategia única: env para base deploy o DB para editable desde admin.

---

## 6. MongoDB / base de datos

### Estado actual detectado

La conexión usa:

- `config/database.js`
- `process.env.MONGODB_URI`

Modelos relevantes:

- `models/Property.js`
- `models/User.js`
- `models/SiteConfig.js`
- `models/Review.js`
- `models/Quotation.js`
- `models/Subscriber.js`
- `models/SearchTerm.js`
- `models/Message.js`
- `models/BusinessInfo.js`

### Recomendación MongoDB

Crear DB separada para Farias:

- Opción ideal: cluster separado.
- Opción aceptable: misma cuenta Atlas, database separada `farias_asociados_prod`.
- Usuario DB separado con permisos solo sobre esa DB.
- Backups separados.

### No recomendado

No usar la misma `MONGODB_URI` de Roggero. Aunque las colecciones tengan IDs diferentes, el riesgo de mezclar propiedades, usuarios y propuestas es alto.

### Datos iniciales a seedear

- Usuario superadmin de Juan.
- Usuario admin de Farias, si ya está definido.
- `SiteConfig` Farias:
  - logo
  - nombre comercial
  - email
  - teléfono
  - WhatsApp
  - dirección
  - hero title/subtitle
  - about text
  - footer description
  - analyticsId
  - facebookPixelId
  - etiquetas comerciales
- Propiedades demo o carga inicial real.
- Reseñas manuales si se usan en v1.

---

## 7. Auth / Google Login

### Estado actual detectado

- NextAuth con Google Provider.
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.
- Roles en MongoDB.
- `middleware.js` protege rutas admin/superadmin.

### Recomendación

Crear OAuth client separado para Farias o al menos agregar callbacks propios:

```text
https://www.dominio-farias.com.ar/api/auth/callback/google
https://farias-asociados.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

Generar `NEXTAUTH_SECRET` propio.

### Punto crítico

Después del primer login, el usuario puede quedar con rol `client`. Hay que tener procedimiento para promover a admin/superadmin:

- Script controlado.
- Ruta superadmin existente.
- O seed inicial de usuario admin.

No dejar abierto el alta de admins.

---

## 8. Dominio, DNS y metadata

### Archivos con branding/dominio hardcodeado

Detectado en:

- `app/layout.jsx`
- `app/robots.js`
- `app/sitemap.js`
- `components/GoogleAnalytics.jsx`
- `utils/analytics.js`
- `models/SiteConfig.js`
- `next.config.mjs`

### Cambios necesarios

Reemplazar:

- `Roggero & Roma`
- `roggeroyroma.com.ar`
- `properties-srs5.vercel.app`
- `Alta Gracia` si no aplica igual
- logo fallback `LOGO R&R 2023.png`
- teléfonos/emails/direcciones
- `G-PW4FH9WHQB` de GA4
- hosts permitidos de analytics

### Dominio recomendado

Pendiente de decisión de Juan/Farias. Opciones:

- `fariasyasociados.com.ar`
- `fariasasociados.com.ar`
- `fariaspropiedades.com.ar`
- subdominio temporal: `farias.wolfim.com` solo para preview/comercial, no como producción final ideal.

---

## 9. Analytics / medición

### Estado actual detectado

`utils/analytics.js` tiene eventos:

- `click_whatsapp`
- `click_phone`
- `click_email`
- `click_maps`
- `property_viewed`
- `form_submit`
- `search_used`
- `click_social`

También excluye:

- `/admin`
- `/superadmin`
- `/api`
- roles `admin` y `superadmin`

Pero tiene allowlist de hosts de Roggero.

### Recomendación

Crear para Farias:

- GA4 property separada.
- Meta Pixel separado si va a tener pauta.
- Eventos heredados, pero con hosts Farias.
- Conversión principal: WhatsApp por propiedad / formulario / propuesta abierta según estrategia.
- Excluir tráfico admin.
- Verificar en DebugView antes de publicar.

### Cambios técnicos

Actualizar host allowlist:

```js
const allowedHosts = [
  'fariasyasociados.com.ar',
  'www.fariasyasociados.com.ar',
  'farias-asociados.vercel.app',
  'localhost',
  '127.0.0.1'
];
```

O mejor: centralizar por `NEXT_PUBLIC_DOMAIN` y evitar listas duplicadas.

---

## 10. Mapas / Google Places / Mapbox

### Estado actual detectado

Mapbox:

- `components/shared/MapConfig.jsx`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- Estilo hardcodeado: `mapbox://styles/wolfim77/cmp93y2ft000s01qf5dxi9ar7`

Google Places Reviews:

- `lib/google/places-client.js`
- `GOOGLE_API_KEY`
- `GOOGLE_PLACE_ID`
- Cron `/api/cron/sync-reviews`

### Recomendación

Para mapas:

- Se puede usar misma cuenta Mapbox de Wolfim, pero crear token restringido al dominio Farias.
- Revisar si el estilo `wolfim77` puede seguir usándose o crear estilo neutral por cliente.

Para reseñas Google:

- Si Farias quiere sync automático: Google Cloud project/API key separado.
- Si no: v1 manual/curada en DB y sin costos Google.

### Riesgo

La API de Google Places para reviews puede tener restricciones, cuotas y costos. No prometer sync automático sin configurar credenciales y probar.

---

## 11. Vercel Blob / PDFs / logos

### Estado actual detectado

Se usa `@vercel/blob` para:

- Upload de logo en `app/api/quotations/upload-logo/route.js`.
- Guardar PDFs en `app/api/quotations/[id]/generate-pdf/route.js`.

Variable:

```env
BLOB_READ_WRITE_TOKEN=
```

Rutas actuales:

```text
logos/agency-logo-{timestamp}.png
quotations/propuesta-{quoteNumber}.pdf
```

### Recomendación

Crear Blob store/token propio para Farias o prefijos aislados:

```text
farias/logos/...
farias/quotations/...
```

Mejor cambio técnico:

```env
BLOB_PREFIX=farias
```

Y usar:

```js
put(`${process.env.BLOB_PREFIX}/logos/${filename}`, ...)
put(`${process.env.BLOB_PREFIX}/quotations/propuesta-${quotation.quoteNumber}.pdf`, ...)
```

Si no se separa, PDFs/logos de distintos clientes pueden convivir sin orden en el mismo storage.

---

## 12. Contenido y branding Farias

### Reemplazos obligatorios

- Nombre: `Farias & Asociados` o la grafía final que indique Juan.
- Logo.
- Paleta si se mantiene igual o si Farias tiene identidad propia.
- Tipografías: se puede replicar Roggero.
- Hero.
- About.
- Footer.
- Dirección.
- Teléfono.
- WhatsApp.
- Email.
- Redes.
- Copy SEO.
- Metadata OpenGraph.
- Favicon.
- Imágenes institucionales.
- Reseñas.
- Propiedades iniciales.

### Mantener “en todo sentido”

Replicar:

- Layout general.
- Jerarquía visual.
- Home premium.
- Catálogo.
- Cards.
- Fichas.
- Admin.
- PDF/propuestas.
- Reseñas.
- WhatsApp por propiedad.
- Mapa.

Pero no replicar:

- Datos de Roggero.
- Logo R&R.
- GA4 de Roggero.
- Cloudinary de Roggero.
- DB de Roggero.
- Google OAuth callbacks de Roggero.
- Dominio/metadata de Roggero.

---

## 13. Plan de ejecución propuesto para Antigravity

### Fase 0 — Preparación y decisión de alcance

**Objetivo:** definir si el duplicado será “Roggero con branding Farias” o si tendrá ajustes visuales propios.

Decisiones de Juan:

- Dominio final.
- Logo/brand assets disponibles.
- Datos de contacto Farias.
- WhatsApp principal.
- Email.
- Dirección.
- Redes.
- ¿Usar reseñas manuales o Google sync automático?
- ¿Módulo PDF incluido desde el lanzamiento?
- ¿Propiedades reales iniciales o demo?

### Fase 1 — Crear copia aislada del proyecto

**Objetivo:** tener nuevo workspace sin tocar Roggero.

Acciones:

1. Crear carpeta nueva, por ejemplo:

```text
C:\Projects\farias-asociados-nextjs
```

2. Copiar código base desde:

```text
C:\Projects\property-pulse-nextjs
```

3. Eliminar artefactos que no deben duplicarse si existen:

```text
.next/
node_modules/
.env.local
.vercel/
```

4. Crear repo Git separado.
5. Definir rama inicial `main` o `preview`.
6. Instalar dependencias y correr build local.

### Fase 2 — Parametrizar configuración cliente

**Objetivo:** sacar hardcodes de Roggero.

Archivos probables:

- `app/layout.jsx`
- `app/robots.js`
- `app/sitemap.js`
- `models/SiteConfig.js`
- `components/GoogleAnalytics.jsx`
- `utils/analytics.js`
- `next.config.mjs`
- `components/PropertyAddForm.jsx`
- `components/PropertyEditForm.jsx`
- `app/api/quotations/upload-logo/route.js`
- `app/api/quotations/[id]/generate-pdf/route.js`
- `components/shared/MapConfig.jsx`

Acciones:

- Crear config central tipo `config/site.js` o `config/client.js`.
- Mover nombre, dominio, hosts, brand y defaults a config/env.
- Reemplazar hardcodes de Cloudinary.
- Reemplazar hardcodes de analytics hosts.
- Reemplazar metadata Roggero.

### Fase 3 — Infra separada

**Objetivo:** que Farias tenga recursos propios.

Crear/configurar:

- MongoDB DB/cluster Farias.
- Cloudinary cloud/preset/folder Farias.
- Vercel project Farias.
- Vercel Blob token/store Farias.
- Google OAuth client Farias.
- Mapbox token restringido.
- GA4 property Farias.
- Google Places API si se activa reviews sync.
- Dominio en Vercel.

### Fase 4 — Branding y contenido

**Objetivo:** reemplazar identidad Roggero por Farias.

Acciones:

- Logo y favicon.
- Metadata SEO.
- Textos home/about/footer.
- Contactos.
- WhatsApp messages.
- SiteConfig seed.
- Imágenes institucionales.
- Reseñas iniciales.

### Fase 5 — Admin y datos iniciales

**Objetivo:** entregar panel usable.

Acciones:

- Crear usuario superadmin Juan.
- Crear usuario admin Farias si corresponde.
- Probar login Google.
- Probar alta de propiedad.
- Probar edición.
- Probar reordenamiento imágenes.
- Probar borrar imagen y confirmar delete Cloudinary.
- Probar publicar/despublicar/destacar.
- Probar etiquetas.

### Fase 6 — PDF/propuestas

**Objetivo:** asegurar que el diferencial de propuestas funcione con branding Farias.

Acciones:

- Reemplazar logo fallback `LOGO R&R 2023.png`.
- Configurar `SiteConfig.logoUrl`.
- Configurar Vercel Blob.
- Generar propuesta demo.
- Descargar PDF.
- Abrir link público `/p/[token]`.
- Probar desde mobile.
- Probar compartir por WhatsApp.

### Fase 7 — Reviews

**Opción v1 manual recomendada para lanzamiento:**

- Cargar reseñas manuales/curadas.
- Activar/desactivar destacadas.
- Ordenar prioridad.
- Mostrar en sitio.

**Opción v2 automática como add-on:**

- Configurar `GOOGLE_API_KEY`.
- Configurar `GOOGLE_PLACE_ID`.
- Configurar cron y `CRON_SECRET`.
- Probar `/api/cron/sync-reviews`.
- Validar costos/cuotas.

### Fase 8 — QA y deploy

**Objetivo:** no publicar una copia con rastros de Roggero.

Checklist:

- `npm run build` pasa.
- Home no contiene Roggero.
- Metadata no contiene Roggero.
- Sitemap/robots apuntan a dominio Farias.
- Cloudinary sube al cloud/folder Farias.
- MongoDB guarda en DB Farias.
- Admin login funciona.
- Propiedad nueva se crea y aparece pública.
- Imagen borrada se elimina o queda controlada.
- PDF se genera.
- Blob guarda con prefijo/store Farias.
- GA4 recibe eventos en propiedad Farias.
- Admin no dispara analytics.
- WhatsApp abre número correcto.
- Mapas cargan.
- Reviews cargan.
- No quedan hosts `roggeroyroma.com.ar` salvo en documentación histórica.
- No quedan textos `Roggero & Roma` salvo si se menciona como referencia interna no pública.

---

## 14. Riesgos y puntos a no prometer todavía

1. **Cloudinary está hardcodeado.** No se puede duplicar seguro sin corregir cloud name/preset.
2. **Analytics tiene allowlist Roggero.** Si no se actualiza, Farias puede no medir o medir mal.
3. **SiteConfig tiene defaults de Roggero.** Hay que seedear Farias antes de deploy final.
4. **Metadata usa dominio temporal `properties-srs5.vercel.app`.** Hay que actualizar.
5. **Google Reviews automático depende de API/credenciales/costos.** Mejor v1 manual para salir rápido.
6. **Mapbox style pertenece a Wolfim.** Puede usarse, pero conviene token restringido por dominio.
7. **Vercel Blob puede mezclar PDFs/logos si se comparte sin prefijo.** Aislar.
8. **No usar DB de Roggero.** Riesgo de datos mezclados.
9. **No prometer CMS total si no se valida todo el content manager.** `SiteConfig` cubre parte, no necesariamente todo.
10. **No hacer deploy productivo sin revisar rutas admin/API.** Hay que endurecer permisos si se va a operar con cliente real.

---

## 15. Checklist de cuentas/credenciales a crear

### Obligatorio

- [ ] GitHub repo Farias.
- [ ] Vercel project Farias.
- [ ] MongoDB URI Farias.
- [ ] Cloudinary cloud/preset/folder Farias.
- [ ] Google OAuth client Farias.
- [ ] NEXTAUTH_SECRET Farias.
- [ ] Dominio Farias o dominio temporal aprobado.
- [ ] GA4 property Farias.
- [ ] WhatsApp/teléfono/email/dirección Farias.

### Recomendado

- [ ] Vercel Blob store/token Farias.
- [ ] Mapbox token restringido Farias.
- [ ] Google Cloud project/API key Farias.
- [ ] Google Place ID Farias.
- [ ] Meta Pixel Farias si habrá pauta.
- [ ] Procedimiento de backups MongoDB.
- [ ] Procedimiento de backups Cloudinary.

---

## 16. Archivos revisados para este plan

- `package.json`
- `next.config.mjs`
- `vercel.json`
- `app/layout.jsx`
- `config/database.js`
- `config/cloudinary.js`
- `models/Property.js`
- `models/SiteConfig.js`
- `utils/analytics.js`
- `utils/authOptions.js`
- `components/GoogleAnalytics.jsx`
- `components/PropertyAddForm.jsx`
- `components/PropertyEditForm.jsx`
- `components/shared/MapConfig.jsx`
- `lib/google/places-client.js`
- `app/actions/addProperty.js`
- `app/actions/updateProperty.js`
- `app/api/quotations/upload-logo/route.js`
- `app/api/quotations/[id]/generate-pdf/route.js`
- Vault: `companies/wolfim/projects/farias-admin-panel-relevamiento-roggero-2026-07-13.md`
- Vault: `companies/wolfim/research/handoff-webbuilder-roggero-admin-panel-modulos-farias-2026-07-13.md`

---

## 17. Prompt sugerido para Antigravity — fase inicial

> Usar este prompt solo cuando Juan apruebe avanzar con implementación.

```md
Objetivo
Crear una copia aislada del proyecto Roggero & Roma para Farias & Asociados, manteniendo diseño y funcionalidades, pero separando configuración, infraestructura y credenciales por cliente.

Contexto del proyecto
Proyecto base: C:\Projects\property-pulse-nextjs
Stack: Next.js 14 App Router, MongoDB/Mongoose, NextAuth Google, Cloudinary, Vercel Blob, Mapbox/Google Places, React PDF, GA4/Meta Pixel.
La copia NO debe modificar el proyecto Roggero original. Crear/usar workspace nuevo para Farias.

Tarea específica
1. Crear copia del proyecto en C:\Projects\farias-asociados-nextjs o confirmar path antes de tocar archivos.
2. Remover dependencias locales de la copia: .next, node_modules, .vercel, .env.local.
3. Parametrizar todos los hardcodes de cliente:
   - Roggero & Roma
   - roggeroyroma.com.ar
   - properties-srs5.vercel.app
   - Cloudinary cloud hardcodeado dunkbcery
   - upload_preset property_pulse_unsigned
   - GA4 Roggero
   - logo fallback R&R
4. Crear configuración central para Farias con nombre, dominio, metadata, contactos, analytics hosts y brand defaults.
5. Reemplazar Cloudinary upload en PropertyAddForm y PropertyEditForm para usar:
   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
   - NEXT_PUBLIC_CLOUDINARY_FOLDER
6. Mantener server-side Cloudinary con CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET para delete/maintenance.
7. Agregar prefijo configurable para Vercel Blob en PDFs/logos si aplica.
8. Actualizar SiteConfig defaults para Farias.
9. Actualizar metadata, sitemap, robots, favicon/logo placeholders y analytics allowlist.
10. Preparar .env.example para Farias sin secretos reales.
11. Ejecutar npm install si hace falta y npm run build.
12. Reportar todos los archivos modificados y cualquier valor pendiente.

Archivos a tocar probablemente
- app/layout.jsx
- app/robots.js
- app/sitemap.js
- models/SiteConfig.js
- utils/analytics.js
- components/GoogleAnalytics.jsx
- components/PropertyAddForm.jsx
- components/PropertyEditForm.jsx
- components/shared/MapConfig.jsx
- app/api/quotations/upload-logo/route.js
- app/api/quotations/[id]/generate-pdf/route.js
- next.config.mjs
- .env.example
- opcional: config/site.js o config/client.js

Restricciones
- No tocar C:\Projects\property-pulse-nextjs salvo lectura o si Juan aprueba explícitamente trabajar sobre ese repo.
- No copiar .env.local ni secretos de Roggero.
- No usar MONGODB_URI de Roggero.
- No usar Cloudinary cloud/preset de Roggero.
- No usar GA4 de Roggero.
- No dejar textos públicos de Roggero en Farias.
- No deployar producción sin aprobación.

Criterios de aceptación
- Build local pasa.
- No hay referencias públicas a Roggero en la copia.
- Cloudinary usa variables Farias, no hardcodes.
- MongoDB apunta a variable propia.
- Vercel Blob tiene aislamiento por token/store o prefix.
- Analytics permite dominio Farias y excluye admin.
- NextAuth queda listo para callbacks Farias.
- .env.example lista todas las variables necesarias sin secretos.
```

---

## 18. Recomendación final

Avanzar en este orden:

1. Definir dominio y datos de Farias.
2. Crear cuentas/recursos separados mínimos: MongoDB, Cloudinary, Vercel project, OAuth, GA4.
3. Pedir a Antigravity la fase inicial de copia + parametrización.
4. Recién después cargar contenido/propiedades y probar admin.

La decisión más importante: **no reutilizar Cloudinary ni MongoDB de Roggero sin aislamiento**. Es el punto con más riesgo real en una duplicación.
