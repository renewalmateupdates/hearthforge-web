'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flame, Menu, X } from 'lucide-react'
import type { NavItem } from '@/types'

interface Props { items: NavItem[] }

export default function PublicNav({ items }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (url: string) =>
    url === '/' ? pathname === '/' : pathname.startsWith(url)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-forge-night/90 backdrop-blur-xl border-b border-white/6">
      <div className="hf-nav">

        {/* Left — Logo */}
        <Link href="/" className="flex items-center gap-2.5 justify-self-start">
          <div className="w-7 h-7 rounded-lg bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center">
            <Flame className="w-4 h-4 text-brand-orange" />
          </div>
          <span className="font-bold text-sm tracking-widest text-hearthstone hidden sm:block">
            HEARTH<span className="text-brand-orange">FORGE</span>
          </span>
        </Link>

        {/* Center — Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {items.map(item => (
            <Link
              key={item.id}
              href={item.url}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(item.url)
                  ? 'text-hearthstone bg-white/8'
                  : 'text-hearthstone/50 hover:text-hearthstone hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right — CTA + Mobile toggle */}
        <div className="flex items-center gap-3 justify-self-end">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-lg bg-brand-orange hover:bg-amber text-white text-sm font-semibold transition-all shadow-sm shadow-brand-orange/20"
          >
            Get in Touch
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-hearthstone/60 hover:text-hearthstone hover:bg-white/8 transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/8 bg-forge-night/95 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-5 py-4 space-y-1">
            {items.map(item => (
              <Link
                key={item.id}
                href={item.url}
                onClick={() => setOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.url)
                    ? 'bg-brand-orange/15 text-brand-orange'
                    : 'text-hearthstone/60 hover:text-hearthstone hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center px-4 py-3 rounded-xl bg-brand-orange text-white text-sm font-semibold"
              >
                Get in Touch
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
