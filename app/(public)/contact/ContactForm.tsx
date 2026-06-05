'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Send failed')
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send failed. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
        <h3 className="text-xl font-bold text-hearthstone mb-2">Message Sent!</h3>
        <p className="text-hearthstone/50 text-sm">We&apos;ll get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-hearthstone/60 mb-1.5">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-hearthstone placeholder-hearthstone/25 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-hearthstone/60 mb-1.5">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-hearthstone placeholder-hearthstone/25 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            placeholder="you@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-hearthstone/60 mb-1.5">Phone</label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-hearthstone placeholder-hearthstone/25 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
          placeholder="(optional)"
        />
      </div>

      <div>
        <label className="block text-sm text-hearthstone/60 mb-1.5">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-hearthstone placeholder-hearthstone/25 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label className="block text-sm text-hearthstone/60 mb-1.5">Message *</label>
        <textarea
          value={form.message}
          onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-hearthstone placeholder-hearthstone/25 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-y min-h-[140px]"
          placeholder="Tell us what you need..."
          required
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full hf-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        style={{width:'100%',borderRadius:'0.75rem'}}
      >
        {sending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
