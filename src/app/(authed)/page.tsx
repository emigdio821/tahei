import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BookmarksDataTable } from '@/components/bookmarks/table/data-table'
import { TableGenericSkeleton } from '@/components/shared/skeletons/table-generic'
import { appName } from '@/lib/config/site'

export const metadata: Metadata = {
  title: {
    template: `%s · ${appName}`,
    default: 'Bookmarks',
  },
}

export default function BookmarksPage() {
  return (
    <Suspense fallback={<TableGenericSkeleton withHeader={false} />}>
      <BookmarksDataTable />
    </Suspense>
  )
}
