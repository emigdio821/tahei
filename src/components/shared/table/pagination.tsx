import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps<T> {
  table: Table<T>
  pageSizeOptions?: readonly number[]
}

export const DEFAULT_TABLE_PAGE_SIZE = 10

export function DataTablePagination<T>({ table }: DataTablePaginationProps<T>) {
  return (
    <>
      <div className="flex w-full items-center gap-2">
        <p className="text-muted-foreground text-sm">Mostrando</p>
        <Select
          items={Array.from({ length: table.getPageCount() }, (_, i) => {
            const start = i * table.getState().pagination.pageSize + 1
            const end = Math.min((i + 1) * table.getState().pagination.pageSize, table.getRowCount())
            const pageNum = i + 1
            return { label: `${start}-${end}`, value: pageNum }
          })}
          onValueChange={(value) => {
            table.setPageIndex((value as number) - 1)
          }}
          value={table.getState().pagination.pageIndex + 1}
        >
          <SelectTrigger aria-label="Select result range" className="w-fit min-w-none" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.from({ length: table.getPageCount() }, (_, i) => {
                const start = i * table.getState().pagination.pageSize + 1
                const end = Math.min((i + 1) * table.getState().pagination.pageSize, table.getRowCount())
                const pageNum = i + 1
                return (
                  <SelectItem key={pageNum} value={pageNum}>
                    {`${start}-${end}`}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm">
          de <strong className="font-medium text-foreground">{table.getRowCount()}</strong> resultados
        </p>
      </div>

      <div className="flex w-full items-center justify-end gap-1">
        <Button
          size="icon-sm"
          variant="outline"
          onClick={() => table.previousPage()}
          aria-label="Ir a la página anterior"
          disabled={!table.getCanPreviousPage()}
        >
          <IconChevronLeft className="size-4" />
        </Button>

        <Button
          size="icon-sm"
          variant="outline"
          onClick={() => table.nextPage()}
          aria-label="Ir a la página siguiente"
          disabled={!table.getCanNextPage()}
        >
          <IconChevronRight className="size-4" />
        </Button>
      </div>
    </>
  )
}
