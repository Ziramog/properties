'use client';
import { useState } from 'react';
import Image from 'next/image';

const getTopGridLabel = (index) => {
  if (index === 0) return 'PORTADA (MAIN)';
  return `MINI ${index}`;
};

const getTopGridColorClass = (index) => {
  if (index === 0) return 'bg-[var(--color-brand)] text-white';
  return 'bg-blue-600 text-white';
};

const PropertyImageSorter = ({
  items,
  setItems,
  galleryOrderIds = [],
  setGalleryOrderIds,
  removedImages = [],
  onRemoveExisting,
  onUndoRemoveExisting,
  helperClass = 'text-[11px] text-gray-500 mt-1',
}) => {
  const [activeTab, setActiveTab] = useState('top'); // 'top' | 'gallery'
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [isNumberingMode, setIsNumberingMode] = useState(false);
  const [numberedIds, setNumberedIds] = useState([]);
  // Track how many slots are actively in the top grid (up to 7)
  const [topGridCount, setTopGridCount] = useState(7);

  // Gallery ALWAYS contains the total of photos in its own independent order
  const galleryItems = (() => {
    if (!galleryOrderIds || galleryOrderIds.length === 0) return items;
    const ordered = galleryOrderIds
      .map((id) => items.find((item) => item.id === id))
      .filter(Boolean);
    const missing = items.filter((item) => !galleryOrderIds.includes(item.id));
    return [...ordered, ...missing];
  })();

  const effectiveTopCount = Math.min(items.length, topGridCount, 7);
  const topGridItems = items.slice(0, effectiveTopCount);
  const topGridIdSet = new Set(topGridItems.map((it) => it.id));

  // Ensure galleryOrderIds is snapshotted before modifying `items` (Top Grid)
  // so that any change in Top Grid NEVER alters the Gallery order.
  const ensureGallerySnapshot = () => {
    if (setGalleryOrderIds && (!galleryOrderIds || galleryOrderIds.length === 0)) {
      setGalleryOrderIds(items.map((it) => it.id));
    }
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setIsNumberingMode(false);
    setNumberedIds([]);
    setDraggedIdx(null);
    setDragOverIdx(null);
    setActiveTab(tab);
  };

  // Move an item within the active tab
  const moveTopGridItem = (fromIdx, toIdx) => {
    if (
      fromIdx === toIdx ||
      fromIdx < 0 ||
      toIdx < 0 ||
      fromIdx >= topGridItems.length ||
      toIdx >= topGridItems.length
    ) {
      return;
    }
    ensureGallerySnapshot();
    const updatedTop = [...topGridItems];
    const [moved] = updatedTop.splice(fromIdx, 1);
    updatedTop.splice(toIdx, 0, moved);
    const rest = items.slice(effectiveTopCount);
    setItems([...updatedTop, ...rest]);
  };

  const moveGalleryItem = (fromIdx, toIdx) => {
    if (
      fromIdx === toIdx ||
      fromIdx < 0 ||
      toIdx < 0 ||
      fromIdx >= galleryItems.length ||
      toIdx >= galleryItems.length
    ) {
      return;
    }
    const updated = [...galleryItems];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    if (setGalleryOrderIds) {
      setGalleryOrderIds(updated.map((it) => it.id));
    }
  };

  // Remove a photo from the Top Grid (does NOT delete it from the Gallery total!)
  const removeFromTopGridOnly = (itemId) => {
    if (effectiveTopCount <= 1) return;
    ensureGallerySnapshot();
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const currentTop = items.slice(0, effectiveTopCount).filter((it) => it.id !== itemId);
    const others = items.filter((it) => it.id !== itemId && !currentTop.some((t) => t.id === it.id));
    setTopGridCount(currentTop.length);
    setItems([...currentTop, target, ...others]);
  };

  // Add or promote a photo from the Gallery pool into the Top Grid
  const addToTopGridFromPool = (itemId, asCover = false) => {
    ensureGallerySnapshot();
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const currentTop = items.slice(0, effectiveTopCount).filter((it) => it.id !== itemId);
    let newTop;
    if (asCover) {
      newTop = [target, ...currentTop].slice(0, 7);
    } else if (currentTop.length < 7) {
      newTop = [...currentTop, target];
    } else {
      // Replace the 7th slot (MINI 6) with the newly chosen photo
      newTop = [...currentTop.slice(0, 6), target];
    }
    const newTopIds = new Set(newTop.map((it) => it.id));
    const rest = items.filter((it) => !newTopIds.has(it.id));
    setTopGridCount(newTop.length);
    setItems([...newTop, ...rest]);
  };

  // Handle adding new files from input (adds to the total pool)
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

    setItems((prev) => {
      const next = [...prev, ...newEntries];
      return next;
    });
    setTopGridCount((prev) => Math.max(prev, Math.min(7, items.length + newEntries.length)));
    if (setGalleryOrderIds) {
      setGalleryOrderIds((prev) => {
        const baseIds = prev && prev.length > 0 ? prev : items.map((it) => it.id);
        return [...baseIds, ...newEntries.map((ne) => ne.id)];
      });
    }
    e.target.value = '';
  };

  // Delete photo completely from the property
  const handleDeletePhotoCompletely = (itemId) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;

    if (target.type === 'existing' && onRemoveExisting) {
      onRemoveExisting(target.url);
    }
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    if (setGalleryOrderIds) {
      setGalleryOrderIds((prev) => prev.filter((id) => id !== itemId));
    }
    setNumberedIds((prev) => prev.filter((id) => id !== itemId));
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
      if (activeTab === 'top' && prev.length >= 7) {
        return prev; // Top Grid holds max 7 photos
      }
      return [...prev, itemId];
    });
  };

  const applyNumberingOrder = () => {
    if (numberedIds.length === 0) {
      setIsNumberingMode(false);
      return;
    }

    if (activeTab === 'top') {
      ensureGallerySnapshot();
      const chosenTop = numberedIds
        .slice(0, 7)
        .map((id) => items.find((item) => item.id === id))
        .filter(Boolean);
      const remaining = items.filter((item) => !chosenTop.some((t) => t.id === item.id));
      setTopGridCount(chosenTop.length);
      setItems([...chosenTop, ...remaining]);
    } else if (setGalleryOrderIds) {
      const numberedGallery = numberedIds
        .map((id) => galleryItems.find((item) => item.id === id))
        .filter(Boolean);
      const remainingGallery = galleryItems.filter((item) => !numberedIds.includes(item.id));
      setGalleryOrderIds([...numberedGallery, ...remainingGallery].map((it) => it.id));
    }

    setNumberedIds([]);
    setIsNumberingMode(false);
  };

  // Drag & Drop handlers
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
    if (activeTab === 'top') {
      moveTopGridItem(draggedIdx, index);
    } else {
      moveGalleryItem(draggedIdx, index);
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const getTopGridRank = (itemId) => {
    const idx = topGridItems.findIndex((it) => it.id === itemId);
    if (idx === -1) return null;
    return idx === 0 ? '#1 Portada' : `#${idx + 1} Mini ${idx}`;
  };

  return (
    <div className="space-y-4">
      {/* Mode Tabs: Grid Superior vs Galería Inferior */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#121212] p-1.5 rounded-lg border border-[#2a2a2a]">
        <button
          type="button"
          onClick={() => switchTab('top')}
          className={`flex flex-col items-start p-3 rounded-md text-left transition-all border ${
            activeTab === 'top'
              ? 'bg-[#1f1a14] border-[var(--color-brand)] text-white shadow'
              : 'bg-transparent border-transparent text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold flex items-center gap-1.5">
              <span>🌟</span>
              <span>1. Grid Superior (Portada + 6 Mini)</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--color-brand)]/20 text-[var(--color-brand)] border border-[var(--color-brand)]/40">
              {topGridItems.length} de 7 lugares
            </span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">
            Seleccioná y ordená solo las 7 fotos del mosaico superior (sin afectar la Galería).
          </span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('gallery')}
          className={`flex flex-col items-start p-3 rounded-md text-left transition-all border ${
            activeTab === 'gallery'
              ? 'bg-[#141c24] border-blue-500 text-white shadow'
              : 'bg-transparent border-transparent text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold flex items-center gap-1.5">
              <span>🖼️</span>
              <span>2. Galería Inferior (Total de Fotos)</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
              Total: {galleryItems.length} fotos
            </span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">
            Contiene siempre el total de fotos con su propio orden independiente.
          </span>
        </button>
      </div>

      {/* =========================================================
          TAB 1: GRID SUPERIOR (INDEPENDENT SELECTION & ORDER OF 7)
         ========================================================= */}
      {activeTab === 'top' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#161616] border border-[#2a2a2a] p-3.5 rounded-lg">
            <div>
              <p className="text-white text-sm font-bold">
                Fotos del Grid Superior ({topGridItems.length} de 7)
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Elegí qué 7 fotos del total van arriba y su orden (<span className="text-[var(--color-brand)] font-semibold">#1 Portada</span> y <span className="text-blue-400 font-semibold">#2 a #7 Miniaturas</span>). La Galería Inferior conserva siempre el total con su propio orden.
              </p>
            </div>

            {items.length > 1 && !isNumberingMode && (
              <button
                type="button"
                onClick={startNumberingMode}
                className="flex-shrink-0 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-xs font-bold px-3.5 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <span>🔢</span>
                <span>Elegir las 7 del Grid tocando (1 a 7)</span>
              </button>
            )}
          </div>

          {isNumberingMode ? (
            /* Numbering Mode for Top Grid: shows ALL photos from galleryItems so user can tap any 7 */
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-[#1e1a14] border-2 border-[var(--color-brand)] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-white text-sm font-bold flex items-center gap-2">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[var(--color-brand)] text-white text-xs">
                        {numberedIds.length} / 7
                      </span>
                      Tocá hasta 7 fotos del total para armar el Grid Superior (1° Portada, 2° a 7° Miniaturas)
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Esto solo define las 7 fotos de arriba. El orden de la Galería Inferior queda intacto.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={applyNumberingOrder}
                      disabled={numberedIds.length === 0}
                      className="bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-xs font-bold px-3.5 py-2 rounded-md transition-colors"
                    >
                      ✓ Aplicar al Grid ({numberedIds.length})
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

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {galleryItems.map((item, idx) => {
                  const numberedOrder = numberedIds.indexOf(item.id);
                  const isSelected = numberedOrder !== -1;
                  return (
                    <div
                      key={`top_num_${item.id}`}
                      onClick={() => toggleNumberedItem(item.id)}
                      className={`relative rounded-lg overflow-hidden border transition-all select-none cursor-pointer ${
                        isSelected
                          ? 'border-[var(--color-brand)] ring-2 ring-[var(--color-brand)]'
                          : 'border-[#333] opacity-80 hover:opacity-100'
                      } bg-[#141414]`}
                    >
                      <div className="relative w-full h-36 bg-[#0d0d0d]">
                        {item.type === 'existing' ? (
                          <Image
                            src={item.url}
                            alt={`Foto ${idx + 1}`}
                            width={300}
                            height={220}
                            className="w-full h-full object-cover pointer-events-none"
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={`Nueva foto ${idx + 1}`}
                            className="w-full h-full object-cover pointer-events-none"
                          />
                        )}
                        <div
                          className={`absolute inset-0 flex flex-col items-center justify-center transition-colors ${
                            isSelected ? 'bg-black/50' : 'bg-black/20 hover:bg-black/35'
                          }`}
                        >
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-extrabold shadow-lg border-2 ${
                              isSelected
                                ? 'bg-[var(--color-brand)] text-white border-white scale-110'
                                : 'bg-black/60 text-white/70 border-white/50'
                            }`}
                          >
                            {isSelected ? numberedOrder + 1 : '+'}
                          </div>
                          {isSelected && (
                            <span className="mt-1 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              {numberedOrder === 0 ? 'PORTADA' : `MINI ${numberedOrder}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Active 7 Slots of Top Grid */}
              {topGridItems.length > 0 && (
                <div className="bg-[#141414] border border-[#2a2a2a] p-3.5 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand)]">
                      🌟 Las {topGridItems.length} fotos seleccionadas en el Grid Superior
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Arrastrá o usá ◀ ▶ para cambiar el orden entre las 7
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {topGridItems.map((item, i) => {
                      const isBeingDragged = draggedIdx === i;
                      const isDragTarget = dragOverIdx === i && draggedIdx !== null && draggedIdx !== i;

                      return (
                        <div
                          key={`top_slot_${item.id}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, i)}
                          onDragOver={(e) => handleDragOver(e, i)}
                          onDrop={(e) => handleDrop(e, i)}
                          onDragEnd={handleDragEnd}
                          className={`relative rounded-lg overflow-hidden border transition-all select-none ${
                            isDragTarget
                              ? 'border-[var(--color-brand)] ring-2 ring-[var(--color-brand)] scale-[1.02]'
                              : isBeingDragged
                              ? 'opacity-40 border-dashed border-gray-400'
                              : i === 0
                              ? 'border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]'
                              : 'border-blue-500/70'
                          } bg-[#181818]`}
                        >
                          <div className="relative w-full h-36 bg-[#0d0d0d]">
                            {item.type === 'existing' ? (
                              <Image
                                src={item.url}
                                alt={`Grid Superior ${i + 1}`}
                                width={300}
                                height={220}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            ) : (
                              <img
                                src={item.url}
                                alt={`Nueva ${i + 1}`}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            )}

                            {i > 0 ? (
                              <button
                                type="button"
                                onClick={() => moveTopGridItem(i, 0)}
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

                            {topGridItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFromTopGridOnly(item.id)}
                                className="absolute top-1.5 right-1.5 bg-black/80 hover:bg-red-600 text-gray-200 hover:text-white text-[10px] font-bold px-2 py-0.5 rounded shadow transition-colors"
                                title="Quitar del Grid Superior (sigue estando en la Galería Inferior)"
                              >
                                Quitar del Grid
                              </button>
                            )}
                          </div>

                          <div
                            className={`flex items-center justify-between px-1.5 py-1 text-[11px] font-bold ${getTopGridColorClass(
                              i
                            )}`}
                          >
                            <button
                              type="button"
                              onClick={() => moveTopGridItem(i, i - 1)}
                              disabled={i === 0}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/25 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                              title="Mover antes en el Grid"
                            >
                              ◀
                            </button>

                            <select
                              aria-label={`Posición en Grid Superior ${i + 1}`}
                              value={i}
                              onChange={(e) => moveTopGridItem(i, Number(e.target.value))}
                              className="bg-transparent text-center font-bold text-[11px] cursor-pointer focus:outline-none hover:underline py-0.5"
                            >
                              {topGridItems.map((_, posIdx) => (
                                <option key={posIdx} value={posIdx} className="bg-[#181818] text-white">
                                  #{posIdx + 1} · {getTopGridLabel(posIdx)}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => moveTopGridItem(i, i + 1)}
                              disabled={i === topGridItems.length - 1}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/25 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                              title="Mover después en el Grid"
                            >
                              ▶
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pool of all photos to pick from if user wants to swap/add into Top Grid */}
              {galleryItems.length > 0 && (
                <div className="bg-[#121212] border border-[#252525] p-3.5 rounded-lg space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-gray-300">
                      Todas las fotos disponibles ({galleryItems.length}) — Elegí cuáles sumar o usar en el Grid Superior:
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Para ordenar la galería completa, pasá a la pestaña &ldquo;2. Galería Inferior&rdquo;
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                    {galleryItems.map((item, idx) => {
                      const inTop = topGridIdSet.has(item.id);
                      const rankLabel = getTopGridRank(item.id);
                      return (
                        <div
                          key={`pool_${item.id}`}
                          className={`relative rounded-md overflow-hidden border transition-all ${
                            inTop ? 'border-[var(--color-brand)]' : 'border-[#2a2a2a] opacity-80 hover:opacity-100'
                          } bg-[#181818]`}
                        >
                          <div className="relative w-full h-24 bg-[#0d0d0d]">
                            {item.type === 'existing' ? (
                              <Image
                                src={item.url}
                                alt={`Total ${idx + 1}`}
                                width={200}
                                height={150}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            ) : (
                              <img
                                src={item.url}
                                alt={`Nueva ${idx + 1}`}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            )}

                            {inTop ? (
                              <div className="absolute inset-x-0 bottom-0 bg-[var(--color-brand)]/95 text-white text-[10px] font-bold py-0.5 text-center">
                                ✓ En Grid ({rankLabel})
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                                <button
                                  type="button"
                                  onClick={() => addToTopGridFromPool(item.id, true)}
                                  className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-[9px] font-bold py-1 rounded shadow"
                                >
                                  ⭐ Usar de Portada
                                </button>
                                <button
                                  type="button"
                                  onClick={() => addToTopGridFromPool(item.id, false)}
                                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-bold py-1 rounded shadow"
                                >
                                  + Subir al Grid
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* =========================================================
          TAB 2: GALERÍA INFERIOR (ALWAYS CONTAINS THE TOTAL)
         ========================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#161616] border border-[#2a2a2a] p-3.5 rounded-lg">
            <div>
              <p className="text-white text-sm font-bold">
                Orden de la Galería Inferior (Total: {galleryItems.length} fotos)
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                La Galería Inferior <strong>contiene siempre el total de fotos</strong>. Ordenalas libremente sin que cambie el Grid Superior.
              </p>
            </div>

            {galleryItems.length > 1 && !isNumberingMode && (
              <button
                type="button"
                onClick={startNumberingMode}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <span>🔢</span>
                <span>Ordenar Galería tocando (1, 2, 3...)</span>
              </button>
            )}
          </div>

          {isNumberingMode && (
            <div className="p-4 rounded-lg bg-[#131b24] border-2 border-blue-500 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-white text-sm font-bold flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs">
                      {numberedIds.length}
                    </span>
                    Tocá las fotos en el orden en que querés que aparezcan en la Galería Inferior
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Las que no toques quedarán detrás manteniendo su orden actual. El Grid Superior no se modifica.
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

          {galleryItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryItems.map((item, i) => {
                const numberedOrder = numberedIds.indexOf(item.id);
                const isSelectedInNumbering = numberedOrder !== -1;
                const isBeingDragged = draggedIdx === i;
                const isDragTarget = dragOverIdx === i && draggedIdx !== null && draggedIdx !== i;
                const topRank = getTopGridRank(item.id);

                return (
                  <div
                    key={`gal_${item.id}`}
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
                          ? 'border-blue-500 ring-2 ring-blue-500 cursor-pointer'
                          : 'border-[#333] hover:border-gray-400 cursor-pointer opacity-80 hover:opacity-100'
                        : isDragTarget
                        ? 'border-blue-500 ring-2 ring-blue-500 scale-[1.02]'
                        : isBeingDragged
                        ? 'opacity-40 border-dashed border-gray-400'
                        : 'border-[#333]'
                    } bg-[#141414]`}
                  >
                    <div className="relative w-full h-36 bg-[#0d0d0d]">
                      {item.type === 'existing' ? (
                        <Image
                          src={item.url}
                          alt={`Galería ${i + 1}`}
                          width={300}
                          height={220}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={`Nueva ${i + 1}`}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      )}

                      {item.type === 'new' && (
                        <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-[var(--color-brand)] border border-[var(--color-brand)] font-bold text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Nueva
                        </span>
                      )}

                      {topRank && !isNumberingMode && (
                        <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-amber-300 border border-amber-500/40 font-semibold text-[9px] px-1.5 py-0.5 rounded">
                          🌟 Grid Sup: {topRank}
                        </span>
                      )}

                      {isNumberingMode && (
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-colors ${
                            isSelectedInNumbering ? 'bg-black/45' : 'bg-black/15 hover:bg-black/30'
                          }`}
                        >
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-extrabold shadow-lg border-2 ${
                              isSelectedInNumbering
                                ? 'bg-blue-600 text-white border-white scale-110'
                                : 'bg-black/60 text-white/70 border-white/50'
                            }`}
                          >
                            {isSelectedInNumbering ? numberedOrder + 1 : '+'}
                          </div>
                        </div>
                      )}

                      {!isNumberingMode && (
                        <>
                          {i > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveGalleryItem(i, 0);
                              }}
                              className="absolute top-1.5 left-1.5 bg-black/80 hover:bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow transition-colors"
                              title="Mandar al puesto #1 de la Galería Inferior"
                            >
                              <span>⏫</span>
                              <span>1° en Galería</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhotoCompletely(item.id);
                            }}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow transition-colors"
                            title="Eliminar foto de la propiedad"
                          >
                            ×
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between px-1.5 py-1 text-[11px] font-bold bg-[#1e293b] text-white">
                      {!isNumberingMode ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveGalleryItem(i, i - 1);
                            }}
                            disabled={i === 0}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/25 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                            title="Mover antes en Galería"
                          >
                            ◀
                          </button>

                          <select
                            aria-label={`Posición en Galería ${i + 1}`}
                            value={i}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => moveGalleryItem(i, Number(e.target.value))}
                            className="bg-transparent text-center font-bold text-[11px] cursor-pointer focus:outline-none hover:underline py-0.5"
                          >
                            {galleryItems.map((_, posIdx) => (
                              <option key={posIdx} value={posIdx} className="bg-[#181818] text-white">
                                #{posIdx + 1} de {galleryItems.length} en Galería
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveGalleryItem(i, i + 1);
                            }}
                            disabled={i === galleryItems.length - 1}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/25 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                            title="Mover después en Galería"
                          >
                            ▶
                          </button>
                        </>
                      ) : (
                        <div className="w-full text-center py-0.5">
                          Actual: #{i + 1} en Galería
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
          <span>{items.length > 0 ? 'Agregar más fotos al total' : 'Seleccionar fotos de la propiedad'}</span>
        </label>
        <p className={helperClass}>
          Podés seleccionar varias fotos a la vez. Se comprimirán automáticamente al guardar.
        </p>
      </div>
    </div>
  );
};

export default PropertyImageSorter;
