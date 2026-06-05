'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BlogPost, BlogCategory } from '@/types'

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface Props {
  post?: BlogPost
  categories: BlogCategory[]
}

export default function BlogPostForm({ post, categories }: Props) {
  const router = useRouter()
  const isEdit = !!post

  const [form, setForm] = useState<{
    title: string; slug: string; excerpt: string; content: string;
    featured_image: string; category_id: string; status: 'draft' | 'published';
    is_featured: boolean; seo_title: string; seo_description: string;
  }>({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    category_id: post?.category_id || '',
    status: post?.status || 'draft',
    is_featured: post?.is_featured || false,
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleTitleChange(title: string) {
    setForm(prev => ({ ...prev, title, slug: isEdit ? prev.slug : slugify(title) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.slug) {
      setError('Title and slug are required')
      return
    }
    setSaving(true)
    setError('')

    try {
      let res: Response
      if (isEdit) {
        res = await fetch(`/api/admin/blog/${post.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else {
        res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Save failed')
      }
      router.push('/admin/blog')
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
          <input value={form.title} onChange={e => handleTitleChange(e.target.value)} className="admin-input text-lg" required />
        </div>
        <div>
          <label className="admin-label">Slug</label>
          <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="admin-input font-mono text-sm" />
        </div>
        <div>
          <label className="admin-label">Excerpt</label>
          <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} className="admin-input resize-y" rows={2} placeholder="Short summary for listings and SEO" />
        </div>
        <div>
          <label className="admin-label">Content</label>
          <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="admin-input min-h-[320px] resize-y font-mono text-sm" placeholder="Write your post in Markdown or plain text..." />
        </div>
      </div>

      <div className="admin-card space-y-4">
        <h2 className="text-sm font-semibold text-hearthstone/40 uppercase tracking-wider">Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Category</label>
            <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} className="admin-input">
              <option value="">No category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="admin-label">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))} className="admin-input">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div>
          <label className="admin-label">Featured Image URL</label>
          <input value={form.featured_image} onChange={e => setForm(p => ({ ...p, featured_image: e.target.value }))} className="admin-input" placeholder="https://..." />
        </div>
        {form.featured_image && (
          <img src={form.featured_image} alt="" className="w-full max-h-48 object-cover rounded-lg border border-white/10" />
        )}
        <label className="flex items-center gap-2 cursor-pointer text-sm text-hearthstone/70">
          <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 rounded" />
          Featured post
        </label>
      </div>

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
          {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </button>
        <button type="button" onClick={() => { if (form.status === 'draft') setForm(p => ({ ...p, status: 'published' as const })) }}
          className="admin-btn-secondary text-sm" disabled={form.status === 'published'}>
          {form.status === 'published' ? '✓ Published' : 'Publish'}
        </button>
        <button type="button" onClick={() => router.back()} className="admin-btn-secondary">Cancel</button>
      </div>
    </form>
  )
}
