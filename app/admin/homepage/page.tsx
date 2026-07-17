import { createClient } from '@/lib/supabase/server'
import HomepageEditor from './HomepageEditor'

export const metadata = { title: 'Homepage | Raid Ready Labs Admin' }

export default async function HomepagePage() {
  const supabase = await createClient()
  const { data: sections } = await supabase
    .from('homepage_sections')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Homepage</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Edit each section of your homepage.</p>
      </div>
      <HomepageEditor sections={sections || []} />
    </div>
  )
}
