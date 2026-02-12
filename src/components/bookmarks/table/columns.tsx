'use client'

import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DataTableSortableHeader } from '@/components/shared/table/sortable-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { normalizeString, simplifiedURL } from '@/lib/utils'
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
    size: 160,
    cell: ({ row }) => <BookmarkNameCell bookmark={row.original} />,
    header: ({ column }) => <DataTableSortableHeader column={column} title="Name" />,
    filterFn: (row, _, value: string) => {
      const normalizedName = normalizeString(row.original.name).toLowerCase()
      const normalizedValue = normalizeString(value).toLowerCase()

      return normalizedName.includes(normalizedValue)
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableSortableHeader column={column} title="Description" />,
    size: 200,
    cell: ({ row }) =>
      row.original.description ? (
        <p className="line-clamp-2 whitespace-normal">{row.original.description}</p>
      ) : null,
  },
  {
    accessorKey: 'url',
    header: ({ column }) => <DataTableSortableHeader column={column} title="URL" />,
    size: 160,
    cell: ({ row }) => (
      <Button
        nativeButton={false}
        variant="link"
        render={<a href={row.original.url}>{simplifiedURL(row.original.url)}</a>}
      />
    ),
  },
  {
    accessorKey: 'folder',
    header: ({ column }) => <DataTableSortableHeader column={column} title="Folder" />,
    size: 100,
    cell: ({ row }) => {
      const folder = row.original.folder
      const pathname = usePathname()

      if (!folder) return null

      const folderHref: `/folders/${string}` = `/folders/${folder.id}`

      if (folderHref === pathname) {
        return <Badge variant="outline">{folder.name}</Badge>
      }

      return <Badge variant="outline" render={<Link href={folderHref}>{folder.name}</Link>} />
    },
  },
  {
    accessorKey: 'bookmarkTags',
    header: ({ column }) => <DataTableSortableHeader column={column} title="Tags" />,
    size: 160,
    cell: ({ row }) => {
      const tags = row.original.bookmarkTags
      const pathname = usePathname()

      if (tags.length === 0) return null

      return (
        <div className="flex flex-wrap gap-1">
          {tags.map(({ tag }) => {
            const tagHref: `/tags/${string}` = `/tags/${tag.id}`

            if (tagHref === pathname) {
              return (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              )
            }

            return (
              <Badge
                key={tag.id}
                variant="outline"
                render={<Link href={`/tags/${tag.id}`}>{tag.name}</Link>}
              />
            )
          })}
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
