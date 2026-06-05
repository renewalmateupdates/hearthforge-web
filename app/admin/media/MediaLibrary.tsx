'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Trash2, Copy, Check } from 'lucide-react'
import type { MediaItem } from '@/types'

export default function MediaLibrary({ items: initial }: { items: MediaItem[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    setUploadError('')
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('folder', 'general')
        const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
        if (!res.ok) {
          const d = await res.json()
          throw new Error(d.error || 'Upload failed')
        }
      }
      router.refresh()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-white/10 hover:border-brand-orange/40 rounded-xl p-8 text-center cursor-pointer transition-colors group"
      >
        <Upload className="w-8 h-8 text-hearthstone/20 group-hover:text-brand-orange/60 mx-auto mb-3 transition-colors" />
        <p className="text-hearthstone/50 text-sm">
          {uploading ? 'Uploading...' : 'Click to upload images'}
        </p>
        <p className="text-hearthstone/25 text-xs mt-1">PNG, JPG, WebP, SVG</p>
        <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {uploadError && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{uploadError}</p>
      )}

      {initial.length === 0 ? (
        <div className="admin-card text-center py-10">
          <p className="text-hearthstone/40">No media uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {initial.map(item => (
            <div key={item.id} className="group relative admin-card p-0 overflow-hidden">
              <div className="aspect-square bg-white/5 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.alt_text || item.original_name || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(item.url)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Copy URL"
                >
                  {copied === item.url ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2">
                <p className="text-xs text-hearthstone/40 truncate">{item.original_name || item.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
