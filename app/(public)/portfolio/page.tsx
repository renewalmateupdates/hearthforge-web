import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { PortfolioItem } from '@/types'

export const metadata = {
  title: 'Portfolio',
  description: 'Browse our work — builds, setups, and custom projects from the Hearthforge workshop.',
}

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('sort_order', { ascending: true })

  const categories = [...new Set((items || []).map(i => i.category).filter(Boolean))]

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-hearthstone mb-4">Portfolio</h1>
        <p className="text-hearthstone/50 text-lg">Builds, setups, and custom work from the workshop.</p>
      </div>

      {(!items || items.length === 0) && (
        <div className="text-center py-20">
          <p className="text-hearthstone/40">No portfolio items yet. Check back soon.</p>
        </div>
      )}

      {categories.length > 1 ? (
        <div className="space-y-14">
          {categories.map(cat => {
            const catItems = (items || []).filter(i => i.category === cat)
            return (
              <section key={cat}>
                <h2 className="text-sm font-semibold text-hearthstone/40 uppercase tracking-wider mb-6">{cat}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {catItems.map((item: PortfolioItem) => <PortfolioCard key={item.id} item={item} />)}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(items || []).map((item: PortfolioItem) => <PortfolioCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <Link href={`/portfolio/${item.slug}`}
      className="group relative aspect-square rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-colors block">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      ) : (
        <div className="w-full h-full bg-white/5" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
        <div>
          <p className="text-base font-semibold text-white">{item.title}</p>
          {item.category && <p className="text-xs text-white/60 mt-0.5">{item.category}</p>}
        </div>
      </div>
    </Link>
  )
}
