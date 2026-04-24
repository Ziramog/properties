Para que tus etiquetas de precio se vean profesionales y se sientan integradas al mapa minimalista que vas a poner, necesitamos usar Custom DivIcons de Leaflet combinados con Tailwind CSS.
Aquí tienes el código para lograr un efecto de "etiqueta flotante" con sombra y puntero sutil:
1. El CSS (Tailwind) para la Etiqueta
Agrega estas clases en tu archivo global o dentro del componente. El truco es el pseudo-elemento para la flechita de abajo:
css
/* Estilo para el marcador de precio */
.price-tag {
  @apply bg-orange-600 text-white font-bold py-1 px-3 rounded-lg shadow-lg transition-all duration-200;
  position: relative;
  white-space: nowrap;
  font-size: 13px;
}

/* La flechita de abajo del pin */
.price-tag::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: #ea580c transparent transparent transparent; /* El color orange-600 */
}

/* Efecto Hover */
.price-tag:hover {
  @apply bg-orange-700 scale-110 -translate-y-1;
  z-index: 1000 !important;
}
Usa el código con precaución.
2. Implementación en Leaflet (Next.js)
Cuando creas tus marcadores, usa L.divIcon para inyectar esas clases de Tailwind.
javascript
import L from 'leaflet';

const createPriceIcon = (price) => {
  return L.divIcon({
    className: 'custom-div-icon', // Clase base necesaria para Leaflet
    html: `<div class="price-tag">USD ${price}</div>`,
    iconSize: [80, 30], // Ajusta según el tamaño de tu etiqueta
    iconAnchor: [40, 30], // Punto de anclaje (mitad del ancho, base de la etiqueta)
  });
};

// Dentro de tu .map() de propiedades:
<Marker 
  position={[prop.lat, prop.lng]} 
  icon={createPriceIcon(prop.price)} 
/>
Usa el código con precaución.
Por qué esto mejora tu diseño actual:
Jerarquía Visual: Al quitar el fondo gris oscuro de OSM y poner el de CartoDB, el naranja ya no compite con el entorno.
Profundidad: La sombra (shadow-lg) separa la etiqueta del mapa, dándole un aspecto de "capa" superior.
Feedback al Usuario: La transición al pasar el mouse (scale-110) le confirma al usuario que ese elemento es cliqueable.
Limpieza: La flechita pequeña en la base (el ::after) indica la ubicación exacta de la propiedad de forma mucho más elegante que un rectángulo solo.
Un último consejo visual:
Para las propiedades que el usuario ya visitó (hizo clic), podrías cambiar la clase de bg-orange-600 a un bg-slate-400. Así, el usuario tiene un "rastro" visual de lo que ya vio mientras navega el mapa.