'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, GripVertical } from 'lucide-react'
import type { NavigationMenu, NavItem } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  menus: NavigationMenu[]
}

function NavItemRow({
  item,
  onUpdate,
  onDelete,
}: {
  item: NavItem
  onUpdate: (id: string, field: keyof NavItem, value: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <GripVertical className="w-4 h-4 text-hearthstone/20 shrink-0" />
      <input
        value={item.label}
        onChange={e => onUpdate(item.id, 'label', e.target.value)}
        className="admin-input flex-1"
        placeholder="Label"
      />
      <input
        value={item.url}
        onChange={e => onUpdate(item.id, 'url', e.target.value)}
        className="admin-input flex-1 font-mono text-sm"
        placeholder="/path"
      />
      <button
        onClick={() => onDelete(item.id)}
        className="p-2 rounded hover:bg-red-400/10 text-hearthstone/40 hover:text-red-400 transition-colors shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

function MenuEditor({ menu }: { menu: NavigationMenu }) {
  const [items, setItems] = useState<NavItem[]>(Array.isArray(menu.items) ? menu.items : [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function addItem() {
    setItems(prev => [...prev, { id: uuidv4(), label: '', url: '', order: prev.length }])
  }

  function updateItem(id: string, field: keyof NavItem, value: string) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
    setSaved(false)
  }

  function deleteItem(id: string) {
    setItems(prev => prev.filter(item => item.id !== id))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      const ordered = items.map((item, i) => ({ ...item, order: i }))
      const res = await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: menu.id, items: ordered }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Save failed')
      }
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-hearthstone">{menu.name}</h2>
        <span className="text-xs text-hearthstone/30 font-mono">{menu.slug}</span>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 px-0.5">
          <div className="w-4" />
          <p className="text-xs text-hearthstone/30 font-medium">Label</p>
          <p className="text-xs text-hearthstone/30 font-medium">URL</p>
          <div className="w-8" />
        </div>
        {items.map(item => (
          <NavItemRow key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} />
        ))}
      </div>

      <button onClick={addItem} className="admin-btn-secondary text-sm flex items-center gap-2">
        <Plus className="w-3.5 h-3.5" /> Add Link
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="admin-btn-primary flex items-center gap-2 text-sm">
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : 'Save Menu'}
        </button>
        {saved && <span className="text-green-400 text-sm">Saved</span>}
      </div>
    </div>
  )
}

export default function NavigationEditor({ menus }: Props) {
  return (
    <div className="space-y-5">
      {menus.map(menu => (
        <MenuEditor key={menu.id} menu={menu} />
      ))}
      {menus.length === 0 && (
        <div className="admin-card text-center py-10">
          <p className="text-hearthstone/40">No navigation menus found.</p>
        </div>
      )}
    </div>
  )
}
