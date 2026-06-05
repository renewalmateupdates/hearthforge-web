import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UsersManager from './UsersManager'

export const metadata = { title: 'Users | Hearthforge Admin' }

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/unauthorized')

  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Users</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Manage admin access. Admin-only.</p>
      </div>
      <UsersManager users={users || []} currentUserId={user.id} />
    </div>
  )
}
