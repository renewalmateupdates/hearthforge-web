'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import type { Product } from '@/types'

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  if (!products.length) {
    return (
      <div className="admin-card text-center py-12">
        <p className="text-hearthstone/40">No products yet.</p>
        <Link href="/admin/products/new" className="admin-btn-primary mt-4 inline-block">Add your first product</Link>
      </div>
    )
  }

  return (
    <div className="admin-card p-0 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/8">
            <th className="text-left text-hearthstone/40 font-medium px-5 py-3">Name</th>
            <th className="text-left text-hearthstone/40 font-medium px-5 py-3 hidden md:table-cell">Category</th>
            <th className="text-left text-hearthstone/40 font-medium px-5 py-3 hidden md:table-cell">Price</th>
            <th className="text-left text-hearthstone/40 font-medium px-5 py-3">Status</th>
            <th className="text-right text-hearthstone/40 font-medium px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map(p => (
            <tr key={p.id} className="hover:bg-white/3 transition-colors">
              <td className="px-5 py-3">
                <p className="font-medium text-hearthstone">{p.name}</p>
                <p className="text-hearthstone/40 text-xs">{p.slug}</p>
              </td>
              <td className="px-5 py-3 text-hearthstone/60 hidden md:table-cell">{p.category || '—'}</td>
              <td className="px-5 py-3 text-hearthstone/60 hidden md:table-cell">
                {p.price_label || (p.price ? `$${p.price}` : '—')}
              </td>
              <td className="px-5 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  p.is_available
                    ? 'bg-green-400/15 text-green-400'
                    : 'bg-white/10 text-hearthstone/40'
                }`}>
                  {p.is_available ? 'Available' : 'Hidden'}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="p-1.5 rounded hover:bg-white/10 text-hearthstone/60 hover:text-hearthstone transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={deleting === p.id}
                    className="p-1.5 rounded hover:bg-red-400/10 text-hearthstone/60 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
