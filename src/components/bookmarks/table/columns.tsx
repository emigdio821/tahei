import type { ColumnDef } from '@tanstack/react-table'
import { DataTableSortableHeader } from '@/components/shared/table/sortable-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { simplifiedURL } from '@/lib/utils'
import { BookmarksTableActions } from './actions'
import { BookmarkNameCell } from './bookmark-name-cell'

export const bookmarksTableColumns: ColumnDef<Bookmark>[] = [
  {
    id: 'select',
    enablePinning: false,
    enableResizing: false,
    enableSorting: false,
    size: 28,
    header: ({ table }) => (
      <Checkbox
        aria-label="Seleccionar todo"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        disabled={table.getFilteredRowModel().rows.length === 0}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Seleccionar elemento"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: 'name',
    size: 180,
    cell: ({ row }) => <BookmarkNameCell bookmark={row.original} />,
    header: ({ column }) => <DataTableSortableHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableSortableHeader column={column} title="Description" />,
    size: 180,
    cell: ({ row }) =>
      row.original.description ? (
        <p className="line-clamp-2 whitespace-normal leading-normal">{row.original.description}</p>
      ) : null,
  },
  {
    accessorKey: 'url',
    header: ({ column }) => <DataTableSortableHeader column={column} title="URL" />,
    size: 160,
    cell: ({ row }) => (
      <Button
        className="line-clamp-1 min-w-0 text-left"
        nativeButton={false}
        variant="link"
        render={
          <a href={row.original.url} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate">
            {simplifiedURL(row.original.url)}
          </a>
        }
      />
    ),
  },
  {
    accessorKey: 'folder',
    header: ({ column }) => <DataTableSortableHeader column={column} title="Folder" />,
    size: 100,
    cell: ({ row }) => {
      const folder = row.original.folder

      if (!folder) return null

      return <Badge variant="outline">{folder.name}</Badge>
    },
  },
  {
    accessorKey: 'bookmarkTags',
    header: ({ column }) => <DataTableSortableHeader column={column} title="Tags" />,
    size: 160,
    cell: ({ row }) => {
      const tags = row.original.bookmarkTags

      if (tags.length === 0) return null

      const sortedTags = [...tags].sort((a, b) => a.tag.name.localeCompare(b.tag.name))

      return (
        <div className="flex flex-wrap gap-1">
          {sortedTags.map(({ tag }) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    size: 55,
    enablePinning: false,
    enableResizing: false,
    enableSorting: false,
    cell: ({ row }) => <BookmarksTableActions bookmark={row.original} />,
  },
]
