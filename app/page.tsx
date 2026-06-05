import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Target, Layers, Wrench } from 'lucide-react'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import type { NavItem, Product, PortfolioItem, Testimonial } from '@/types'

export const metadata = {
  title: 'Hearthforge — Precision Craft for Creators',
  description: 'Precision 3D-printed desk accessories built for streamers, gamers, and content creators.',
}

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

const FEATURES = [
  {
    Icon: Target,
    title: 'Built for Creators',
    desc: 'Every piece is designed specifically for streamers, gamers, and content creators who demand clean, functional setups.',
  },
  {
    Icon: Layers,
    title: 'Precision Printed',
    desc: 'Professional-grade printing on premium PLA and PETG. Parts that fit perfectly, feel solid, and last for years.',
  },
  {
    Icon: Wrench,
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

const cn = 'hf-section'

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

        {/* ─── HERO ─── */}
        <section className="relative flex items-center justify-center min-h-[94vh] overflow-hidden">
          {/* Background atmosphere — centered, no side bias */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-brand-orange/7 rounded-full blur-[160px]" />
            {/* Subtle grid lines */}
            <div className="absolute inset-0 opacity-[0.015]"
              style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          </div>

          <div className={`relative w-full hf-section py-32 flex flex-col items-center text-center`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/25 bg-brand-orange/8 text-brand-orange text-xs font-semibold mb-10 tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              PRECISION 3D PRINTING FOR CREATORS
            </div>

            {/* Headline */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-hearthstone leading-[1.04] tracking-tight mb-7">
              Forged for<br />
              <span className="text-brand-orange">Creators</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-hearthstone/50 max-w-lg mx-auto mb-10 leading-relaxed">
              Modular 3D-printed desk accessories built for streamers,
              gamers, and content creators who demand clean setups.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products"
                className="px-12 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold text-base transition-all shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 hover:-translate-y-0.5">
                Shop Products
              </Link>
              <Link href="/portfolio"
                className="px-4 py-3.5 text-hearthstone/70 font-semibold text-base transition-colors hover:text-hearthstone">
                View Portfolio →
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center justify-center gap-8 mt-14 pt-10 border-t border-white/6 w-full max-w-xs mx-auto">
              <div className="text-center shrink-0">
                <p className="text-sm font-semibold text-hearthstone">PLA / PETG</p>
                <p className="text-xs text-hearthstone/35 mt-0.5">Premium materials</p>
              </div>
              <div className="w-px h-8 bg-white/10 shrink-0" />
              <div className="text-center shrink-0">
                <p className="text-sm font-semibold text-hearthstone">Modular</p>
                <p className="text-xs text-hearthstone/35 mt-0.5">Expandable system</p>
              </div>
              <div className="w-px h-8 bg-white/10 shrink-0" />
              <div className="text-center shrink-0">
                <p className="text-sm font-semibold text-hearthstone">USA Built</p>
                <p className="text-xs text-hearthstone/35 mt-0.5">Small batch</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="py-24 border-t border-white/5">
          <div className="hf-section">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <p className="text-xs font-semibold text-brand-orange/70 uppercase tracking-widest mb-3">Why Hearthforge</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-hearthstone mb-4">Built different. On purpose.</h2>
              <p className="text-hearthstone/45 text-lg leading-relaxed">
                Every piece is designed with purpose and printed with precision.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div key={i} className="relative p-8 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-brand-orange/25 hover:bg-brand-orange/[0.02] transition-all group">
                  <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-brand-orange/30 group-hover:bg-brand-orange/60 transition-colors" />
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-5 group-hover:bg-brand-orange/15 transition-colors">
                    <f.Icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h3 className="text-base font-semibold text-hearthstone mb-2.5">{f.title}</h3>
                  <p className="text-hearthstone/45 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURED PRODUCTS ─── */}
        {(featuredProducts?.length ?? 0) > 0 && (
          <section className="py-24 border-t border-white/5">
            <div className="hf-section">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs font-semibold text-brand-orange/70 uppercase tracking-widest mb-2">Products</p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-hearthstone">Our Lineup</h2>
                </div>
                <Link href="/products" className="text-sm text-brand-orange hover:text-amber transition-colors font-medium">
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(featuredProducts || []).map((p: Product) => (
                  <Link key={p.id} href={`/products/${p.slug}`}
                    className="group block rounded-2xl border border-white/8 bg-white/[0.02] hover:border-brand-orange/25 transition-all overflow-hidden">
                    <div className="aspect-square bg-white/4 overflow-hidden">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center text-hearthstone/8 text-6xl">⚙</div>
                      }
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-hearthstone group-hover:text-brand-orange transition-colors">{p.name}</h3>
                      {p.short_description && <p className="text-hearthstone/40 text-sm mt-1.5 line-clamp-2">{p.short_description}</p>}
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

        {/* ─── PORTFOLIO PREVIEW ─── */}
        {(portfolioItems?.length ?? 0) > 0 && (
          <section className="py-24 border-t border-white/5">
            <div className="hf-section">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs font-semibold text-brand-orange/70 uppercase tracking-widest mb-2">Portfolio</p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-hearthstone">From the Workshop</h2>
                </div>
                <Link href="/portfolio" className="text-sm text-brand-orange hover:text-amber transition-colors font-medium">
                  See all →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(portfolioItems || []).map((item: PortfolioItem) => (
                  <Link key={item.id} href={`/portfolio/${item.slug}`}
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-white/8 hover:border-white/18 transition-colors">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full bg-white/4" />
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── TESTIMONIALS ─── */}
        {(testimonials?.length ?? 0) > 0 && (
          <section className="py-24 border-t border-white/5">
            <div className="hf-section">
              <div className="text-center mb-12">
                <p className="text-xs font-semibold text-brand-orange/70 uppercase tracking-widest mb-3">Reviews</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-hearthstone">What Creators Say</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(testimonials || []).map((t: Testimonial) => (
                  <div key={t.id} className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <StarRating rating={t.rating} />
                    <p className="text-hearthstone/65 text-sm leading-relaxed mt-4 mb-5">&ldquo;{t.content}&rdquo;</p>
                    <div>
                      <p className="text-sm font-semibold text-hearthstone">{t.customer_name}</p>
                      {t.customer_title && <p className="text-xs text-hearthstone/35 mt-0.5">{t.customer_title}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── CTA ─── */}
        <section className="py-28 border-t border-white/5 text-center">
          <div className="hf-section">
            <p className="text-xs font-semibold text-brand-orange/70 uppercase tracking-widest mb-5">Get Started</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-hearthstone mb-4">
              Ready to upgrade your setup?
            </h2>
            <p className="text-hearthstone/50 text-lg max-w-md mx-auto mb-10 leading-relaxed">
              Get early access to the Hearthforge modular desk rail system.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact"
                className="px-12 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold text-base transition-all shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 hover:-translate-y-0.5">
                Get Early Access
              </Link>
              <Link href="/products"
                className="text-hearthstone/60 font-semibold text-base hover:text-hearthstone transition-colors">
                Browse products →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter footerLinks={footerItems} settings={settings} />
    </div>
  )
}



