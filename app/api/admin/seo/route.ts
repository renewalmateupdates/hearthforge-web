import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'editor'].includes(profile.role)) return null
  return user
}

const DEFAULT_PAGES = ['/', '/products', '/portfolio', '/about', '/contact', '/blog', '/faq']

export async function GET() {
  const supabase = await createClient()
  const user = await requireAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .order('page_path')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Ensure all default pages exist in response
  const map = new Map((data || []).map(r => [r.page_path, r]))
  const result = DEFAULT_PAGES.map(path => map.get(path) || { page_path: path, id: null })

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const user = await requireAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id: _id, ...upsertData } = body

  const { data, error } = await supabase
    .from('seo_settings')
    .upsert({ ...upsertData, updated_at: new Date().toISOString() }, { onConflict: 'page_path' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const user = await requireAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, ...updates } = body

  const { data, error } = await supabase
    .from('seo_settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
