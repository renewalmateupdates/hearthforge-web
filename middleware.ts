import { NextResponse, type NextRequest } from 'next/server'

// Auth is handled by app/admin/layout.tsx (server component)
// Middleware is kept minimal to avoid Edge Runtime compatibility issues with @supabase/ssr
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
