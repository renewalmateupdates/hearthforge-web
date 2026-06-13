import Link from 'next/link'
import type { NavItem } from '@/types'
import NewsletterSignup from './NewsletterSignup'

interface Props {
  footerLinks: NavItem[]
  settings: Record<string, string>
}

export default function PublicFooter({ footerLinks, settings }: Props) {
  const footerText = settings.footer_text || '© 2026 Hearthforge. All rights reserved.'

  const socialLinks = [
    { key: 'instagram_url', label: 'Instagram' },
    { key: 'twitter_url', label: 'X / Twitter' },
    { key: 'youtube_url', label: 'YouTube' },
    { key: 'tiktok_url', label: 'TikTok' },
  ].filter(s => settings[s.key])

  return (
    <footer className="bg-forge-night border-t border-white/8">
      <div className="hf-section py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Hearthforge" className="w-8 h-8 object-contain invert" />
              <span className="font-bold text-sm tracking-widest text-hearthstone">
                HEARTH<span className="text-brand-orange">FORGE</span>
              </span>
            </Link>
            <p className="text-hearthstone/40 text-sm leading-relaxed max-w-xs">
              {settings.tagline || 'Precision Craft. Forged for Creators.'}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-5">
                {socialLinks.map(s => (
                  <a
                    key={s.key}
                    href={settings[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-hearthstone/35 hover:text-brand-orange transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
            <div className="mt-6">
              <p className="text-xs font-semibold text-hearthstone/25 uppercase tracking-widest mb-2.5">
                Stay in the loop
              </p>
              <NewsletterSignup />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold text-hearthstone/25 uppercase tracking-widest mb-4">
              Quick Links
            </p>
            <nav className="space-y-2.5">
              {[
                { href: '/products',  label: 'Products'  },
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/about',     label: 'About'     },
                { href: '/blog',      label: 'Blog'      },
                { href: '/faq',       label: 'FAQ'       },
                { href: '/contact',   label: 'Contact'   },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-hearthstone/45 hover:text-hearthstone transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-hearthstone/25 uppercase tracking-widest mb-4">
              Contact
            </p>
            {settings.contact_email ? (
              <a
                href={`mailto:${settings.contact_email}`}
                className="block text-sm text-hearthstone/45 hover:text-hearthstone transition-colors mb-2"
              >
                {settings.contact_email}
              </a>
            ) : (
              <a
                href="mailto:hearthforge.hq@gmail.com"
                className="block text-sm text-hearthstone/45 hover:text-hearthstone transition-colors mb-2"
              >
                hearthforge.hq@gmail.com
              </a>
            )}
            <Link
              href="/contact"
              className="hf-footer-btn"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-hearthstone/25 text-xs">{footerText}</p>
          <div className="flex items-center gap-5">
            {footerLinks.length > 0
              ? footerLinks.map(link => (
                  <Link
                    key={link.id}
                    href={link.url}
                    className="text-xs text-hearthstone/25 hover:text-hearthstone/60 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))
              : [
                  { href: '/privacy', label: 'Privacy' },
                  { href: '/terms',   label: 'Terms'   },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs text-hearthstone/25 hover:text-hearthstone/60 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))
            }
          </div>
        </div>
      </div>
    </footer>
  )
}

