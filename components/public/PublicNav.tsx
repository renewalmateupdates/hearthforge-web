'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flame, Menu, X } from 'lucide-react'
import type { NavItem } from '@/types'

interface Props {
  items: NavItem[]
}

export default function PublicNav({ items }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-forge-night/80 backdrop-blur-md border-b border-white/8">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Flame className="w-6 h-6 text-amber" />
          <span className="font-bold text-base tracking-wide text-hearthstone">
            HEARTH<span className="text-brand-orange">FORGE</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {items.map(item => {
            const isActive = pathname === item.url || (item.url !== '/' && pathname.startsWith(item.url))
            return (
              <Link
                key={item.id}
                href={item.url}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-hearthstone'
                    : 'text-hearthstone/50 hover:text-hearthstone'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact" className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-amber text-white text-sm font-medium transition-colors">
            Get in Touch
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-hearthstone/60 hover:text-hearthstone hover:bg-white/5 transition-colors"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/8 bg-forge-night">
          <nav className="px-4 py-3 space-y-1">
            {items.map(item => (
              <Link
                key={item.id}
                href={item.url}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.url
                    ? 'bg-brand-orange/15 text-brand-orange'
                    : 'text-hearthstone/60 hover:text-hearthstone hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block mt-2 px-3 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-medium text-center"
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
