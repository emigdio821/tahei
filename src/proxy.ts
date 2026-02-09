import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { authServer } from './lib/auth/server'

export async function proxy(request: NextRequest) {
  const session = await authServer.api.getSession({
    headers: await headers(),
  })

  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (request.nextUrl.pathname !== '/login' && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images/*.*|sitemap.xml|robots.txt).*)'],
}
