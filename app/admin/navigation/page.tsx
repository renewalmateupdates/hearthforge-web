import { createClient } from '@/lib/supabase/server'
import NavigationEditor from './NavigationEditor'

export const metadata = { title: 'Navigation | Raid Ready Labs Admin' }

export default async function NavigationPage() {
  const supabase = await createClient()
  const { data: menus } = await supabase.from('navigation_menus').select('*').order('name')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Navigation</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Edit your main nav and footer links.</p>
      </div>
      <NavigationEditor menus={menus || []} />
    </div>
  )
}
