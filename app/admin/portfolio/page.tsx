import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PortfolioGrid from './PortfolioGrid'

export const metadata = { title: 'Portfolio | Hearthforge Admin' }

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hearthstone">Portfolio</h1>
          <p className="text-hearthstone/50 text-sm mt-1">{items?.length || 0} items</p>
        </div>
        <Link href="/admin/portfolio/new" className="admin-btn-primary">+ Add Item</Link>
      </div>
      <PortfolioGrid items={items || []} />
    </div>
  )
}
