'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Star, Eye, EyeOff } from 'lucide-react'
import type { Testimonial } from '@/types'

type FormData = {
  customer_name: string
  customer_title: string
  content: string
  rating: number
  is_featured: boolean
  is_published: boolean
}

const EMPTY: FormData = {
  customer_name: '',
  customer_title: '',
  content: '',
  rating: 5,
  is_featured: false,
  is_published: true,
}

export default function TestimonialsManager({ testimonials: initial }: { testimonials: Testimonial[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openNew() {
    setEditing(null)
    setForm(EMPTY)
    setShowForm(true)
  }

  function openEdit(t: Testimonial) {
    setEditing(t)
    setForm({
      customer_name: t.customer_name,
      customer_title: t.customer_title || '',
      content: t.content,
      rating: t.rating,
      is_featured: t.is_featured,
      is_published: t.is_published,
    })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.customer_name || !form.content) {
      setError('Name and content are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      let res: Response
      if (editing) {
        res = await fetch('/api/admin/testimonials', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...form }),
        })
      } else {
        res = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Save failed')
      }
      setShowForm(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
    router.refresh()
  }

  async function togglePublish(t: Testimonial) {
    await fetch('/api/admin/testimonials', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: t.id, is_published: !t.is_published }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      <button onClick={openNew} className="admin-btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add Testimonial
      </button>

      {/* Form */}
      {showForm && (
        <div className="admin-card space-y-4">
          <h3 className="font-semibold text-hearthstone">{editing ? 'Edit' : 'New'} Testimonial</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Customer Name *</label>
              <input value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Title / Role</label>
              <input value={form.customer_title} onChange={e => setForm(p => ({ ...p, customer_title: e.target.value }))} className="admin-input" placeholder="e.g. Streamer" />
            </div>
          </div>
          <div>
            <label className="admin-label">Review *</label>
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="admin-input min-h-[80px] resize-y" />
          </div>
          <div>
            <label className="admin-label">Rating (1–5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))}
                  className={`p-1.5 rounded ${n <= form.rating ? 'text-amber' : 'text-hearthstone/20'}`}>
                  <Star className="w-5 h-5" fill={n <= form.rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-hearthstone/70">
              <input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} className="w-4 h-4 rounded" />
              Published
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-hearthstone/70">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 rounded" />
              Featured
            </label>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="admin-btn-primary text-sm">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setShowForm(false)} className="admin-btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      {items.length === 0 && !showForm && (
        <div className="admin-card text-center py-10">
          <p className="text-hearthstone/40">No testimonials yet.</p>
        </div>
      )}
      <div className="space-y-3">
        {initial.map(t => (
          <div key={t.id} className="admin-card flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-hearthstone text-sm">{t.customer_name}</span>
                {t.customer_title && <span className="text-hearthstone/40 text-xs">• {t.customer_title}</span>}
                <span className="text-hearthstone/40 text-xs ml-auto">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </span>
              </div>
              <p className="text-sm text-hearthstone/60 line-clamp-2">{t.content}</p>
              <div className="flex gap-2 mt-2">
                {t.is_featured && <span className="text-xs bg-amber/15 text-amber px-2 py-0.5 rounded-full">Featured</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.is_published ? 'bg-green-400/15 text-green-400' : 'bg-white/10 text-hearthstone/40'}`}>
                  {t.is_published ? 'Published' : 'Hidden'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => togglePublish(t)} className="p-1.5 rounded hover:bg-white/10 text-hearthstone/40 hover:text-hearthstone transition-colors" title={t.is_published ? 'Hide' : 'Publish'}>
                {t.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(t)} className="p-1.5 rounded hover:bg-white/10 text-hearthstone/40 hover:text-hearthstone transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded hover:bg-red-400/10 text-hearthstone/40 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
