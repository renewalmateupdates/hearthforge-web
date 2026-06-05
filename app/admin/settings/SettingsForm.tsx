'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

interface Props {
  settings: Record<string, string>
}

const SECTIONS = [
  {
    title: 'Business Info',
    fields: [
      { key: 'business_name', label: 'Business Name', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'footer_text', label: 'Footer Text', type: 'text' },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { key: 'contact_email', label: 'Contact Email', type: 'email' },
      { key: 'contact_phone', label: 'Phone Number', type: 'tel' },
      { key: 'address', label: 'Address', type: 'text' },
    ],
  },
  {
    title: 'Social Media',
    fields: [
      { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
      { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
      { key: 'twitter_url', label: 'Twitter / X URL', type: 'url' },
      { key: 'tiktok_url', label: 'TikTok URL', type: 'url' },
      { key: 'youtube_url', label: 'YouTube URL', type: 'url' },
    ],
  },
  {
    title: 'Analytics',
    fields: [
      { key: 'google_analytics_id', label: 'Google Analytics ID (G-XXXXXXXX)', type: 'text' },
    ],
  },
]

export default function SettingsForm({ settings }: Props) {
  const [values, setValues] = useState<Record<string, string>>(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function handleChange(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
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
    <div className="space-y-6">
      {SECTIONS.map(section => (
        <div key={section.title} className="admin-card">
          <h2 className="text-sm font-semibold text-hearthstone/40 uppercase tracking-wider mb-4">{section.title}</h2>
          <div className="space-y-4">
            {section.fields.map(field => (
              <div key={field.key}>
                <label className="admin-label">{field.label}</label>
                <input
                  type={field.type}
                  value={values[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  className="admin-input"
                  placeholder={field.label}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="admin-btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && <span className="text-green-400 text-sm">Saved successfully</span>}
      </div>
    </div>
  )
}
