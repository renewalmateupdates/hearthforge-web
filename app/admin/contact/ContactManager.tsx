'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, MailOpen, Download, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { ContactSubmission } from '@/types'

export default function ContactManager({ submissions }: { submissions: ContactSubmission[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<ContactSubmission | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const filtered = filter === 'all' ? submissions
    : filter === 'unread' ? submissions.filter(s => !s.is_read)
    : submissions.filter(s => s.is_read)

  async function markRead(id: string) {
    await fetch('/api/admin/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_read: true }),
    })
    router.refresh()
  }

  async function openSubmission(s: ContactSubmission) {
    setSelected(s)
    if (!s.is_read) {
      await markRead(s.id)
    }
  }

  function exportCSV() {
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Date', 'Read']
    const rows = submissions.map(s => [
      s.name, s.email, s.phone || '', s.subject || '', s.message.replace(/\n/g, ' '), s.created_at, s.is_read ? 'Yes' : 'No'
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contact-submissions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-brand-orange/20 text-brand-orange' : 'text-hearthstone/50 hover:text-hearthstone hover:bg-white/5'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={exportCSV} className="admin-btn-secondary text-sm flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card text-center py-10">
          <p className="text-hearthstone/40">No submissions found.</p>
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="w-8 px-4 py-3" />
                <th className="text-left text-hearthstone/40 font-medium px-4 py-3">From</th>
                <th className="text-left text-hearthstone/40 font-medium px-4 py-3 hidden md:table-cell">Subject</th>
                <th className="text-left text-hearthstone/40 font-medium px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="text-right text-hearthstone/40 font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(s => (
                <tr key={s.id} className={`hover:bg-white/3 transition-colors cursor-pointer ${!s.is_read ? 'bg-brand-orange/5' : ''}`}
                  onClick={() => openSubmission(s)}>
                  <td className="px-4 py-3 text-center">
                    {s.is_read
                      ? <MailOpen className="w-4 h-4 text-hearthstone/30 mx-auto" />
                      : <Mail className="w-4 h-4 text-brand-orange mx-auto" />
                    }
                  </td>
                  <td className="px-4 py-3">
                    <p className={`font-medium ${s.is_read ? 'text-hearthstone/70' : 'text-hearthstone'}`}>{s.name}</p>
                    <p className="text-hearthstone/40 text-xs">{s.email}</p>
                  </td>
                  <td className="px-4 py-3 text-hearthstone/60 hidden md:table-cell">{s.subject || 'No subject'}</td>
                  <td className="px-4 py-3 text-hearthstone/40 text-xs hidden lg:table-cell">
                    {formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end">
                      {!s.is_read && (
                        <button onClick={() => markRead(s.id)}
                          className="text-xs px-2 py-1 rounded hover:bg-white/10 text-hearthstone/50 hover:text-hearthstone transition-colors">
                          Mark read
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-forge-night border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-hearthstone">{selected.name}</h3>
                <p className="text-hearthstone/50 text-sm">{selected.email}</p>
                {selected.phone && <p className="text-hearthstone/40 text-xs">{selected.phone}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded hover:bg-white/10 text-hearthstone/40 hover:text-hearthstone">
                <X className="w-4 h-4" />
              </button>
            </div>
            {selected.subject && (
              <p className="text-sm font-medium text-hearthstone/70 mb-3">Subject: {selected.subject}</p>
            )}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-hearthstone/80 whitespace-pre-wrap">{selected.message}</p>
            </div>
            <p className="text-xs text-hearthstone/30 mt-3">
              {new Date(selected.created_at).toLocaleString()}
            </p>
            <a href={`mailto:${selected.email}`}
              className="mt-4 inline-block admin-btn-primary text-sm">
              Reply via Email
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
