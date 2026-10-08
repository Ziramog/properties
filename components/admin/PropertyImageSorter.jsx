'use client';
import { useState } from 'react';
import Image from 'next/image';

const getRoleLabel = (index) => {
  if (index === 0) return 'PORTADA (MAIN)';
  if (index <= 6) return `MINI ${index}`;
  return 'GALERÍA';
};

const getRoleColorClass = (index) => {
  if (index === 0) return 'bg-[var(--color-brand)] text-white';
  if (index <= 6) return 'bg-blue-600 text-white';
  return 'bg-[#2a2a2a] text-gray-200';
};

const PropertyImageSorter = ({
  items,
  setItems,
  removedImages = [],
  onRemoveExisting,
  onUndoRemoveExisting,
  helperClass = 'text-[11px] text-gray-500 mt-1',
}) => {
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [isNumberingMode, setIsNumberingMode] = useState(false);
  const [numberedIds, setNumberedIds] = useState([]);

  // Move an item from fromIdx to toIdx
  const moveItem = (fromIdx, toIdx) => {
    if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0 || fromIdx >= items.length || toIdx >= items.length) {
      return;
    }
    const updated = [...items];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setItems(updated);
  };

  // Handle adding new files from input
  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newEntries = files.map((file, idx) => ({
      id: `new_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`,
      type: 'new',
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));

    setItems((prev) => [...prev, ...newEntries]);
    // Reset input so selecting the same file again works if needed
    e.target.value = '';
  };

  // Remove item at index
  const handleRemoveItem = (index) => {
    const target = items[index];
    if (!target) return;

    if (target.type === 'existing' && onRemoveExisting) {
      onRemoveExisting(target.url);
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
    setNumberedIds((prev) => prev.filter((id) => id !== target.id));
  };

  // Numbering mode handlers
  const startNumberingMode = () => {
    setNumberedIds([]);
    setIsNumberingMode(true);
  };

  const cancelNumberingMode = () => {
    setNumberedIds([]);
    setIsNumberingMode(false);
  };

  const toggleNumberedItem = (itemId) => {
    setNumberedIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const applyNumberingOrder = () => {
    if (numberedIds.length === 0) {
      setIsNumberingMode(false);
      return;
    }
    const numberedItems = numberedIds
      .map((id) => items.find((item) => item.id === id))
      .filter(Boolean);
    const remainingItems = items.filter((item) => !numberedIds.includes(item.id));
    setItems([...numberedItems, ...remainingItems]);
    setNumberedIds([]);
    setIsNumberingMode(false);
  };

  // Drag & Drop handlers (moves only on Drop to prevent jumping)
  const handleDragStart = (e, index) => {
    if (isNumberingMode) return;
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (isNumberingMode || draggedIdx === null) return;
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (isNumberingMode || draggedIdx === null) return;
    moveItem(draggedIdx, index);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div className="space-y-4">
      {/* Header + Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#161616] border border-[#2a2a2a] p-3.5 rounded-lg">
        <div>
          <p className="text-white text-sm font-bold">
            Orden de Fotos ({items.length})
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            La foto <span className="text-[var(--color-brand)] font-semibold">#1 es la Portada</span> y las fotos <span className="text-blue-400 font-semibold">#2 a #7</span> arman el mosaico principal y el carrusel de Instagram.
          </p>
        </div>

        {items.length > 1 && !isNumberingMode && (
          <button
            type="button"
            onClick={startNumberingMode}
            className="flex-shrink-0 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-xs font-bold px-3.5 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            <span>🔢</span>
            <span>Ordenar tocando (1, 2, 3...)</span>
          </button>
        )}
      </div>

      {/* Active Numbering Mode Banner */}
      {isNumberingMode && (
        <div className="bg-[#1e1a14] border-2 border-[var(--color-brand)] p-4 rounded-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-white text-sm font-bold flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-brand)] text-white text-xs">
                  {numberedIds.length}
                </span>
                Tocá las fotos en el orden en que querés que aparezcan (1°, 2°, 3°...)
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Podés elegir solo las primeras (ej. las 7 principales) y pulsar <strong>Aplicar orden</strong>: el resto quedará automáticamente detrás. Si te equivocás, volvé a tocar la foto para desmarcarla.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={applyNumberingOrder}
                disabled={numberedIds.length === 0}
                className="bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-xs font-bold px-3.5 py-2 rounded-md transition-colors"
              >
                ✓ Aplicar orden ({numberedIds.length})
              </button>
              <button
                type="button"
                onClick={() => setNumberedIds([])}
                disabled={numberedIds.length === 0}
                className="bg-[#2a2a2a] hover:bg-[#3a3a3a] disabled:opacity-40 text-white text-xs font-semibold px-3 py-2 rounded-md transition-colors"
              >
                ↺ Reiniciar
              </button>
              <button
                type="button"
                onClick={cancelNumberingMode}
                className="bg-transparent border border-[#555] hover:bg-[#2a2a2a] text-gray-300 text-xs font-semibold px-3 py-2 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item, i) => {
            const numberedOrder = numberedIds.indexOf(item.id);
            const isSelectedInNumbering = numberedOrder !== -1;
            const isBeingDragged = draggedIdx === i;
            const isDragTarget = dragOverIdx === i && draggedIdx !== null && draggedIdx !== i;

            return (
              <div
                key={item.id}
                draggable={!isNumberingMode}
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (isNumberingMode) toggleNumberedItem(item.id);
                }}
                className={`relative rounded-lg overflow-hidden border transition-all select-none ${
                  isNumberingMode
                    ? isSelectedInNumbering
                      ? 'border-[var(--color-brand)] ring-2 ring-[var(--color-brand)] cursor-pointer'
                      : 'border-[#333] hover:border-gray-400 cursor-pointer opacity-80 hover:opacity-100'
                    : isDragTarget
                    ? 'border-[var(--color-brand)] ring-2 ring-[var(--color-brand)] scale-[1.02]'
                    : isBeingDragged
                    ? 'opacity-40 border-dashed border-gray-400'
                    : i === 0
                    ? 'border-[var(--color-brand)]'
                    : 'border-[#333]'
                } bg-[#141414]`}
              >
                {/* Thumbnail */}
                <div className="relative w-full h-36 bg-[#0d0d0d]">
                  {item.type === 'existing' ? (
                    <Image
                      src={item.url}
                      alt={`Foto ${i + 1}`}
                      width={300}
                      height={220}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={`Nueva foto ${i + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  )}

                  {/* Badge NUEVA if pending upload */}
                  {item.type === 'new' && (
                    <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-[var(--color-brand)] border border-[var(--color-brand)] font-bold text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Nueva
                    </span>
                  )}

                  {/* Numbering Mode Overlay */}
                  {isNumberingMode && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-colors ${
                        isSelectedInNumbering ? 'bg-black/45' : 'bg-black/15 hover:bg-black/30'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-extrabold shadow-lg border-2 ${
                          isSelectedInNumbering
                            ? 'bg-[var(--color-brand)] text-white border-white scale-110'
                            : 'bg-black/60 text-white/70 border-white/50'
                        }`}
                      >
                        {isSelectedInNumbering ? numberedOrder + 1 : '+'}
                      </div>
                    </div>
                  )}

                  {/* Normal Mode Top Overlay Controls */}
                  {!isNumberingMode && (
                    <>
                      {/* Quick "Hacer Portada" button for non-first images */}
                      {i > 0 ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveItem(i, 0);
                          }}
                          className="absolute top-1.5 left-1.5 bg-black/80 hover:bg-[var(--color-brand)] text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow transition-colors"
                          title="Convertir en Portada (#1)"
                        >
                          <span>⭐</span>
                          <span>Portada</span>
                        </button>
                      ) : (
                        <span className="absolute top-1.5 left-1.5 bg-[var(--color-brand)] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          ⭐ PORTADA
                        </span>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(i);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow transition-colors"
                        title="Eliminar foto"
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>

                {/* Bottom Bar: Left Arrow + Position Selector + Right Arrow */}
                <div className={`flex items-center justify-between px-1.5 py-1 text-[11px] font-bold ${getRoleColorClass(i)}`}>
                  {!isNumberingMode ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveItem(i, i - 1);
                        }}
                        disabled={i === 0}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/25 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                        title="Mover antes"
                      >
                        ◀
                      </button>

                      <select
                        aria-label={`Posición de foto ${i + 1}`}
                        value={i}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => moveItem(i, Number(e.target.value))}
                        className="bg-transparent text-center font-bold text-[11px] cursor-pointer focus:outline-none hover:underline py-0.5"
                        title="Cambiar a otra posición directamente"
                      >
                        {items.map((_, posIdx) => (
                          <option key={posIdx} value={posIdx} className="bg-[#181818] text-white">
                            #{posIdx + 1} · {getRoleLabel(posIdx)}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveItem(i, i + 1);
                        }}
                        disabled={i === items.length - 1}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/25 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                        title="Mover después"
                      >
                        ▶
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center py-0.5">
                      Actual: #{i + 1} · {getRoleLabel(i)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Undo bar for removed existing images */}
      {removedImages.length > 0 && onUndoRemoveExisting && (
        <div className="flex flex-wrap gap-2 p-3 bg-red-950/20 border border-red-900/50 rounded-lg">
          <span className="text-xs text-red-400 font-semibold mr-1 flex items-center">
            Fotos marcadas para eliminar al guardar ({removedImages.length}):
          </span>
          {removedImages.map((url, idx) => (
            <button
              key={url}
              type="button"
              onClick={() => onUndoRemoveExisting(url)}
              className="bg-red-900/40 hover:bg-red-800/60 border border-red-700 text-red-200 text-xs px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors"
            >
              <span>Foto #{idx + 1}</span>
              <span className="font-bold underline">↩ Deshacer</span>
            </button>
          ))}
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="border-2 border-dashed border-[#333] hover:border-[var(--color-brand)] transition-colors bg-[#111] rounded-lg p-5 text-center">
        <input
          type="file"
          id="property_images_input"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
        />
        <label
          htmlFor="property_images_input"
          className="cursor-pointer text-[var(--color-brand)] hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>{items.length > 0 ? 'Agregar más fotos' : 'Seleccionar fotos de la propiedad'}</span>
        </label>
        <p className={helperClass}>
          Podés seleccionar varias fotos a la vez. Se comprimirán automáticamente al guardar.
        </p>
      </div>
    </div>
  );
};

export default PropertyImageSorter;
