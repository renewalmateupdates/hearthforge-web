import { createClient } from '@/lib/supabase/server'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import type { NavItem } from '@/types'

const DEFAULT_NAV: NavItem[] = [
  { id: '1', label: 'Products',  url: '/products',  order: 0 },
  { id: '2', label: 'Portfolio', url: '/portfolio', order: 1 },
  { id: '3', label: 'About',     url: '/about',     order: 2 },
  { id: '4', label: 'Blog',      url: '/blog',      order: 3 },
  { id: '5', label: 'Contact',   url: '/contact',   order: 4 },
]

const DEFAULT_FOOTER: NavItem[] = [
  { id: '1', label: 'Privacy Policy', url: '/privacy', order: 0 },
  { id: '2', label: 'Terms',          url: '/terms',   order: 1 },
  { id: '3', label: 'FAQ',            url: '/faq',     order: 2 },
]

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const [{ data: mainMenu }, { data: footerMenu }, { data: settings }] = await Promise.all([
    supabase.from('navigation_menus').select('items').eq('slug', 'main').single(),
    supabase.from('navigation_menus').select('items').eq('slug', 'footer').single(),
    supabase.from('site_settings').select('key, value'),
  ])

  const mainItems: NavItem[] = Array.isArray(mainMenu?.items) && mainMenu.items.length > 0
    ? mainMenu.items as NavItem[]
    : DEFAULT_NAV

  const footerItems: NavItem[] = Array.isArray(footerMenu?.items) && footerMenu.items.length > 0
    ? footerMenu.items as NavItem[]
    : DEFAULT_FOOTER

  const settingsMap: Record<string, string> = {}
  for (const s of settings || []) settingsMap[s.key] = s.value || ''

  return (
    <div className="flex flex-col min-h-screen bg-forge-night">
      <PublicNav items={mainItems} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <PublicFooter footerLinks={footerItems} settings={settingsMap} />
    </div>
  )
}
