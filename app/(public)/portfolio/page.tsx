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
  const hasItems = (items?.length ?? 0) > 0

  return (
    <div className="min-h-screen">

      {/* Header */}
      <section className="pt-12 md:pt-16 pb-16 border-b border-white/5">
        <div className="hf-section">
          <h1 className="text-5xl md:text-6xl font-bold text-hearthstone mb-4">Portfolio</h1>
          <p className="text-hearthstone/50 text-xl">Builds, setups, and custom work from the workshop.</p>
        </div>
      </section>

      <div className="hf-section py-16">
        {hasItems ? (
          categories.length > 1 ? (
            <div className="space-y-16">
              {categories.map(cat => {
                const catItems = (items || []).filter(i => i.category === cat)
                return (
                  <section key={cat}>
                    <h2 className="text-xs font-semibold text-hearthstone/40 uppercase tracking-widest mb-8">{cat}</h2>
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
          )
        ) : (
          /* Empty state */
          <div className="py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl">📸</span>
            </div>
            <h2 className="text-2xl font-bold text-hearthstone mb-3">Workshop Shots Coming Soon</h2>
            <p className="text-hearthstone/50 text-lg max-w-md mx-auto mb-8 leading-relaxed">
              We&apos;re documenting our first builds. Check back soon to see setups, prints, and custom work from the shop.
            </p>
            <Link href="/contact"
              className="inline-block px-8 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold transition-colors shadow-lg shadow-brand-orange/20">
              Request Custom Work
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <Link href={`/portfolio/${item.slug}`}
      className="group relative aspect-square rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-colors block">
      {item.image_url
        ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        : <div className="w-full h-full bg-white/5" />
      }
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
        <div>
          <p className="text-base font-semibold text-white">{item.title}</p>
          {item.category && <p className="text-xs text-white/60 mt-0.5">{item.category}</p>}
        </div>
      </div>
    </Link>
  )
}

