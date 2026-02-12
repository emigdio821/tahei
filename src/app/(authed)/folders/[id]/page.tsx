import { IconGhost3 } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { cache } from 'react'
import { FolderBookmarksDataTable } from '@/components/bookmarks/table/folders/data-table'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getFolderById } from '@/server-actions/folders'

interface FolderPageProps {
  params: Promise<{ id: string }>
}

const getFolderDetails = cache(async (id: string) => {
  return await getFolderById(id)
})

export async function generateMetadata(props: FolderPageProps): Promise<Metadata> {
  const params = await props.params
  const folder = await getFolderDetails(params.id)

  if (!folder) {
    return {
      title: 'Folder not found',
    }
  }

  return {
    title: folder.name,
    description: folder.description || `View and manage bookmarks in ${folder.name}`,
  }
}

export default async function FolderPage(props: FolderPageProps) {
  const params = await props.params
  const folder = await getFolderDetails(params.id)

  if (!folder) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconGhost3 />
          </EmptyMedia>
          <EmptyTitle>Folder not found</EmptyTitle>
          <EmptyDescription>
            We couldn't find the folder you're looking for. It may have been deleted or the URL may be
            incorrect.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="font-heading font-semibold text-xl leading-none">{folder.name}</h1>
        <p className="text-muted-foreground text-sm">
          {folder.description || 'View and manage bookmarks in this folder.'}
        </p>
      </div>

      <FolderBookmarksDataTable folderId={params.id} />
    </div>
  )
}
