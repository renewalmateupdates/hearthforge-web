'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

interface Section {
  id: string
  section_key: string
  title?: string
  content?: string
  image_url?: string
}

const SECTION_LABELS: Record<string, string> = {
  story: 'Our Story',
  mission: 'Our Mission',
  team: 'The Team',
}

export default function AboutEditor({ sections }: { sections: Section[] }) {
  const [data, setData] = useState(sections)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateField(key: string, field: string, value: string) {
    setData(prev => prev.map(s => s.section_key === key ? { ...s, [field]: value } : s))
    setSaved(null)
  }

  async function saveSection(section: Section) {
    setSaving(section.section_key)
    setErrors(prev => ({ ...prev, [section.section_key]: '' }))
    try {
      const res = await fetch('/api/admin/about', {
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
    <div className="space-y-5">
      {data.map(section => (
        <div key={section.section_key} className="admin-card space-y-4">
          <h2 className="font-semibold text-hearthstone">
            {SECTION_LABELS[section.section_key] || section.section_key}
          </h2>
          <div>
            <label className="admin-label">Title</label>
            <input
              value={section.title || ''}
              onChange={e => updateField(section.section_key, 'title', e.target.value)}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Content</label>
            <textarea
              value={section.content || ''}
              onChange={e => updateField(section.section_key, 'content', e.target.value)}
              className="admin-input min-h-[100px] resize-y"
            />
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
          {section.image_url && (
            <img src={section.image_url} alt="" className="w-40 h-28 object-cover rounded-lg border border-white/10" />
          )}
          {errors[section.section_key] && (
            <p className="text-red-400 text-sm">{errors[section.section_key]}</p>
          )}
          <div className="flex items-center gap-3">
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
      ))}
    </div>
  )
}
