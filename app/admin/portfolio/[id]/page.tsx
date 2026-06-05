import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PortfolioForm from '../PortfolioForm'

export const metadata = { title: 'Edit Portfolio Item | Hearthforge Admin' }

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: item } = await supabase.from('portfolio_items').select('*').eq('id', id).single()

  if (!item) notFound()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Edit Portfolio Item</h1>
        <p className="text-hearthstone/50 text-sm mt-1">{item.title}</p>
      </div>
      <PortfolioForm item={item} />
    </div>
  )
}
