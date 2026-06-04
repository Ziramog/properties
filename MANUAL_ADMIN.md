# Manual de Administración — Roggero & Roma Inmobiliaria

> **Propósito:** Este manual explica cada pantalla del panel de administración y cómo tus acciones impactan en la web que ven los clientes.

---

## Índice

1. [Roles y Accesos](#1-roles-y-accesos)
2. [Panel de Control (Dashboard)](#2-panel-de-control-dashboard)
3. [Gestión de Propiedades](#3-gestión-de-propiedades)
4. [Propuestas Comerciales (Quotations)](#4-propuestas-comerciales-quotations)
5. [Reseñas de Google](#5-reseñas-de-google)
6. [Comunidad WhatsApp](#6-comunidad-whatsapp)
7. [Perfil y Configuración](#7-perfil-y-configuración)
8. [Resumen de Impactos](#8-resumen-de-impactos)

---

## 1. Roles y Accesos

| Rol | Acceso |
|-----|--------|
| **Cliente** | Solo navegar la web |
| **Admin** | Panel completo `/admin/*` — vos (Franco) y tu equipo |

### Impacto en el producto

- La web **no muestra ninguna diferencia** entre un usuario cliente y un admin. El panel es interno.
- El botón **"Panel de Control"** en la Navbar solo aparece si tu sesión tiene rol `admin`.
- Un cliente **nunca puede acceder** a `/admin/*`; si escribe la URL, el sistema lo redirige automáticamente al listado público de propiedades.
- El middleware protege también `/properties/add` y `/properties/:id/edit` (solo admins pueden crear/editar).

---

## 2. Panel de Control (Dashboard)

**Ruta:** `/admin`

### ¿Qué ves? Tres bloques

#### a) Estadísticas globales (3 tarjetas grandes)

Cada tarjeta es un link al listado de propiedades con el filtro correspondiente.

| Tarjeta | Se calcula como... | Impacto en el producto |
|---------|--------------------|------------------------|
| **Total Propiedades** | `countDocuments({})` — TODAS las propiedades | Te dice el tamaño total de tu cartera. Incluye propiedades ocultas, vendidas, inactivas. |
| **Activas** | `countDocuments({ status: 'active' })` | Son las que en la web figuran como disponibles. Si este número es bajo, tu catálogo visible está reducido. |
| **Destacadas** | `countDocuments({ is_featured: true })` | Son las que aparecen primero en la homepage y en listados públicos. |

#### b) Categorías (6 tarjetas)

Cada tarjeta cuenta propiedades por tipo y linkea al listado pre-filtrado.

| Tarjeta | Link |
|---------|------|
| **Casa** | `/admin/properties?type=Casa` |
| **Departamento** | `/admin/properties?type=Departamento` |
| **Campo** | `/admin/properties?type=Campo` |
| **Terreno** | `/admin/properties?type=Terreno` |
| **Inmueble Comercial** | `/admin/properties?type=Inmueble%20Comercial` |
| **Gran Inversión** | `/admin/properties?granInversion=true` |

> **Gran Inversión** no es un tipo real en la base. Se calcula en el momento filtrando propiedades donde `price >= U$S 300.000` o `square_feet >= 10.000`.

#### c) Atajos de navegación (4 tarjetas)

| Tarjeta | Ruta | Para qué |
|---------|------|----------|
| **Comunidad** | `/admin/subscribers` | Gestionar base de leads de WhatsApp |
| **Propuestas** | `/admin/quotations` | Presupuestos formales con PDF |
| **Perfil** | `/admin/profile` | Logo, firma, tipo de cambio, contacto |
| **Reseñas** | `/admin/reviews` | Testimonios de Google + manuales |

---

## 3. Gestión de Propiedades

**Ruta:** `/admin/properties`

### La tabla

| Columna | Visible en | Detalle |
|---------|------------|---------|
| **Propiedad** (thumbnail + nombre + ciudad) | Siempre | Link al detalle público de la propiedad |
| Tipo | Desktop | Casa, Depto, Campo, Terreno, Comercial |
| Operación | Desktop | Venta / Alquiler (con badge de color) |
| Precio | Desktop | Precio formateado o "Consultar" |
| Fotos | Desktop | Cantidad de imágenes cargadas |
| **★ Dest.** | Siempre | Botón para marcar/desmarcar como Destacada |
| **👁 Pub.** | Siempre | Botón para publicar/ocultar la propiedad |
| **Acciones** | Siempre | Editar / Eliminar |

### Buscador y filtros

- **Búsqueda por texto:** Busca por nombre o ciudad.
- **Filtro Tipo:** Casa / Departamento / Campo / Terreno / Comercial
- **Filtro Operación:** Venta / Alquiler
- **Filtro Destacada:** Sí / No
- **Filtro Estado:** Precio Mejorado / Última Unidad / Único en su Tipo / Nueva / Mejor Precio del Mercado
- **Filtro Gran Inversión:** Sí / No

Botón **"Limpiar"** para resetear todos los filtros.
Botón **"+ Agregar"** para crear una propiedad nueva.

### Acciones y su impacto en la web

#### ★ Destacada

```
Qué hace → Setea `is_featured = true`.
Impacto:
  - La propiedad aparece en la sección "Destacadas" de la homepage
  - En listados públicos, las destacadas aparecen primero
  - No hay badge visual en la ficha pública (es un ordenamiento interno)
```

#### 👁 Publicar / Ocultar

```
Qué hace → Setea `is_published = true/false`.
Impacto:
  - Si está oculta: NO aparece en ningún listado público, búsqueda
    ni homepage. Es como si no existiera para el visitante.
  - Si está publicada: visible para todo el mundo.
  - Útil para: propiedades vendidas que querés ocultar sin borrar,
    o propiedades en preparación.
```

#### Editar

Te lleva al formulario con todos los campos: nombre, descripción, precio, tipo, operación, estado, ubicación, características (dormitorios, baños, superficie, cocheras), imágenes (subir, reordenar, eliminar), amenities, estado de títulos.

**Impacto:** Los cambios son inmediatos. Al guardar, la web se actualiza al toque.

#### Eliminar

```
⚠️ Confirmación: "¿Eliminar X? Esta acción no se puede deshacer."
Impacto:
  - La propiedad desaparece COMPLETAMENTE del sistema.
  - Las imágenes se borran de Cloudinary.
  - ❌ NO SE PUEDE RECUPERAR.
```

---

## 4. Propuestas Comerciales (Quotations)

**Ruta:** `/admin/quotations`

Este módulo permite crear propuestas formales con propiedades seleccionadas, condiciones de pago y PDF descargable.

### Estadísticas (4 tarjetas)

| Tarjeta | Qué indica |
|---------|------------|
| **Total** | Todas las propuestas creadas |
| **Borradores** | En preparación, el cliente no las vio |
| **Enviadas** | Marcadas como enviadas |
| **Aceptadas** | El cliente aceptó |

### Estados del ciclo de vida

| Estado | Color | Cómo se setea |
|--------|-------|---------------|
| **Borrador** | Gris | Al crear |
| **Enviado** | Azul | Manualmente |
| **Visto** | Ámbar | **Automático** — cuando el cliente abre el link público `/p/[token]` |
| **Aceptado** | Verde | Manualmente |
| **Rechazado** | Rojo | Manualmente |
| **Vencido** | Gris oscuro | Manualmente |

> El estado **"Visto"** es automático. El sistema detecta si el cliente abrió el link de seguimiento. Así sabés si realmente leyó la propuesta.

### Columnas de la tabla

| Columna | Detalle |
|---------|---------|
| **N°** | Número correlativo |
| **Cliente** | Nombre |
| **Propiedad** | Título de la 1ra propiedad |
| **Total** | Suma en U$D |
| **Estado** | Selector desplegable para cambiar el estado al instante |
| **Fecha** | Fecha de creación |
| **Acciones** | Ver PDF / Copiar link público / Eliminar |

### Crear propuesta (wizard 5 pasos)

**Ruta:** `/admin/quotations/new`

#### Paso 1 — Propiedad(es)

Seleccionás entre 1 y 3 propiedades del catálogo (incluye propiedades no publicadas). Se usa el precio actual de cada una.

#### Paso 2 — Cliente

Nombre, email, teléfono, DNI, notas. Estos datos quedan grabados para siempre en la propuesta.

#### Paso 3 — Condiciones de Pago

| Modalidad | Qué hace |
|-----------|----------|
| **Contado** | Precio total. Podés setear un porcentaje de seña inicial. |
| **Financiado** | Sistema de amortización **francés** (cuota fija). Configurás: % seña, cantidad de cuotas, tasa de interés. El sistema calcula automáticamente el valor de cada cuota, el total con intereses, y los intereses generados. |

#### Paso 4 — Personalización

| Opción | Impacto |
|--------|---------|
| **Plantilla** | Elegís entre "moderna" u "original" (cambia el diseño del PDF) |
| **Descripción con IA** | Si lo activás, al generar la propuesta OpenAI redacta una descripción profesional de la propiedad automáticamente |
| **Notas del asesor** | Texto libre al final del PDF |
| **Vigencia** | Fecha hasta la cual la propuesta es válida |

#### Paso 5 — Generar

El sistema crea la propuesta + genera el PDF. Te muestra botón para **descargar PDF** y otro para **copiar link público** de seguimiento.

### Acciones disponibles

| Acción | Qué hace |
|--------|----------|
| **Ver PDF** | Abre el PDF en pestaña nueva |
| **Copiar Link** | Copia al portapapeles el link `/p/[token]` para enviar al cliente |
| **Eliminar** | Borra la propuesta con confirmación |
| **Cambiar Estado** | Selector directo en la tabla que actualiza al instante |

### Diferencia con Quotes (sistema legacy)

`/admin/quotes` es un sistema más simple para presupuestos rápidos con items manuales. Las **Quotations** son el sistema completo y recomendado.

---

## 5. Reseñas de Google

**Ruta:** `/admin/reviews`

### Botones principales

| Botón | Impacto |
|-------|---------|
| **Sincronizar** | Llama a Google Places API, trae reseñas actualizadas. Agrega nuevas, actualiza existentes, elimina duplicadas. Muestra un resumen: "X nuevas, Y actualizadas, Z duplicadas eliminadas". |
| **+ Agregar** | Muestra formulario para agregar reseñas manualmente. Útil para testimonios que no vienen de Google. |

### Tabla de reseñas

| Columna | Control | Impacto en la web |
|---------|---------|-------------------|
| **Autor** | — | Nombre del autor del testimonio |
| **★ (Rating)** | — | Las estrellas se muestran tal cual en la web |
| **Reseña** | — | Texto visible en la sección Testimonials de la homepage |
| **Fecha** | — | Ordenamiento cronológico |
| **Dest.** | Botón ★ | Si está activo (rojo), la reseña aparece destacada. Las destacadas tienen prioridad visual. |
| **Visibilidad** | Botón 👁 | Verde = visible en la web. Rojo = oculta (sigue en DB pero no se muestra al público) |
| **Prior. (− / +)** | Botones | Controla el orden: mayor número = más arriba aparece |
| **Del** | 🗑 | Elimina la reseña permanentemente |

### Estadísticas

| Indicador | Significado |
|-----------|-------------|
| **Total** | Cantidad total de reseñas |
| **Destacadas** | Reseñas marcadas como featured |
| **Ocultas** | Reseñas ocultas (no visibles) |
| **★ Google** | Rating oficial de Google + cantidad de reseñas (si se sincronizó) |

### Agregar reseña manual

Campos: nombre del autor (obligatorio), rating 1-5, fecha, texto, ¿destacada?.

**Útil para:** testimonios de clientes que te llegan por WhatsApp y querés mostrar en la web como si fueran de Google.

### ⚠️ Impacto directo

La sección **Testimonials** de la homepage muestra:
1. Reseñas con `featured = true` primero
2. Ordenadas por `priority` descendente
3. Solo las que tienen `hidden = false`
4. El rating promedio general (sincronizado con Google)

**Si ocultás todas las reseñas, la sección Testimonials desaparece de la homepage.**

---

## 6. Comunidad WhatsApp

**Ruta:** `/admin/subscribers`

### Panel izquierdo — Configuración

#### Link de invitación al grupo

```
Qué es → El enlace al grupo de WhatsApp al que se redirige a los
usuarios después de suscribirse desde el Footer de la web.

Impacto en el producto:
  - En el Footer hay un botón "Unite a nuestra comunidad WhatsApp"
  - El usuario ingresa su número → se guarda en la DB → se lo
    redirige a este link
  - Si el link está vacío → el usuario se registra pero no llega
    a ningún lado
```

#### Estadística

Muestra el número total de suscriptores.

### Panel derecho — Directorio de números

| Columna | Detalle |
|---------|---------|
| **Teléfono** | Número de WhatsApp. Es un link que abre `wa.me/[numero]` para contactarlo directamente. |
| **Fecha de Ingreso** | Cuándo se suscribió |
| **Estado** | "Activo" siempre (los suscriptores no se dan de baja desde el admin) |

### Exportar CSV

Descarga un CSV con todos los números para backup o campañas de difusión.

---

## 7. Perfil y Configuración

**Ruta:** `/admin/profile`

### 1 — Datos del Usuario

- **Avatar:** Imagen de perfil de tu cuenta
- **Nombre del agente:** Impacta en el nombre que aparece en las propuestas PDF

### 2 — Plan Actual

Informativo. Muestra "Pro - U$D 25/mes - Activo". No hay pagos recurrentes conectados.

### 3 — Logo de la Inmobiliaria

```
Impacto: Aparece en el PDF de las propuestas (esquina superior).
NO aparece en la web (el logo del Navbar se configura en código).
Tamaño ideal: PNG ~200x200px con fondo transparente.
```

### 4 — Tipo de Cambio (ARS/USD)

```
Impacto: En las propuestas PDF, si el precio está en U$D, calcula
y muestra el equivalente en pesos argentinos.
NO convierte precios en la web ni en la base de datos.
Si no lo configurás, las propuestas muestran solo U$D.
```

### 5 — Configuración de Contacto

| Campo | Dónde aparece |
|-------|---------------|
| **Email** | En el PDF de propuestas |
| **WhatsApp** | En el PDF de propuestas |
| **Dirección** | En el PDF de propuestas |

### 6 — Historial de Pagos

Tabla informativa de pagos registrados. No hay pasarela conectada.

### 7 — Firma Digital

```
Pad de dibujo para tu firma con el mouse o touch.
Impacto: Aparece al final del PDF de las propuestas,
dándole un aspecto profesional y formal.
```
---

## 8. Resumen de Impactos

### ¿Qué afecta a la HOMEPAGE?

| Sección de la homepage | Lo controlás desde... |
|------------------------|----------------------|
| Hero, About y Footer | Lo configura el desarrollador (está en el código) |
| Propiedades en Mapa | Automático — propiedades publicadas con coordenadas |
| Propiedades Destacadas | `/admin/properties` — ★ Destacada |
| Testimonios | `/admin/reviews` — featured + no ocultas, ordenadas por priority |

### ¿Qué afecta a las FICHAS DE PROPIEDAD?

| Elemento | Lo controlás desde... |
|----------|----------------------|
| Todos los datos | Formulario de agregar/editar propiedad |
| Visibilidad pública | Botón Pub. (👁) en la tabla |
| Featured (orden) | Botón Dest. (★) en la tabla |
| Botón WhatsApp | Contacto configurado en `/admin/profile` |

### ¿Qué afecta a las PROPUESTAS (PDF)?

| Elemento | Lo controlás desde... |
|----------|----------------------|
| Logo | `/admin/profile` |
| Firma | `/admin/profile` |
| Tipo de cambio | `/admin/profile` |
| Contacto | `/admin/profile` |
| Datos del cliente | Wizard paso 2 |
| Precios y condiciones | Wizard paso 3 |
| Descripción | Wizard paso 4 (manual o IA) |
| Plantilla | Wizard paso 4 |

### ¿Qué NO se puede cambiar desde el admin?

- **Colores de marca** (acento Roma #E94560)
- **Estructura de navegación** (Navbar, Footer links)
- **Textos del Hero, About y Footer** (lo modifica el desarrollador)
- **Imágenes del Hero**
- **Tipografía**
- **Disposición de secciones** (orden Hero → Mapa → Destacadas → Testimonios → Footer está hardcodeado)

---

> Documento generado para Roggero & Roma Inmobiliaria — Junio 2026
