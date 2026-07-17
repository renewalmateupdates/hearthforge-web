import { createClient } from '@/lib/supabase/server'
import TestimonialsManager from './TestimonialsManager'

export const metadata = { title: 'Testimonials | Raid Ready Labs Admin' }

export default async function TestimonialsPage() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Testimonials</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Manage customer reviews.</p>
      </div>
      <TestimonialsManager testimonials={testimonials || []} />
    </div>
  )
}
