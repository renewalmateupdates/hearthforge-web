import { createClient } from '@/lib/supabase/server'
import AboutEditor from './AboutEditor'

export const metadata = { title: 'About Page | Hearthforge Admin' }

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: sections } = await supabase.from('about_sections').select('*').order('section_key')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">About Page</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Edit your story, mission, and team sections.</p>
      </div>
      <AboutEditor sections={sections || []} />
    </div>
  )
}
