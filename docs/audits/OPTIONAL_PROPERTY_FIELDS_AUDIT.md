# Auditoría Funcional: Campos Opcionales en Propiedades (Baños y Dormitorios)

## 1. Causa Exacta del Bloqueo Actual
El bloqueo proviene de la capa de presentación (HTML Frontend). En el formulario de creación, los campos de "Dormitorios" y "Baños" poseen el atributo estático `required`. El navegador impide el envío nativamente si estos inputs están vacíos. 

## 2. Archivos y Líneas Responsables
- **Alta**: `components/PropertyAddForm.jsx`. Líneas 274, 278, y 282. (`<input ... required />`).
- **Edición**: `components/PropertyEditForm.jsx`. Líneas 342, 346 y 350. (Los atributos `required` **no existen** aquí).
- **Backend (Alta)**: `app/actions/addProperty.js`. Líneas 58-60. 
- **Backend (Edición)**: `app/actions/updateProperty.js`. Líneas 121-123.
- **Modelo DB**: `models/Property.js`. Líneas 38-46.

## 3. Flujo Completo (Desde Formulario hasta MongoDB)
1. **Frontend**: El usuario intenta enviar el formulario. Si está vacío, el navegador bloquea por el atributo `required`.
2. **Server Action**: Si lograra pasar (o si es edición), los campos llegan vía `formData.get('beds')`. El código hace `formData.get('beds') || undefined`. Esto significa que si llega vacío `""`, lo transforma explícitamente a `undefined`.
3. **Mongoose**: El esquema define `{ type: Number }` sin `required: true`. Al recibir `undefined`, Mongoose omite la propiedad en el documento insertado.

## 4. Diferencias entre Agregar y Editar
- **Formulario Add**: Los inputs son rígidamente `required`.
- **Formulario Edit**: Los inputs **no** tienen `required`. Actualmente, si editas una propiedad y borras el valor de los dormitorios, se guardará como `undefined` sin ningún error.

## 5. Impacto sobre Propiedades Existentes
**Nulo.** Dado que la base de datos ya permite omisiones (`undefined`), y las validaciones no son retroactivas en Mongoose para campos no requeridos, las propiedades existentes no sufrirán ninguna alteración ni requerirán scripts de migración.

## 6. Impacto sobre Frontend, Filtros, SEO y PDFs
El código del frontend es altamente defensivo y ya está preparado para la ausencia de estos datos:
- **Tarjetas y Galerías** (`FeaturedPropertyCard.jsx`, `MapProperties.jsx`): Emplean validaciones como `{property.beds != null && (...) }`. Si no hay dato, el ícono y el número simplemente desaparecen.
- **Detalle y Sidebar** (`PropertyDetails.jsx`, `MapPropertySidebar.jsx`): Renderizan un guion (`'-'`) si el valor es `null/undefined`.
- **Buscador/Filtros** (`GoogleMapPilot.jsx`, `MapAllProperties.jsx`): La conversión `parseInt(p.beds, 10)` arrojaría `NaN` y fallaría la evaluación `>= minBeds`, excluyéndola de búsquedas estrictas (lo cual es correcto, si un usuario busca estrictamente "2 dormitorios", un lote no debe aparecer).

## 7. Recomendación Funcional
**Alternativa A: Dormitorios y baños opcionales únicamente para lotes/terrenos.**
*Justificación*: La lógica del negocio ya reconoce esta distinción. En `PropertyAddForm.jsx` (línea 142), la función de Inteligencia Artificial usa la constante `const isLand = type === 'Terreno' || type === 'Campo' || type === 'Gran Inversión';` para eximir a estas propiedades de proveer camas/baños. Extender este estado al formulario en sí mantendrá la coherencia y forzará datos completos para viviendas, manteniendo la integridad del inventario.

## 8. Plan de Implementación Mínimo (Realizado)
1. **Elevar el estado del Tipo**: En `PropertyAddForm.jsx`, se creó un estado controlado `const [type, setType] = useState('')` para rastrear la selección.
2. **Derivar `isLandOrCommercial`**: Se configuró la regla `['Terreno', 'Campo', 'Gran Inversión', 'Inmueble Comercial'].includes(type)`.
3. **Condicionar HTML**: Se modificó el formulario de camas y baños a `<input required={!isLandOrCommercial} />` y se agregó un texto explicativo (Opcional para este tipo de propiedad).
- **Backend intacto**: La decisión de negocio fue *no agregar validación bloqueante extra al backend* porque la arquitectura ya soportaba `undefined` nativamente, garantizando cero fricciones en base de datos ni scripts de migración.
- **Alcance mínimo**: La solución afectó únicamente a `PropertyAddForm.jsx`. No hubo necesidad de alterar `PropertyEditForm.jsx`, `Property.js` ni los endpoints.

## 10. Casos de Prueba Necesarios
1. Crear propiedad "Casa" sin dormitorios $\rightarrow$ Fallo en UI.
2. Crear propiedad "Terreno" sin dormitorios $\rightarrow$ Éxito, guardado con éxito.
3. Editar "Terreno" borrando dormitorios $\rightarrow$ Éxito.
4. Renderizar "Terreno" público $\rightarrow$ Íconos de camas/baños ausentes sin errores.

## 11. Riesgos y Estrategia de Reversión
- **Riesgos**: Mínimos. La retrocompatibilidad de la base de datos está comprobada y los componentes reaccionan bien.
- **Reversión**: Devolver el atributo estático `required` a los inputs y un simple `git revert`.

## 12. Preguntas de Negocio Pendientes
- ¿Deberían los "Inmuebles Comerciales" exigir baños obligatoriamente? (Algunos locales de galería no poseen baños propios). Se asume opcional en el plan, pero requiere validación comercial.

## 13. Notas de Despliegue (Post-Mortem Vercel)
Durante el despliegue a producción de esta funcionalidad, se observó que la integración del PR a `main` mediante CLI/API no desencadenó automáticamente el build en el proyecto Vercel `properties-srs5`. El código de producción permaneció desactualizado a pesar del merge en GitHub. Fue necesario ejecutar un commit vacío manual (`git commit --allow-empty -m "trigger: vercel production build"`) sobre la rama `main` para forzar a Vercel a registrar el cambio y desplegar correctamente.
