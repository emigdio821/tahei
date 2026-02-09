import type { Metadata } from 'next'
import { appName } from '@/lib/config/site'

export const metadata: Metadata = {
  title: `Bookmarks · ${appName}`,
}

export default function BookmarksPage() {
  return (
    <div>
      <h1 className="font-heading font-medium text-lg leading-none">Bookmarks</h1>
    </div>
  )
}
