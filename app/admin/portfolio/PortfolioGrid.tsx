'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Star } from 'lucide-react'
import type { PortfolioItem } from '@/types'

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  if (!items.length) {
    return (
      <div className="admin-card text-center py-12">
        <p className="text-hearthstone/40">No portfolio items yet.</p>
        <Link href="/admin/portfolio/new" className="admin-btn-primary mt-4 inline-block">Add your first item</Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.id} className="group relative admin-card p-0 overflow-hidden">
          <div className="aspect-square bg-white/5 overflow-hidden">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-hearthstone/20 text-sm">No image</div>
            )}
          </div>
          <div className="p-3">
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <p className="text-sm font-medium text-hearthstone truncate">{item.title}</p>
                {item.category && <p className="text-xs text-hearthstone/40 truncate">{item.category}</p>}
              </div>
              {item.is_featured && <Star className="w-3.5 h-3.5 text-amber shrink-0 mt-0.5" />}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Link href={`/admin/portfolio/${item.id}`} className="p-1.5 rounded hover:bg-white/10 text-hearthstone/50 hover:text-hearthstone transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </Link>
              <button onClick={() => handleDelete(item.id, item.title)} disabled={deleting === item.id} className="p-1.5 rounded hover:bg-red-400/10 text-hearthstone/50 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
