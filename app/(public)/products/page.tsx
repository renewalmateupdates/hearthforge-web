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

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-hearthstone mb-4">Products</h1>
        <p className="text-hearthstone/50 text-lg">Precision-crafted accessories for your setup.</p>
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center py-20">
          <p className="text-hearthstone/40">No products listed yet. Check back soon.</p>
        </div>
      )}

      {categories.length > 0 ? (
        <div className="space-y-14">
          {categories.map(cat => {
            const catProducts = (products || []).filter(p => p.category === cat)
            return (
              <section key={cat}>
                <h2 className="text-lg font-semibold text-hearthstone/50 mb-6 uppercase tracking-wider text-sm">{cat}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catProducts.map((p: Product) => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            )
          })}
          {(products || []).filter(p => !p.category).length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-hearthstone/50 mb-6 uppercase tracking-wider text-sm">Other</h2>
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
      )}
    </div>
  )
}

function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link href={`/products/${p.slug}`}
      className="group block rounded-2xl border border-white/8 bg-white/3 hover:border-brand-orange/30 hover:bg-white/5 transition-all overflow-hidden">
      <div className="aspect-square bg-white/5 overflow-hidden">
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-hearthstone/10 text-5xl">⚙</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-hearthstone group-hover:text-brand-orange transition-colors">{p.name}</h3>
        {p.short_description && (
          <p className="text-hearthstone/50 text-sm mt-1.5 line-clamp-2">{p.short_description}</p>
        )}
        <p className="text-amber font-semibold mt-3 text-sm">
          {p.price_label || (p.price ? `$${p.price}` : 'Contact for pricing')}
        </p>
      </div>
    </Link>
  )
}
