import Link from 'next/link'
import { Flame } from 'lucide-react'
import type { NavItem } from '@/types'

interface Props {
  footerLinks: NavItem[]
  settings: Record<string, string>
}

export default function PublicFooter({ footerLinks, settings }: Props) {
  const footerText = settings.footer_text || '© 2026 Hearthforge. All rights reserved.'
  const socialLinks = [
    { key: 'instagram_url', label: 'Instagram' },
    { key: 'twitter_url', label: 'Twitter' },
    { key: 'facebook_url', label: 'Facebook' },
    { key: 'youtube_url', label: 'YouTube' },
    { key: 'tiktok_url', label: 'TikTok' },
  ].filter(s => settings[s.key])

  return (
    <footer className="bg-forge-night border-t border-white/8 mt-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-amber" />
              <span className="font-bold text-sm tracking-wide text-hearthstone">
                HEARTH<span className="text-brand-orange">FORGE</span>
              </span>
            </Link>
            <p className="text-hearthstone/40 text-sm leading-relaxed">
              {settings.tagline || 'Precision Craft. Forged for Creators.'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-hearthstone/30 uppercase tracking-wider mb-3">Quick Links</p>
            <nav className="space-y-2">
              {[
                { href: '/products', label: 'Products' },
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/about', label: 'About' },
                { href: '/blog', label: 'Blog' },
                { href: '/faq', label: 'FAQ' },
                { href: '/contact', label: 'Contact' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="block text-sm text-hearthstone/50 hover:text-hearthstone transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <p className="text-xs font-semibold text-hearthstone/30 uppercase tracking-wider mb-3">Connect</p>
            {settings.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="block text-sm text-hearthstone/50 hover:text-hearthstone transition-colors mb-2">
                {settings.contact_email}
              </a>
            )}
            {settings.contact_phone && (
              <a href={`tel:${settings.contact_phone}`} className="block text-sm text-hearthstone/50 hover:text-hearthstone transition-colors mb-3">
                {settings.contact_phone}
              </a>
            )}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {socialLinks.map(s => (
                  <a key={s.key} href={settings[s.key]} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-hearthstone/40 hover:text-hearthstone transition-colors">
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-hearthstone/30 text-xs">{footerText}</p>
          {footerLinks.length > 0 && (
            <div className="flex gap-4">
              {footerLinks.map(link => (
                <Link key={link.id} href={link.url} className="text-xs text-hearthstone/30 hover:text-hearthstone transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
