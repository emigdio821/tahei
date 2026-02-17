import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { authServer } from './lib/auth/server'

export async function proxy(request: NextRequest) {
  const session = await authServer.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!login|api|_next/static|_next/image|favicon.ico|images).*)'],
}
