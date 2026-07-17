import { createClient } from '@/lib/supabase/server'
import ContactManager from './ContactManager'

export const metadata = { title: 'Contact Submissions | Raid Ready Labs Admin' }

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: submissions } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hearthstone">Contact Submissions</h1>
          <p className="text-hearthstone/50 text-sm mt-1">
            {submissions?.filter(s => !s.is_read).length || 0} unread
          </p>
        </div>
      </div>
      <ContactManager submissions={submissions || []} />
    </div>
  )
}
