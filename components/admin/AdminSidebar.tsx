'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Settings, Home, Package,
  Image, Users, MessageSquare, HelpCircle, FileText,
  Mail, Search, FolderOpen, Navigation, BarChart3, UserCog
} from 'lucide-react'
import type { Profile } from '@/types'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Divider', divider: true, label2: 'Content' },
  { label: 'Homepage', href: '/admin/homepage', icon: Home },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Portfolio', href: '/admin/portfolio', icon: Image },
  { label: 'About Page', href: '/admin/about', icon: Users },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Divider', divider: true, label2: 'Site' },
  { label: 'Contact Forms', href: '/admin/contact', icon: Mail },
  { label: 'Media Library', href: '/admin/media', icon: FolderOpen },
  { label: 'Navigation', href: '/admin/navigation', icon: Navigation },
  { label: 'SEO', href: '/admin/seo', icon: Search },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Divider', divider: true, label2: 'System' },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  { label: 'Users', href: '/admin/users', icon: UserCog },
]

export default function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-white/3 border-r border-white/8 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/8">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/logo.png" alt="Raid Ready Labs" className="w-6 h-6 object-contain invert shrink-0" />
          <span className="font-bold text-sm tracking-wide text-hearthstone">
            HEARTH<span className="text-brand-orange">FORGE</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item, i) => {
          if ('divider' in item && item.divider) {
            return (
              <div key={i} className="pt-4 pb-1 px-2">
                <span className="text-xs font-semibold text-hearthstone/25 uppercase tracking-wider">
                  {item.label2}
                </span>
              </div>
            )
          }

          if (!item.href) return null
          const Icon = item.icon!
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-brand-orange/20 text-brand-orange font-medium'
                  : 'text-hearthstone/60 hover:text-hearthstone hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-4 py-3 border-t border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-brand-orange">
              {profile.full_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-hearthstone truncate">{profile.full_name}</p>
            <p className="text-xs text-hearthstone/40 capitalize">{profile.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
