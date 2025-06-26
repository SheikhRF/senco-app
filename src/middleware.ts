import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  let session = null

  try {
    const {
      data: { session: fetchedSession },
    } = await supabase.auth.getSession()
    session = fetchedSession
  } catch (err) {
    console.error('⚠️ Error fetching Supabase session:', err)
    // Proceed as if not authenticated
  }

  const protectedPaths = ['/', '/dashboard']
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(`${path}/`)
  )

  if (isProtected && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/pupils', '/pupils/:path*', '/dashboard', '/dashboard/:path*'],
}
