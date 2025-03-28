import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get('auth')
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPath = req.nextUrl.pathname === '/login'

  // If not authenticated and trying to access admin
  if (!isAuthenticated && isAdminPath) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated and trying to access login
  if (isAuthenticated && isLoginPath) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/admin'
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
} 