'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Subscribe failed')
      }
      setSuccess(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscribe failed. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-400">
        <CheckCircle className="w-4 h-4" />
        <span>You&apos;re on the list!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-hearthstone text-sm placeholder-hearthstone/25 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
          placeholder="you@email.com"
          required
        />
        <button
          type="submit"
          disabled={sending}
          className="px-4 py-2.5 rounded-xl bg-brand-orange text-forge-night text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {sending ? '...' : 'Join'}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  )
}
