import { createFileRoute } from '@tanstack/react-router'
import { BookmarksDataTable } from '@/components/bookmarks/table/data-table'
import { createSEOTitle } from '@/lib/seo'

export const Route = createFileRoute('/_authed/')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: createSEOTitle('Bookmarks') }],
  }),
})

function RouteComponent() {
  return <BookmarksDataTable />
}
