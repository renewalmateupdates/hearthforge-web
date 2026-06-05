import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: item } = await supabase.from('portfolio_items').select('title, description').eq('slug', slug).single()
  return {
    title: item?.title || 'Portfolio',
    description: item?.description || undefined,
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: item } = await supabase.from('portfolio_items').select('*').eq('slug', slug).single()

  if (!item) notFound()

  const gallery = Array.isArray(item.gallery) ? item.gallery as string[] : []

  return (
    <div className="max-w-5xl mx-auto px-5 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-hearthstone/40 mb-10">
        <Link href="/" className="hover:text-hearthstone transition-colors">Home</Link>
        <span>/</span>
        <Link href="/portfolio" className="hover:text-hearthstone transition-colors">Portfolio</Link>
        <span>/</span>
        <span className="text-hearthstone/70">{item.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Main image */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden border border-white/8 bg-white/3">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/5" />
            )}
          </div>
          {gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {gallery.map((url: string, i: number) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/8">
                  <img src={url} alt={`${item.title} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {item.category && (
            <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-3 block">{item.category}</span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-hearthstone mb-5">{item.title}</h1>
          {item.description && (
            <p className="text-hearthstone/60 leading-relaxed mb-8">{item.description}</p>
          )}
          {Array.isArray(item.tags) && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {(item.tags as string[]).map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs text-hearthstone/50">{tag}</span>
              ))}
            </div>
          )}
          <Link href="/contact"
            className="inline-block px-6 py-3 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold transition-colors">
            Inquire About This
          </Link>
        </div>
      </div>
    </div>
  )
}
