'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-forge-night flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-hearthstone p-1 shrink-0">
              <img src="/logo.png" alt="Raid Ready Labs" className="max-w-full max-h-full object-contain" />
            </span>
            <span className="text-2xl font-bold text-hearthstone tracking-tight">
              RAID READY <span className="text-brand-orange">LABS</span>
            </span>
          </div>
          <p className="text-hearthstone/50 text-sm">Admin Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
          <div>
            <label className="admin-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="admin-input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="admin-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="admin-input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full admin-btn-primary py-3">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-hearthstone/30 text-xs mt-6">
          Raid Ready Labs Admin — Authorized Access Only
        </p>
      </div>
    </div>
  )
}
