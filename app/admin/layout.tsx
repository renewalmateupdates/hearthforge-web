import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Use anon client to verify the session/JWT (cookie-based)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/admin')

  // Use service client to read the profile — bypasses RLS entirely so no
  // policy misconfiguration can ever block a legitimate admin from logging in
  const serviceClient = await createServiceClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    redirect('/unauthorized')
  }

  return (
    <div className="min-h-screen bg-forge-night flex">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader profile={profile} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
