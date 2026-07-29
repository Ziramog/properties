/**
 * searchSemantics.js
 * Utilidades para la interpretación semántica de términos de búsqueda en el buscador.
 */

const typeSynonyms = {
  'Terreno': ['lote', 'lotes', 'terreno', 'terrenos', 'parcela', 'parcelas', 'loteo', 'loteos'],
  'Casa': ['casa', 'casas', 'chalet', 'duplex', 'triplex', 'vivienda'],
  'Departamento': ['departamento', 'departamentos', 'depto', 'deptos', 'dpto', 'piso', 'semipiso'],
  'Inmueble Comercial': ['local', 'locales', 'oficina', 'oficinas', 'galpon', 'galpones', 'deposito', 'comercial', 'comercio', 'fondo de comercio'],
  'Campo': ['campo', 'campos', 'chacra', 'chacras', 'finca', 'estancia'],
  'Gran Inversión': ['inversion', 'inversiones', 'desarrollo', 'edificio', 'hotel', 'complejo']
};

const operationSynonyms = {
  'Venta': ['venta', 'vendo', 'comprar', 'compro', 'compra'],
  'Alquiler': ['alquiler', 'alquilo', 'alquilar', 'renta', 'rento', 'arriendo']
};

/**
 * Interpreta un término de búsqueda para extraer la operación, el tipo de propiedad 
 * y limpiar el término restante de la búsqueda literal.
 * 
 * @param {string} rawTerm - El texto que el usuario ingresó en la barra de búsqueda
 * @returns {object} - { term: string, type: string | null, operation: string | null }
 */
export function interpretSearchTerm(rawTerm) {
  if (!rawTerm || typeof rawTerm !== 'string') {
    return { term: '', type: null, operation: null };
  }

  // Normalizamos el texto (minúsculas, sin acentos)
  const normalizedText = rawTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Separamos en palabras
  const words = normalizedText.split(/\s+/).filter(w => w.length > 0);
  
  let detectedType = null;
  let detectedOperation = null;
  
  const remainingWords = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let matched = false;

    // Buscar tipo
    if (!detectedType) {
      for (const [mappedType, synonyms] of Object.entries(typeSynonyms)) {
        if (synonyms.includes(word)) {
          detectedType = mappedType;
          matched = true;
          break;
        }
      }
    }

    // Buscar operación
    if (!detectedOperation && !matched) {
      for (const [mappedOp, synonyms] of Object.entries(operationSynonyms)) {
        if (synonyms.includes(word)) {
          detectedOperation = mappedOp;
          matched = true;
          break;
        }
      }
    }

    // Remover preposiciones comunes si hubo matching alrededor
    if (['en', 'de', 'para'].includes(word) && remainingWords.length === 0) {
        matched = true; 
    }

    if (!matched) {
      remainingWords.push(words[i]); // Mantenemos la palabra original (sin normalizar para la búsqueda exacta)
    }
  }

  // Reconstruimos el texto con las palabras originales que no fueron clasificadas
  // Para las originales, usamos el split del rawTerm
  const originalWords = rawTerm.split(/\s+/).filter(w => w.length > 0);
  const finalTermParts = [];
  
  for (const origWord of originalWords) {
    const norm = origWord.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Verificamos si la versión normalizada fue mapeada a operación o tipo
    let isKeyword = false;
    
    for (const synonyms of Object.values(typeSynonyms)) {
       if (synonyms.includes(norm)) { isKeyword = true; break; }
    }
    for (const synonyms of Object.values(operationSynonyms)) {
       if (synonyms.includes(norm)) { isKeyword = true; break; }
    }
    
    if (['en', 'de', 'para'].includes(norm) && finalTermParts.length === 0 && isKeyword) {
        isKeyword = true; // Drop prepositions at the start if related to keyword
    }

    if (!isKeyword) {
      finalTermParts.push(origWord);
    }
  }

  // Unir y limpiar espacios
  let finalTerm = finalTermParts.join(' ').trim();

  // Si queda un "en" o "de" suelto al principio, lo sacamos
  finalTerm = finalTerm.replace(/^(en|de|para)\s+/i, '');

  return {
    term: finalTerm,
    type: detectedType,
    operation: detectedOperation
  };
}
