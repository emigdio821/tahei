import type { Metadata } from 'next'
import { BookmarksDataTable } from '@/components/bookmarks/table/data-table'
import { appName } from '@/lib/config/site'

export const metadata: Metadata = {
  title: {
    template: `%s · ${appName}`,
    default: 'Bookmarks',
  },
}

export default function BookmarksPage() {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="font-heading font-semibold text-xl leading-none">Bookmarks</h1>
        <p className="text-muted-foreground text-sm">View and manage your bookmarks.</p>
      </div>

      <BookmarksDataTable />
    </div>
  )
}
