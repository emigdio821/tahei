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
  return <BookmarksDataTable />
}
