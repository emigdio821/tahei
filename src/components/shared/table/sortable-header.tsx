import { IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsSort } from '@tabler/icons-react'
import type { Column } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  MenuCheckboxItem,
} from '@/components/ui/menu'
import { cn } from '@/lib/utils'

interface DataTableSortableHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableSortableHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableSortableHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const isAscSorted = column.getIsSorted() === 'asc'
  const isDescSorted = column.getIsSorted() === 'desc'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="sm" className="gap-1">
              {isAscSorted && <IconArrowNarrowDown className="size-4" />}
              {isDescSorted && <IconArrowNarrowUp className="size-4" />}
              {!column.getIsSorted() && <IconArrowsSort className="size-4" />}
              <span className="text-sm">{title}</span>
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="max-w-42">
          <DropdownMenuGroup>
            <MenuCheckboxItem
              onClick={() => {
                if (isAscSorted) {
                  column.clearSorting()
                } else {
                  column.toggleSorting(false)
                }
              }}
            >
              Ascendant
            </MenuCheckboxItem>
            <MenuCheckboxItem
              onClick={() => {
                if (isDescSorted) {
                  column.clearSorting()
                } else {
                  column.toggleSorting(true)
                }
              }}
            >
              Descendant
            </MenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
