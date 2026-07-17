import { createClient } from '@/lib/supabase/server'
import FAQManager from './FAQManager'

export const metadata = { title: 'FAQ | Raid Ready Labs Admin' }

export default async function FAQPage() {
  const supabase = await createClient()
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">FAQ</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Manage frequently asked questions.</p>
      </div>
      <FAQManager faqs={faqs || []} />
    </div>
  )
}
