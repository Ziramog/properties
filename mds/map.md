Para cambiar el aspecto de tu mapa a uno más limpio y profesional (como el de las aplicaciones inmobiliarias modernas), solo necesitas actualizar la URL del TileLayer en tu configuración de Leaflet.
Aquí tienes los enlaces y cómo implementarlos:
1. La opción ganadora: CartoDB Positron
Es un mapa en tonos grises muy claros. Esto hace que tus marcadores naranjas de precios "salten" a la vista y el diseño general se vea mucho más espacioso.
URL: https://{s}://{z}/{x}/{y}{r}.png
Atribución: &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>
2. Cómo aplicarlo en tu código
Dependiendo de cómo estés usando Leaflet en tu proyecto de Next.js, así se vería la implementación:
javascript
// Si usas React-Leaflet
import { TileLayer } from 'react-leaflet';

<TileLayer
  url="https://{s}://{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
/>
Usa el código con precaución.
3. El toque extra: Los Marcadores (Pins)
En tu imagen, los marcadores son rectángulos naranjas. Para que se vean mejor sobre el fondo claro de CartoDB:
Sombra: Agregales una sombra pequeña (box-shadow: 0 2px 4px rgba(0,0,0,0.2)).
Hover: Hacé que aumenten un poquito de tamaño cuando el usuario pase el mouse por arriba (transform: scale(1.1)).
Contraste: Si el fondo es muy blanco, el naranja que ya tenés funcionará perfecto, pero asegurate de que el texto interior sea blanco puro para máxima legibilidad.