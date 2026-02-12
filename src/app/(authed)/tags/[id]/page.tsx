import { TagBookmarksDataTable } from '@/components/bookmarks/table/tags/data-table'

interface TagPageProps {
  params: Promise<{ id: string }>
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="font-heading font-semibold text-xl leading-none">Tag: {params.id}</h1>
        <p className="text-muted-foreground text-sm">View and manage bookmarks with this tag.</p>
      </div>

      <TagBookmarksDataTable tagId={params.id} />
    </div>
  )
}
