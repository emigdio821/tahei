import type { Metadata } from 'next'
import { appName } from '@/lib/config/site'

export const metadata: Metadata = {
  title: `Bookmarks · ${appName}`,
}

export default function BookmarksPage() {
  return 'Authed'
}
