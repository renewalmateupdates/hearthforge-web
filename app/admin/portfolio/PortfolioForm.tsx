'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PortfolioItem } from '@/types'

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function PortfolioForm({ item }: { item?: PortfolioItem }) {
  const router = useRouter()
  const isEdit = !!item

  const [form, setForm] = useState({
    title: item?.title || '',
    slug: item?.slug || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    category: item?.category || '',
    is_featured: item?.is_featured || false,
    sort_order: item?.sort_order?.toString() || '0',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleTitleChange(title: string) {
    setForm(prev => ({ ...prev, title, slug: isEdit ? prev.slug : slugify(title) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.slug || !form.image_url) {
      setError('Title, slug, and image URL are required')
      return
    }
    setSaving(true)
    setError('')

    const payload = { ...form, sort_order: parseInt(form.sort_order) || 0 }

    try {
      let res: Response
      if (isEdit) {
        res = await fetch(`/api/admin/portfolio/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/admin/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Save failed')
      }
      router.push('/admin/portfolio')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="admin-card space-y-4">
        <div>
          <label className="admin-label">Title *</label>
          <input value={form.title} onChange={e => handleTitleChange(e.target.value)} className="admin-input" required />
        </div>
        <div>
          <label className="admin-label">Slug</label>
          <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="admin-input font-mono text-sm" />
        </div>
        <div>
          <label className="admin-label">Description</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="admin-input min-h-[100px] resize-y" />
        </div>
        <div>
          <label className="admin-label">Image URL *</label>
          <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="admin-input" placeholder="https://..." required />
        </div>
        {form.image_url && (
          <img src={form.image_url} alt="" className="w-40 h-40 object-cover rounded-lg border border-white/10" />
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Category</label>
            <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="admin-input" placeholder="e.g. Desk Rail" />
          </div>
          <div>
            <label className="admin-label">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} className="admin-input" />
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 rounded" />
          <span className="text-sm text-hearthstone/70">Featured on homepage</span>
        </label>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'Saving...' : isEdit ? 'Update Item' : 'Create Item'}
        </button>
        <button type="button" onClick={() => router.back()} className="admin-btn-secondary">Cancel</button>
      </div>
    </form>
  )
}
