# SEO — Roggero & Roma Inmobiliaria

> Trabajo realizado en Junio 2026 para mejorar cómo Google encuentra, entiende y muestra el sitio en sus resultados.

---

## 1. ¿Qué hicimos?

### A. Eliminamos la página de Contacto
La página `/contact` estaba duplicando funcionalidad que ya existe en múltiples botones de WhatsApp, email y teléfono distribuidos por todo el sitio. Esto simplifica la navegación y evita que Google indexe una página con poco valor.

### B. Creamos una imagen para redes sociales
Ahora cuando alguien comparte cualquier link de la web (por WhatsApp, Facebook o Instagram), aparece una imagen profesional con el isologo de Roggero & Roma en lugar de un link vacío o genérico.

### C. Controlamos qué páginas ve Google y cuáles no
- **Sí indexamos**: homepage, propiedades, categorías (casas, departamentos, campos, etc.), mapa de propiedades.
- **No indexamos**: panel de administración, mensajes privados, perfil de usuario, página de favoritos, resultados de búsqueda interna, formularios de agregar/editar propiedades.

Esto evita que Google muestre al público páginas que solo sirven para uso interno.

### D. Mejoramos el mapa del sitio (Sitemap)
Le entregamos a Google una lista actualizada con todas las URLs importantes del sitio, incluyendo:
- Las 5 categorías principales de propiedades
- La división por operación (venta / alquiler)
- El mapa interactivo de propiedades

Google necesita este mapa para descubrir páginas que de otro modo podría no encontrar.

### E. Agregamos datos estructurados (Schema)
Le decimos a Google *exactamente* qué es cada página usando un lenguaje estandarizado que entienden los buscadores.

**En la homepage:**
- Quién es Roggero & Roma (dirección, teléfono, horarios, redes sociales)
- Que el sitio tiene un buscador interno de propiedades

**En cada propiedad individual:**
- Título, descripción, precio, ubicación, metros cuadrados, habitaciones, baños
- Coordenadas GPS exactas
- Tipo de operación (venta o alquiler)
- Migas de pan (breadcrumb) para que Google sepa dónde está cada propiedad dentro del sitio

Esto permite que aparezcan "rich snippets" (resultados enriquecidos) con precio, ubicación y fotos directamente en Google.

### F. Mejoramos los títulos y descripciones
Cada página ahora tiene un título y una descripción únicos que aparecen en los resultados de Google. Por ejemplo:
- Homepage: *"Roggero & Roma | Negocios Inmobiliarios en Alta Gracia, Córdoba"*
- Propiedades: *"Propiedades · Roggero & Roma"*
- Propiedad individual: *"[Nombre de la propiedad] · Alta Gracia"*

---

## 2. ¿En qué te beneficia esto?

| Beneficio | Por qué importa |
|---|---|
| **Apareces mejor en Google** | Google entiende quién sos, dónde estás y qué vendés. Eso te posiciona más arriba en búsquedas locales como *"inmobiliaria Alta Gracia"* o *"casas en venta Córdoba"*. |
| **Se ve profesional al compartir** | Los links en WhatsApp/Redes muestran imagen, título y descripción. Genera confianza antes de que entren al sitio. |
| **Google no muestra lo que no debe** | Nadie va a encontrar el panel de admin, los mensajes privados ni las búsquedas internas en Google. Protege la privacidad y evita confusión. |
| **Cada propiedad es un "anuncio" en Google** | Con los datos estructurados, tus propiedades pueden aparecer con foto, precio y ubicación directamente en los resultados de búsqueda, como si fuera un portal inmobiliario. |
| **Indexación más rápida** | El sitemap y robots.txt le dicen a Google exactamente qué rastrear y con qué frecuencia. Las propiedades nuevas aparecen en Google en horas, no en semanas. |

---

## 3. ¿Qué más se puede hacer?

### Inmediato (bajo esfuerzo, alto impacto)
- **Optimizar imágenes**: convertir todas las fotos de propiedades a formato WebP y lazy-loading para que el sitio cargue más rápido en mobile.
- **Core Web Vitals**: medir y mejorar métricas de velocidad que Google usa para rankear (especialmente en celulares).
- **Meta descriptions por propiedad**: hoy usan un texto genérico. Si se completan campos de descripción en cada propiedad, cada una tendrá un resumen único en Google.

### Mediano plazo (requiere trabajo de contenido)
- **Blog / guías locales**: artículos como *"¿Cuánto cuesta una casa en Alta Gracia?"*, *"Cómo comprar un campo en Córdoba"*. Atraen tráfico de personas que todavía no saben que buscan una inmobiliaria.
- **Páginas de barrio**: landing pages para zonas específicas (*"Casas en Alta Gracia Centro"*, *"Departamentos en Villa del Prado"*).
- **Reviews / testimonios**: integrar reseñas de Google Maps en el sitio para generar confianza y contenido fresco que Google valora.

### Avanzado (si el proyecto crece)
- **Google Business Profile**: vincular el perfil de Google Maps con el sitio para que aparezcan propiedades en el "map pack" local.
- **Backlinks locales**: aparecer en directorios de Córdoba, cámaras inmobiliarias, noticias locales. Google interpreta eso como "esta inmobiliaria es relevante en la región".
- **AMP o páginas ultra-rápidas**: para que las propiedades carguen instantáneamente desde los resultados de búsqueda de Google.

---

## 4. Estado actual del sitio

- ✅ Técnico SEO: **100% cubierto** (estructura, indexación, datos estructurados, OG image, sitemap, robots)
- ⚠️ Contenido SEO: **parcial** (faltan descripciones únicas por propiedad y contenido de blog)
- ❌ Performance móvil: **pendiente** (imágenes sin optimizar, posible LCP alto)

---

## 5. Dominios duales (.com y .com.ar)

**Situación:** el sitio va a operar con dos dominios, donde uno redirecciona al otro.

**Impacto SEO:**
- Si la redirección es **301 (permanente)**, Google entiende que son el mismo sitio. Todo el "poder" pasa al dominio principal. El secundario desaparece del índice (comportamiento correcto).
- Si la redirección es por JavaScript o 302 (temporal), puede duplicar analytics y confundir a Google.

**Qué hay que ajustar cuando se active:**
- `metadataBase` en `layout.jsx`
- URLs absolutas en `sitemap.xml`
- URL del sitemap en `robots.txt`
- URLs en los datos estructurados (JSON-LD de homepage y propiedades)
- OG image absoluta

> **Pendiente:** configurar dominio real y redirección 301. **Programado para mañana.**

---

> **Nota para el demo con Franco:** mostrarle cómo se ve el link de una propiedad al compartirlo por WhatsApp (imagen + título + descripción) y explicarle que cada propiedad ahora es indexable por Google como si fuera un anuncio individual.
