'use server'

import { headers } from 'next/headers'
import { authServer } from '@/lib/auth/server'

export async function getSession() {
  const session = await authServer.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return null
  }

  return session
}
