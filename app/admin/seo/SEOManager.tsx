'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Save } from 'lucide-react'
import type { SeoSettings } from '@/types'

type PageData = Partial<SeoSettings> & { page_path: string }

export default function SEOManager({ pages }: { pages: PageData[] }) {
  const [data, setData] = useState<PageData[]>(pages)
  const [openPath, setOpenPath] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateField(path: string, field: string, value: string) {
    setData(prev => prev.map(p => p.page_path === path ? { ...p, [field]: value } : p))
    setSaved(null)
  }

  async function savePage(page: PageData) {
    setSaving(page.page_path)
    setErrors(prev => ({ ...prev, [page.page_path]: '' }))
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Save failed')
      }
      const updated = await res.json()
      setData(prev => prev.map(p => p.page_path === page.page_path ? updated : p))
      setSaved(page.page_path)
    } catch (err) {
      setErrors(prev => ({ ...prev, [page.page_path]: err instanceof Error ? err.message : 'Save failed' }))
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-2">
      {data.map(page => {
        const isOpen = openPath === page.page_path
        return (
          <div key={page.page_path} className="admin-card p-0 overflow-hidden">
            <button
              onClick={() => setOpenPath(isOpen ? null : page.page_path)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <code className="text-sm font-mono text-amber">{page.page_path}</code>
                {page.title && (
                  <span className="text-hearthstone/40 text-sm hidden md:block truncate max-w-xs">{page.title}</span>
                )}
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-hearthstone/40 shrink-0" /> : <ChevronDown className="w-4 h-4 text-hearthstone/40 shrink-0" />}
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-4 border-t border-white/8 space-y-4">
                <div>
                  <label className="admin-label">Page Title</label>
                  <input
                    value={page.title || ''}
                    onChange={e => updateField(page.page_path, 'title', e.target.value)}
                    className="admin-input"
                    placeholder="Page title (shown in browser tab)"
                  />
                </div>
                <div>
                  <label className="admin-label">Meta Description</label>
                  <textarea
                    value={page.description || ''}
                    onChange={e => updateField(page.page_path, 'description', e.target.value)}
                    className="admin-input resize-y"
                    rows={2}
                    placeholder="150-160 characters"
                  />
                </div>
                <div>
                  <label className="admin-label">OG Image URL</label>
                  <input
                    value={page.og_image || ''}
                    onChange={e => updateField(page.page_path, 'og_image', e.target.value)}
                    className="admin-input"
                    placeholder="https://... (1200x630 recommended)"
                  />
                </div>
                <div>
                  <label className="admin-label">Robots</label>
                  <select
                    value={page.robots || 'index, follow'}
                    onChange={e => updateField(page.page_path, 'robots', e.target.value)}
                    className="admin-input"
                  >
                    <option value="index, follow">index, follow</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>

                {errors[page.page_path] && (
                  <p className="text-red-400 text-sm">{errors[page.page_path]}</p>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => savePage(page)}
                    disabled={saving === page.page_path}
                    className="admin-btn-primary flex items-center gap-2 text-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {saving === page.page_path ? 'Saving...' : 'Save'}
                  </button>
                  {saved === page.page_path && <span className="text-green-400 text-sm">Saved</span>}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
