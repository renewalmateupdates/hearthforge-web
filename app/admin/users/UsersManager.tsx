'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, UserCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Profile } from '@/types'

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-brand-orange/20 text-brand-orange',
  editor: 'bg-blue-400/15 text-blue-400',
  viewer: 'bg-white/10 text-hearthstone/50',
}

export default function UsersManager({ users, currentUserId }: { users: Profile[]; currentUserId: string }) {
  const router = useRouter()
  const [showInvite, setShowInvite] = useState(false)
  const [invite, setInvite] = useState({ email: '', full_name: '', password: '', role: 'editor' })
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    setInviteError('')
    setInviteSuccess(false)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invite),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to create user')
      }
      setInviteSuccess(true)
      setInvite({ email: '', full_name: '', password: '', role: 'editor' })
      router.refresh()
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setInviting(false)
    }
  }

  async function handleRoleChange(userId: string, role: string) {
    setUpdating(userId)
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role }),
      })
      router.refresh()
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-5">
      <button onClick={() => setShowInvite(!showInvite)} className="admin-btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" /> Invite User
      </button>

      {showInvite && (
        <div className="admin-card space-y-4">
          <h3 className="font-semibold text-hearthstone">Create New User</h3>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Email *</label>
                <input type="email" value={invite.email} onChange={e => setInvite(p => ({ ...p, email: e.target.value }))} className="admin-input" required />
              </div>
              <div>
                <label className="admin-label">Full Name</label>
                <input value={invite.full_name} onChange={e => setInvite(p => ({ ...p, full_name: e.target.value }))} className="admin-input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Temporary Password *</label>
                <input type="password" value={invite.password} onChange={e => setInvite(p => ({ ...p, password: e.target.value }))} className="admin-input" required minLength={8} />
              </div>
              <div>
                <label className="admin-label">Role</label>
                <select value={invite.role} onChange={e => setInvite(p => ({ ...p, role: e.target.value }))} className="admin-input">
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            {inviteError && <p className="text-red-400 text-sm">{inviteError}</p>}
            {inviteSuccess && <p className="text-green-400 text-sm">User created successfully.</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={inviting} className="admin-btn-primary text-sm">
                {inviting ? 'Creating...' : 'Create User'}
              </button>
              <button type="button" onClick={() => setShowInvite(false)} className="admin-btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left text-hearthstone/40 font-medium px-5 py-3">User</th>
              <th className="text-left text-hearthstone/40 font-medium px-5 py-3 hidden md:table-cell">Joined</th>
              <th className="text-left text-hearthstone/40 font-medium px-5 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/3 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-xs font-bold text-brand-orange shrink-0">
                      {u.full_name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-hearthstone">{u.full_name || 'Unnamed'}</p>
                        {u.id === currentUserId && <span className="text-xs text-hearthstone/30">(you)</span>}
                      </div>
                      <p className="text-hearthstone/40 text-xs">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-hearthstone/40 text-xs hidden md:table-cell">
                  {formatDistanceToNow(new Date(u.created_at), { addSuffix: true })}
                </td>
                <td className="px-5 py-3">
                  {u.id === currentUserId ? (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] || ''}`}>
                      <UserCheck className="w-3 h-3" /> {u.role}
                    </span>
                  ) : (
                    <select
                      value={u.role}
                      disabled={updating === u.id}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      className={`text-xs px-2 py-0.5 rounded-full border-0 font-medium cursor-pointer bg-white/5 ${ROLE_COLORS[u.role] || ''}`}
                    >
                      <option value="admin">admin</option>
                      <option value="editor">editor</option>
                      <option value="viewer">viewer</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
