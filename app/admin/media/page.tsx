import { createClient } from '@/lib/supabase/server'
import MediaLibrary from './MediaLibrary'

export const metadata = { title: 'Media Library | Raid Ready Labs Admin' }

export default async function MediaPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('media_items')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Media Library</h1>
        <p className="text-hearthstone/50 text-sm mt-1">{items?.length || 0} files</p>
      </div>
      <MediaLibrary items={items || []} />
    </div>
  )
}
