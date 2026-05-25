'use client';
import { useState } from 'react';

export default function AgentNameForm({ initialName }) {
  const [agentName, setAgentName] = useState(initialName || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/user/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setSaved(true);
    } catch {
      alert('Error al guardar el nombre del agente');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Nombre del agente (para presupuestos)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          placeholder="Ej: Juan Gomariz"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
      {saved && (
        <p className="text-xs text-green-600 mt-1">Guardado correctamente</p>
      )}
    </form>
  );
}
