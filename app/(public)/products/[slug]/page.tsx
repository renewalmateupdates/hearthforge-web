import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: p } = await supabase.from('products').select('name, seo_title, seo_description').eq('slug', slug).single()
  return {
    title: p?.seo_title || p?.name || 'Product',
    description: p?.seo_description || undefined,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).eq('is_available', true).single()

  if (!product) notFound()

  const features = Array.isArray(product.features) ? product.features as { label: string; value: string }[] : []

  return (
    <div className="max-w-6xl mx-auto px-5 pt-28 pb-16 md:pt-36">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-hearthstone/40 mb-10">
        <Link href="/" className="hover:text-hearthstone transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-hearthstone transition-colors">Products</Link>
        <span>/</span>
        <span className="text-hearthstone/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden border border-white/8 bg-white/3">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-hearthstone/10 text-6xl">⚙</div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-start">
          {product.category && (
            <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-3">{product.category}</span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-hearthstone mb-4 text-balance">{product.name}</h1>

          <p className="text-2xl font-bold text-amber mb-5">
            {product.price_label || (product.price ? `$${product.price}` : 'Contact for pricing')}
          </p>

          {product.short_description && (
            <p className="text-hearthstone/60 text-lg leading-relaxed mb-6">{product.short_description}</p>
          )}

          {product.description && product.description !== product.short_description && (
            <p className="text-hearthstone/50 text-sm leading-relaxed mb-8">{product.description}</p>
          )}

          {features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-hearthstone/30 uppercase tracking-wider mb-3">Specifications</h3>
              <div className="space-y-2">
                {features.map((f, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-white/5 text-sm">
                    <span className="text-hearthstone/40">{f.label}</span>
                    <span className="text-hearthstone font-medium">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link href="/contact"
            className="inline-block px-8 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold text-base transition-colors shadow-lg shadow-brand-orange/20 text-center">
            Inquire / Order
          </Link>
        </div>
      </div>
    </div>
  )
}
