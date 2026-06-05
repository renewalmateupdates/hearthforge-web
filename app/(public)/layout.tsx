import { createClient } from '@/lib/supabase/server'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import type { NavItem } from '@/types'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const [{ data: mainMenu }, { data: footerMenu }, { data: settings }] = await Promise.all([
    supabase.from('navigation_menus').select('items').eq('slug', 'main').single(),
    supabase.from('navigation_menus').select('items').eq('slug', 'footer').single(),
    supabase.from('site_settings').select('key, value'),
  ])

  const mainItems: NavItem[] = Array.isArray(mainMenu?.items) ? mainMenu.items as NavItem[] : []
  const footerItems: NavItem[] = Array.isArray(footerMenu?.items) ? footerMenu.items as NavItem[] : []

  const settingsMap: Record<string, string> = {}
  for (const s of settings || []) {
    settingsMap[s.key] = s.value || ''
  }

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
