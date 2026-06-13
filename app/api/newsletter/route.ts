import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const body = await request.json()
  const { email } = body

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  }

  const { error } = await supabase.from('newsletter_subscribers').insert({
    email: email.trim().toLowerCase(),
  })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ success: true, alreadySubscribed: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
