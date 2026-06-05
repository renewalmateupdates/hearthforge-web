'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Save } from 'lucide-react'
import type { HomepageSection } from '@/types'

interface Props {
  sections: HomepageSection[]
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Section',
  features: 'Features Section',
  featured_products: 'Featured Products',
  cta: 'Call to Action',
}

export default function HomepageEditor({ sections }: Props) {
  const [data, setData] = useState<HomepageSection[]>(sections)
  const [openKey, setOpenKey] = useState<string | null>(sections[0]?.section_key || null)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateField(key: string, field: string, value: string | boolean) {
    setData(prev => prev.map(s => s.section_key === key ? { ...s, [field]: value } : s))
    setSaved(null)
  }

  async function saveSection(section: HomepageSection) {
    setSaving(section.section_key)
    setErrors(prev => ({ ...prev, [section.section_key]: '' }))
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Save failed')
      }
      setSaved(section.section_key)
    } catch (err) {
      setErrors(prev => ({ ...prev, [section.section_key]: err instanceof Error ? err.message : 'Save failed' }))
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-3">
      {data.map(section => {
        const isOpen = openKey === section.section_key
        const label = SECTION_LABELS[section.section_key] || section.section_key

        return (
          <div key={section.section_key} className="admin-card p-0 overflow-hidden">
            {/* Accordion header */}
            <button
              onClick={() => setOpenKey(isOpen ? null : section.section_key)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${section.enabled ? 'bg-green-400' : 'bg-white/20'}`} />
                <span className="font-medium text-hearthstone">{label}</span>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-hearthstone/40" /> : <ChevronDown className="w-4 h-4 text-hearthstone/40" />}
            </button>

            {isOpen && (
              <div className="px-6 pb-6 border-t border-white/8 pt-5 space-y-4">
                {/* Enabled toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`enabled-${section.section_key}`}
                    checked={section.enabled}
                    onChange={e => updateField(section.section_key, 'enabled', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor={`enabled-${section.section_key}`} className="text-sm text-hearthstone/70">
                    Section enabled
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="admin-label">Title</label>
                    <input
                      value={section.title || ''}
                      onChange={e => updateField(section.section_key, 'title', e.target.value)}
                      className="admin-input"
                      placeholder="Section title"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Subtitle</label>
                    <input
                      value={section.subtitle || ''}
                      onChange={e => updateField(section.section_key, 'subtitle', e.target.value)}
                      className="admin-input"
                      placeholder="Subtitle / tagline"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Content</label>
                    <textarea
                      value={section.content || ''}
                      onChange={e => updateField(section.section_key, 'content', e.target.value)}
                      className="admin-input min-h-[80px] resize-y"
                      placeholder="Body copy (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="admin-label">Button Text</label>
                      <input
                        value={section.button_text || ''}
                        onChange={e => updateField(section.section_key, 'button_text', e.target.value)}
                        className="admin-input"
                        placeholder="e.g. Shop Now"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Button URL</label>
                      <input
                        value={section.button_url || ''}
                        onChange={e => updateField(section.section_key, 'button_url', e.target.value)}
                        className="admin-input"
                        placeholder="/products"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="admin-label">Secondary Button Text</label>
                      <input
                        value={section.button_secondary_text || ''}
                        onChange={e => updateField(section.section_key, 'button_secondary_text', e.target.value)}
                        className="admin-input"
                        placeholder="e.g. View Portfolio"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Secondary Button URL</label>
                      <input
                        value={section.button_secondary_url || ''}
                        onChange={e => updateField(section.section_key, 'button_secondary_url', e.target.value)}
                        className="admin-input"
                        placeholder="/portfolio"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Image URL</label>
                    <input
                      value={section.image_url || ''}
                      onChange={e => updateField(section.section_key, 'image_url', e.target.value)}
                      className="admin-input"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {errors[section.section_key] && (
                  <p className="text-red-400 text-sm">{errors[section.section_key]}</p>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => saveSection(section)}
                    disabled={saving === section.section_key}
                    className="admin-btn-primary flex items-center gap-2 text-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {saving === section.section_key ? 'Saving...' : 'Save Section'}
                  </button>
                  {saved === section.section_key && <span className="text-green-400 text-sm">Saved</span>}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
