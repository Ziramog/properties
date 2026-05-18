# Admin Panel — Roggero & Roma

## Estructura de rutas

```
app/admin/
  layout.jsx              ← Sidebar (desktop) + Drawer (mobile) — navegación global
  page.jsx                ← Panel de Control (dashboard: stats + últimas propiedades)
  properties/
    page.jsx              ← Tabla ABM de propiedades (editar, eliminar, destacar)
  quotes/
    page.jsx              ← Lista de presupuestos con filtros por estado
    create/
      page.jsx            ← Crear presupuesto (elige propiedad, completa items)
    [id]/
      page.jsx            ← Ver presupuesto + cambiar estado + enviar por WA
  profile/
    page.jsx              ← Perfil: plan, suscripción, configuración, pagos
```

## Sidebar Navigation

| Icon | Ruta | Descripción |
|------|------|-------------|
| 📊 | `/admin` | Panel de Control |
| 🏠 | `/admin/properties` | Gestión de propiedades |
| 📋 | `/admin/quotes` | Presupuestos |
| 👤 | `/admin/profile` | Perfil y configuración |

## Componentes compartidos

### `app/admin/layout.jsx`
- **Desktop**: sidebar fijo de 240px, logo, navegación, usuario activo, botón cerrar sesión
- **Mobile**: top bar con hamburger button → drawer slide-in con overlay
- Cierra drawer automáticamente al navegar
- Resalta la sección activa con `border-r-2 border-[var(--color-brand)]`

## Modelos

### `models/Quote.js`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `property` | ObjectId → Property | Propiedad asociada |
| `client.name` | String | Nombre del cliente |
| `client.email` | String (opcional) | Email |
| `client.phone` | String (opcional) | Teléfono |
| `items[]` | Array | Items del presupuesto |
| `items[].description` | String | Descripción del ítem |
| `items[].amount` | Number | Monto |
| `items[].currency` | String | U$D o $ |
| `totalAmount` | Number | Suma total calculada |
| `status` | Enum | draft, sent, accepted, rejected |
| `validUntil` | Date (opcional) | Vigencia |
| `notes` | String (opcional) | Notas internas |
| `createdBy` | ObjectId → User | Quién lo creó |
| `timestamps` | — | createdAt, updatedAt |

### `models/Payment.js`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `amount` | Number | Monto del pago |
| `currency` | Enum | U$D, $, ARS |
| `status` | Enum | paid, pending, overdue, cancelled |
| `plan` | Enum | free, pro, enterprise |
| `paymentMethod` | String | Método de pago |
| `transactionId` | String | ID de transacción |
| `periodStart/End` | Date | Período facturado |

## Server Actions

| Acción | Archivo | Descripción |
|--------|---------|-------------|
| `addQuote(formData)` | `app/actions/addQuote.js` | Crea presupuesto + redirect |
| `updateQuoteStatus(id, status)` | `app/actions/updateQuoteStatus.js` | Cambia estado (sent/accepted/rejected) |
| `deleteQuote(id)` | `app/actions/deleteQuote.js` | Elimina presupuesto |

## Seguridad

`middleware.js` protege todas las rutas bajo `/admin/`:
```js
if (path.startsWith('/properties/add') || path.startsWith('/admin') || path.match(/\/properties\/[^/]+\/edit/)) {
  // Requiere role === 'admin'
}
```

## Clonación para nueva agencia

Para agregar otro cliente:
1. Clonar el repositorio
2. Cambiar `.env` (nueva MongoDB URI, nuevo dominio)
3. Actualizar marca en `components/Navbar.jsx` y `components/Footer.jsx`
4. `vercel deploy --prod`
5. El admin panel ya funciona con la nueva DB

## Planes futuros

- Módulo de Analytics (vistas por propiedad, leads)
- CRM de clientes
- Calculadora de honorarios
- Integración con MercadoPago para pagos recurrentes
- Exportar presupuestos a PDF
- Rol multi-agente dentro de la misma agencia
