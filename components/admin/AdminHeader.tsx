'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ExternalLink, LogOut } from 'lucide-react'
import type { Profile } from '@/types'

export default function AdminHeader({ profile }: { profile: Profile }) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-14 border-b border-white/8 px-8 flex items-center justify-between bg-forge-night/80 backdrop-blur-sm sticky top-0 z-10">
      <div />
      <div className="flex items-center gap-5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-hearthstone/50 hover:text-hearthstone transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Site
        </a>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-sm text-hearthstone/50 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </header>
  )
}
