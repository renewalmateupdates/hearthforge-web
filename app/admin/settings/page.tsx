import { createClient } from '@/lib/supabase/server'
import SettingsForm from './SettingsForm'

export const metadata = { title: 'Site Settings | Raid Ready Labs Admin' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').order('key')

  const settingsMap: Record<string, string> = {}
  for (const s of settings || []) {
    settingsMap[s.key] = s.value || ''
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Site Settings</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Business info, contact details, and social links.</p>
      </div>
      <SettingsForm settings={settingsMap} />
    </div>
  )
}
