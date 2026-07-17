import { createClient } from '@/lib/supabase/server'
import SEOManager from './SEOManager'

export const metadata = { title: 'SEO | Raid Ready Labs Admin' }

const DEFAULT_PAGES = ['/', '/products', '/portfolio', '/about', '/contact', '/blog', '/faq']

export default async function SEOPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('seo_settings').select('*').order('page_path')

  // Fill in any missing pages
  const map = new Map((settings || []).map(s => [s.page_path, s]))
  const pages = DEFAULT_PAGES.map(path => map.get(path) || {
    id: null,
    page_path: path,
    title: '',
    description: '',
    og_title: '',
    og_description: '',
    og_image: '',
    robots: 'index, follow',
    canonical_url: '',
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">SEO Settings</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Page titles and meta descriptions for each route.</p>
      </div>
      <SEOManager pages={pages} />
    </div>
  )
}
