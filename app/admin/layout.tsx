import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import type { Profile } from '@/types'

// Site owner emails always get admin access regardless of profile table state
const OWNER_EMAILS = ['hearthforge.hq@gmail.com', 'butchjchiappinelli@gmail.com']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Verify session JWT from cookies
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/admin')

  const userEmail = (user.email || '').toLowerCase()
  const isOwner = OWNER_EMAILS.includes(userEmail)

  // Try to fetch profile with service role (bypasses RLS)
  let profile: Profile | null = null
  try {
    const adminDb = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data } = await adminDb
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  } catch {}

  const isProfileAdmin = profile && ['admin', 'editor'].includes(profile.role)

  // Grant access if profile has the right role OR if this is a site owner email
  if (!isProfileAdmin && !isOwner) {
    redirect('/unauthorized')
  }

  // If profile fetch failed, build a minimal profile for the UI
  const effectiveProfile: Profile = profile ?? {
    id: user.id,
    email: user.email ?? '',
    full_name: userEmail.split('@')[0],
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-forge-night flex">
      <AdminSidebar profile={effectiveProfile} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader profile={effectiveProfile} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
