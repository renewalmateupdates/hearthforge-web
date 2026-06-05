import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import UsersManager from './UsersManager'

export const metadata = { title: 'Users | Hearthforge Admin' }

const OWNER_EMAILS = ['hearthforge.hq@gmail.com', 'butchjchiappinelli@gmail.com']

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Use admin client to bypass RLS for role check and user list
  const adminDb = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await adminDb.from('profiles').select('role').eq('id', user.id).single()
  const isOwner = OWNER_EMAILS.includes((user.email || '').toLowerCase())

  if (profile?.role !== 'admin' && !isOwner) redirect('/unauthorized')

  const { data: users } = await adminDb.from('profiles').select('*').order('created_at', { ascending: false })

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
