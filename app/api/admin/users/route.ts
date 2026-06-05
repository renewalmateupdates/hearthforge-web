import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function requireSuperAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return null
  return user
}

export async function GET() {
  const supabase = await createClient()
  const user = await requireSuperAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const user = await requireSuperAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, role } = body

  if (!['admin', 'editor', 'viewer'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const user = await requireSuperAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { email, password, full_name, role } = body

  try {
    const serviceClient = await createServiceClient()
    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name },
      email_confirm: true,
    })

    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })

    // Use service client + upsert so it works whether or not the trigger fired
    await serviceClient.from('profiles').upsert({
      id: authData.user.id,
      email,
      full_name: full_name || email.split('@')[0],
      role: role || 'editor',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, userId: authData.user.id }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
