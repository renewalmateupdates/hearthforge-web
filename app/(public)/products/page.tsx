import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Product } from '@/types'

export const metadata = {
  title: 'Products',
  description: 'Shop our full lineup of precision 3D-printed desk accessories and creator gear.',
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('sort_order', { ascending: true })

  const categories = [...new Set((products || []).map(p => p.category).filter(Boolean))]
  const hasProducts = (products?.length ?? 0) > 0

  return (
    <div className="min-h-screen">

      {/* Header */}
      <section className="pt-12 md:pt-16 pb-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-hearthstone mb-4">Products</h1>
          <p className="text-hearthstone/50 text-xl">Precision-crafted accessories for your setup.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
        {hasProducts ? (
          categories.length > 0 ? (
            <div className="space-y-16">
              {categories.map(cat => {
                const catProducts = (products || []).filter(p => p.category === cat)
                return (
                  <section key={cat}>
                    <h2 className="text-xs font-semibold text-hearthstone/40 uppercase tracking-widest mb-8">{cat}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catProducts.map((p: Product) => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </section>
                )
              })}
              {(products || []).filter(p => !p.category).length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold text-hearthstone/40 uppercase tracking-widest mb-8">Other</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(products || []).filter(p => !p.category).map((p: Product) => <ProductCard key={p.id} product={p} />)}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(products || []).map((p: Product) => <ProductCard key={p.id} product={p} />)}
            </div>
          )
        ) : (
          /* Empty state */
          <div className="py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl">⚙️</span>
            </div>
            <h2 className="text-2xl font-bold text-hearthstone mb-3">Products Coming Soon</h2>
            <p className="text-hearthstone/50 text-lg max-w-md mx-auto mb-8 leading-relaxed">
              We&apos;re finishing production on our first lineup. Leave your email and we&apos;ll notify you the moment products drop.
            </p>
            <Link href="/contact"
              className="inline-block px-8 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold transition-colors shadow-lg shadow-brand-orange/20">
              Get Notified
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link href={`/products/${p.slug}`}
      className="group block rounded-2xl border border-white/8 bg-white/3 hover:border-brand-orange/30 hover:bg-white/5 transition-all overflow-hidden">
      <div className="aspect-square bg-white/5 overflow-hidden">
        {p.image_url
          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center"><span className="text-hearthstone/10 text-6xl">⚙</span></div>
        }
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-hearthstone group-hover:text-brand-orange transition-colors">{p.name}</h3>
        {p.short_description && <p className="text-hearthstone/50 text-sm mt-1.5 line-clamp-2">{p.short_description}</p>}
        <p className="text-amber font-semibold mt-3 text-sm">
          {p.price_label || (p.price ? `$${p.price}` : 'Contact for pricing')}
        </p>
      </div>
    </Link>
  )
}

