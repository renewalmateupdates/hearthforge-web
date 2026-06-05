'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { BlogPost } from '@/types'

export default function BlogTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter)

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'published', 'draft'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s ? 'bg-brand-orange/20 text-brand-orange' : 'text-hearthstone/50 hover:text-hearthstone hover:bg-white/5'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-1.5 text-xs opacity-60">
              {s === 'all' ? posts.length : posts.filter(p => p.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card text-center py-10">
          <p className="text-hearthstone/40">No posts found.</p>
          <Link href="/admin/blog/new" className="admin-btn-primary mt-4 inline-block text-sm">Write your first post</Link>
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left text-hearthstone/40 font-medium px-5 py-3">Title</th>
                <th className="text-left text-hearthstone/40 font-medium px-5 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-hearthstone/40 font-medium px-5 py-3">Status</th>
                <th className="text-left text-hearthstone/40 font-medium px-5 py-3 hidden lg:table-cell">Date</th>
                <th className="text-right text-hearthstone/40 font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(post => (
                <tr key={post.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-hearthstone line-clamp-1">{post.title}</p>
                    <p className="text-hearthstone/40 text-xs">{post.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-hearthstone/60 hidden md:table-cell">
                    {(post.category as { name: string } | null)?.name || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-green-400/15 text-green-400'
                        : 'bg-white/10 text-hearthstone/40'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-hearthstone/40 hidden lg:table-cell text-xs">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/blog/${post.id}`} className="p-1.5 rounded hover:bg-white/10 text-hearthstone/60 hover:text-hearthstone transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => handleDelete(post.id, post.title)} disabled={deleting === post.id}
                        className="p-1.5 rounded hover:bg-red-400/10 text-hearthstone/60 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
