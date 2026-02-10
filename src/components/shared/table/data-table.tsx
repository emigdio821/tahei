import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type Table as TableType,
  useReactTable,
} from '@tanstack/react-table'
import { parseAsIndex, parseAsInteger, useQueryStates } from 'nuqs'
import { useEffect, useState } from 'react'
import { Frame } from '@/components/ui/frame'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DEFAULT_TABLE_PAGE_SIZE } from './pagination'

interface DataTableProps<TData, TValue> {
  data: TData[]
  tableId?: string
  columns: ColumnDef<TData, TValue>[]
  header?: (table: TableType<TData>) => React.ReactNode
  caption?: React.ReactNode
  pageSize?: number
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const { data, tableId, header, caption, columns, pageSize: tablePageSize = DEFAULT_TABLE_PAGE_SIZE } = props
  const paginationUrlKeys = {
    pageIndex: tableId ? `${tableId}-page` : 'page',
    pageSize: tableId ? `${tableId}-perPage` : 'perPage',
  }

  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const paginationParsers = {
    pageIndex: parseAsIndex.withDefault(0),
    pageSize: parseAsInteger.withDefault(tablePageSize),
  }

  const [{ pageIndex, pageSize }, setPagination] = useQueryStates(paginationParsers, {
    urlKeys: paginationUrlKeys,
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater
      setPagination(newPagination)
    },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,

    state: {
      sorting,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    initialState: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  })

  const rowLength = table.getFilteredRowModel().rows.length

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(data.length / pageSize) - 1)
    if (pageIndex > maxPage) {
      setPagination({ pageIndex: maxPage, pageSize })
    }
  }, [data.length, pageIndex, pageSize, setPagination])

  return (
    <div className="space-y-2">
      {header && <div>{header(table)}</div>}

      <Frame className="w-full">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Frame>

      {rowLength > DEFAULT_TABLE_PAGE_SIZE && (
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  )
}
