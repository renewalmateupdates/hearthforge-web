import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import type { NavItem, Product, PortfolioItem, Testimonial } from '@/types'

export const metadata = {
  title: 'Hearthforge — Precision Craft for Creators',
  description: 'Precision 3D-printed desk accessories built for streamers, gamers, and content creators.',
}

const DEFAULT_NAV: NavItem[] = [
  { id: '1', label: 'Products', url: '/products', order: 0 },
  { id: '2', label: 'Portfolio', url: '/portfolio', order: 1 },
  { id: '3', label: 'About', url: '/about', order: 2 },
  { id: '4', label: 'Blog', url: '/blog', order: 3 },
  { id: '5', label: 'Contact', url: '/contact', order: 4 },
]

const DEFAULT_FOOTER: NavItem[] = [
  { id: '1', label: 'Privacy Policy', url: '/privacy', order: 0 },
  { id: '2', label: 'Terms', url: '/terms', order: 1 },
  { id: '3', label: 'FAQ', url: '/faq', order: 2 },
]

const FEATURES = [
  {
    icon: '🎯',
    title: 'Built for Creators',
    desc: 'Every piece is designed specifically for streamers, gamers, and content creators who demand clean, functional setups.',
  },
  {
    icon: '⚙️',
    title: 'Precision Printed',
    desc: 'Professional-grade printing on premium PLA and PETG. Parts that fit perfectly, feel solid, and last for years.',
  },
  {
    icon: '🔧',
    title: 'Modular by Design',
    desc: 'Snap together, reconfigure, and expand. Every piece works with every other piece in the Hearthforge system.',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= rating ? 'text-amber' : 'text-white/15'}>★</span>
      ))}
    </div>
  )
}

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: mainMenu },
    { data: footerMenu },
    { data: settingsRows },
    { data: featuredProducts },
    { data: portfolioItems },
    { data: testimonials },
  ] = await Promise.all([
    supabase.from('navigation_menus').select('items').eq('slug', 'main').single(),
    supabase.from('navigation_menus').select('items').eq('slug', 'footer').single(),
    supabase.from('site_settings').select('key, value'),
    supabase.from('products').select('*').eq('is_featured', true).eq('is_available', true).order('sort_order').limit(6),
    supabase.from('portfolio_items').select('*').eq('is_featured', true).order('sort_order').limit(6),
    supabase.from('testimonials').select('*').eq('is_published', true).order('sort_order').limit(6),
  ])

  const mainItems: NavItem[] = Array.isArray(mainMenu?.items) && mainMenu.items.length > 0
    ? mainMenu.items as NavItem[]
    : DEFAULT_NAV

  const footerItems: NavItem[] = Array.isArray(footerMenu?.items) && footerMenu.items.length > 0
    ? footerMenu.items as NavItem[]
    : DEFAULT_FOOTER

  const settings: Record<string, string> = {}
  for (const s of settingsRows || []) settings[s.key] = s.value || ''

  return (
    <div className="flex flex-col min-h-screen bg-forge-night">
      <PublicNav items={mainItems} />

      <main className="flex-1 pt-16">

        {/* ── HERO ── */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
          {/* Glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-orange/8 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber/4 rounded-full blur-[120px]" />
          </div>

          <div className="relative w-full max-w-4xl mx-auto px-6 py-28 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 text-brand-orange text-xs font-semibold mb-8 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              PRECISION 3D PRINTING FOR CREATORS
            </div>

            {/* Headline */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-hearthstone leading-[1.05] tracking-tight mb-6">
              Forged for<br />
              <span className="text-brand-orange">Creators</span>
            </h1>

            {/* Sub */}
            <p className="text-lg sm:text-xl text-hearthstone/55 max-w-xl mx-auto mb-10 leading-relaxed">
              Modular 3D-printed desk accessories built for streamers,
              gamers, and content creators who demand clean setups.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products"
                className="px-8 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold text-base transition-colors shadow-lg shadow-brand-orange/20">
                Shop Products
              </Link>
              <Link href="/portfolio"
                className="px-8 py-4 rounded-xl border border-white/15 hover:border-white/30 text-hearthstone font-semibold text-base transition-colors hover:bg-white/5">
                View Portfolio
              </Link>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-hearthstone mb-4">Why Hearthforge?</h2>
              <p className="text-hearthstone/50 text-lg max-w-lg mx-auto">
                Every piece is designed with purpose and printed with precision.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="p-7 rounded-2xl border border-white/8 bg-white/3 hover:border-brand-orange/20 hover:bg-white/5 transition-all">
                  <div className="text-4xl mb-5">{f.icon}</div>
                  <h3 className="text-lg font-semibold text-hearthstone mb-3">{f.title}</h3>
                  <p className="text-hearthstone/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED PRODUCTS (only if data exists) ── */}
        {(featuredProducts?.length ?? 0) > 0 && (
          <section className="py-24 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-hearthstone">Our Products</h2>
                  <p className="text-hearthstone/50 mt-2">Modular, minimal, built to last.</p>
                </div>
                <Link href="/products" className="text-sm text-brand-orange hover:text-amber transition-colors font-medium">
                  See all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(featuredProducts || []).map((p: Product) => (
                  <Link key={p.id} href={`/products/${p.slug}`}
                    className="group block rounded-2xl border border-white/8 bg-white/3 hover:border-brand-orange/30 hover:bg-white/5 transition-all overflow-hidden">
                    <div className="aspect-square bg-white/5 overflow-hidden">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-hearthstone/10 text-6xl">⚙</div>
                      }
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-hearthstone group-hover:text-brand-orange transition-colors">{p.name}</h3>
                      {p.short_description && <p className="text-hearthstone/50 text-sm mt-1 line-clamp-2">{p.short_description}</p>}
                      <p className="text-amber font-semibold mt-3 text-sm">
                        {p.price_label || (p.price ? `$${p.price}` : 'Contact for pricing')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PORTFOLIO (only if data exists) ── */}
        {(portfolioItems?.length ?? 0) > 0 && (
          <section className="py-24 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-hearthstone">From the Workshop</h2>
                  <p className="text-hearthstone/50 mt-2">Recent builds and setups.</p>
                </div>
                <Link href="/portfolio" className="text-sm text-brand-orange hover:text-amber transition-colors font-medium">
                  See all →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(portfolioItems || []).map((item: PortfolioItem) => (
                  <Link key={item.id} href={`/portfolio/${item.slug}`}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/8">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full bg-white/5" />
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS (only if data exists) ── */}
        {(testimonials?.length ?? 0) > 0 && (
          <section className="py-24 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-hearthstone">What Creators Say</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(testimonials || []).map((t: Testimonial) => (
                  <div key={t.id} className="p-6 rounded-2xl border border-white/8 bg-white/3">
                    <StarRating rating={t.rating} />
                    <p className="text-hearthstone/70 text-sm leading-relaxed mt-3 mb-4">&ldquo;{t.content}&rdquo;</p>
                    <div>
                      <p className="text-sm font-semibold text-hearthstone">{t.customer_name}</p>
                      {t.customer_title && <p className="text-xs text-hearthstone/40">{t.customer_title}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section className="py-28 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative rounded-3xl border border-brand-orange/20 bg-brand-orange/5 px-8 py-20 text-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px]" />
              </div>
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-hearthstone mb-4">
                  Ready to upgrade your setup?
                </h2>
                <p className="text-hearthstone/60 text-lg max-w-xl mx-auto mb-8">
                  Get early access to the Hearthforge modular desk rail system.
                </p>
                <Link href="/contact"
                  className="inline-block px-10 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold text-base transition-colors shadow-lg shadow-brand-orange/25">
                  Get Early Access
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter footerLinks={footerItems} settings={settings} />
    </div>
  )
}
