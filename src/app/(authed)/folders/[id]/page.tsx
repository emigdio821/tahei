import { FolderBookmarksDataTable } from '@/components/bookmarks/table/folders/data-table'

interface FolderPageProps {
  params: Promise<{ id: string }>
}

export default async function FolderPage(props: FolderPageProps) {
  const params = await props.params

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="font-heading font-semibold text-xl leading-none">Folder: {params.id}</h1>
        <p className="text-muted-foreground text-sm">View and manage bookmarks in this folder.</p>
      </div>

      <FolderBookmarksDataTable folderId={params.id} />
    </div>
  )
}
