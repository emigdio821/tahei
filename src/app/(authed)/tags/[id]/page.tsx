import { IconGhost3 } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { cache } from 'react'
import { TagBookmarksDataTable } from '@/components/bookmarks/table/tags/data-table'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getTagById } from '@/server-actions/tags'

interface TagPageProps {
  params: Promise<{ id: string }>
}

const getTagDetails = cache(async (id: string) => {
  return await getTagById(id)
})

export async function generateMetadata(props: TagPageProps): Promise<Metadata> {
  const params = await props.params
  const tag = await getTagDetails(params.id)

  if (!tag) {
    return {
      title: 'Tag not found',
    }
  }

  return {
    title: tag.name,
    description: `View and manage bookmarks with the ${tag.name} tag`,
  }
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params
  const tag = await getTagDetails(params.id)

  if (!tag) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconGhost3 />
          </EmptyMedia>
          <EmptyTitle>Tag not found</EmptyTitle>
          <EmptyDescription>
            We couldn't find the tag you're looking for. It may have been deleted or the URL may be incorrect.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="font-heading font-semibold text-xl leading-none">{tag.name}</h1>
        <p className="text-muted-foreground text-sm">View and manage bookmarks with this tag.</p>
      </div>

      <TagBookmarksDataTable tagId={params.id} />
    </div>
  )
}
