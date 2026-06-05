'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import type { Product } from '@/types'

type Feature = { label: string; value: string }

interface Props {
  product?: Product
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ProductForm({ product }: Props) {
  const router = useRouter()
  const isEdit = !!product

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price?.toString() || '',
    price_label: product?.price_label || '',
    category: product?.category || '',
    image_url: product?.image_url || '',
    is_featured: product?.is_featured || false,
    is_available: product?.is_available ?? true,
    sort_order: product?.sort_order?.toString() || '0',
    seo_title: product?.seo_title || '',
    seo_description: product?.seo_description || '',
  })
  const [features, setFeatures] = useState<Feature[]>(
    Array.isArray(product?.features) ? product.features as Feature[] : []
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleNameChange(name: string) {
    setForm(prev => ({ ...prev, name, slug: isEdit ? prev.slug : slugify(name) }))
  }

  function addFeature() {
    setFeatures(prev => [...prev, { label: '', value: '' }])
  }

  function updateFeature(i: number, field: keyof Feature, value: string) {
    setFeatures(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f))
  }

  function removeFeature(i: number) {
    setFeatures(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.slug) {
      setError('Name and slug are required')
      return
    }
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      price: form.price ? parseFloat(form.price) : null,
      sort_order: parseInt(form.sort_order) || 0,
      features,
    }

    try {
      let res: Response
      if (isEdit) {
        res = await fetch(`/api/admin/products/${product.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Save failed')
      }
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Core info */}
      <div className="admin-card space-y-4">
        <h2 className="text-sm font-semibold text-hearthstone/40 uppercase tracking-wider">Product Info</h2>
        <div>
          <label className="admin-label">Product Name *</label>
          <input value={form.name} onChange={e => handleNameChange(e.target.value)} className="admin-input" required />
        </div>
        <div>
          <label className="admin-label">Slug (URL)</label>
          <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="admin-input font-mono text-sm" />
        </div>
        <div>
          <label className="admin-label">Short Description</label>
          <input value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} className="admin-input" placeholder="One-liner for cards and previews" />
        </div>
        <div>
          <label className="admin-label">Full Description</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="admin-input min-h-[120px] resize-y" />
        </div>
      </div>

      {/* Pricing & Category */}
      <div className="admin-card space-y-4">
        <h2 className="text-sm font-semibold text-hearthstone/40 uppercase tracking-wider">Pricing &amp; Category</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Price ($)</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="admin-input" placeholder="0.00" />
          </div>
          <div>
            <label className="admin-label">Price Label</label>
            <input value={form.price_label} onChange={e => setForm(p => ({ ...p, price_label: e.target.value }))} className="admin-input" placeholder="e.g. Starting at $49" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Category</label>
            <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="admin-input" placeholder="e.g. Desk Accessories" />
          </div>
          <div>
            <label className="admin-label">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} className="admin-input" />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="admin-card space-y-4">
        <h2 className="text-sm font-semibold text-hearthstone/40 uppercase tracking-wider">Media</h2>
        <div>
          <label className="admin-label">Image URL</label>
          <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="admin-input" placeholder="https://..." />
        </div>
        {form.image_url && (
          <img src={form.image_url} alt="" className="w-32 h-32 object-cover rounded-lg border border-white/10" />
        )}
      </div>

      {/* Features */}
      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-hearthstone/40 uppercase tracking-wider">Specs / Features</h2>
          <button type="button" onClick={addFeature} className="admin-btn-secondary text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Row
          </button>
        </div>
        {features.length === 0 && (
          <p className="text-hearthstone/30 text-sm">No specs yet. Click "Add Row" to add spec pairs.</p>
        )}
        {features.map((f, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={f.label} onChange={e => updateFeature(i, 'label', e.target.value)} className="admin-input" placeholder="Label (e.g. Material)" />
            <input value={f.value} onChange={e => updateFeature(i, 'value', e.target.value)} className="admin-input" placeholder="Value (e.g. PETG)" />
            <button type="button" onClick={() => removeFeature(i)} className="p-2 rounded hover:bg-red-400/10 text-hearthstone/40 hover:text-red-400 transition-colors shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Visibility */}
      <div className="admin-card space-y-3">
        <h2 className="text-sm font-semibold text-hearthstone/40 uppercase tracking-wider">Visibility</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_available} onChange={e => setForm(p => ({ ...p, is_available: e.target.checked }))} className="w-4 h-4 rounded" />
          <span className="text-sm text-hearthstone/70">Available (visible on site)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 rounded" />
          <span className="text-sm text-hearthstone/70">Featured on homepage</span>
        </label>
      </div>

      {/* SEO */}
      <div className="admin-card space-y-4">
        <h2 className="text-sm font-semibold text-hearthstone/40 uppercase tracking-wider">SEO</h2>
        <div>
          <label className="admin-label">SEO Title</label>
          <input value={form.seo_title} onChange={e => setForm(p => ({ ...p, seo_title: e.target.value }))} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">SEO Description</label>
          <textarea value={form.seo_description} onChange={e => setForm(p => ({ ...p, seo_description: e.target.value }))} className="admin-input resize-y" rows={2} />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="admin-btn-secondary">Cancel</button>
      </div>
    </form>
  )
}
