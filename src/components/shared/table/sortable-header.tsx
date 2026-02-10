import { IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsSort, IconFilter2X } from '@tabler/icons-react'
import type { Column } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
            <DropdownMenuItem disabled={isAscSorted} onClick={() => column.toggleSorting(false)}>
              <IconArrowNarrowDown className="size-4" />
              Ascendant
            </DropdownMenuItem>

            <DropdownMenuItem disabled={isDescSorted} onClick={() => column.toggleSorting(true)}>
              <IconArrowNarrowUp className="size-4" />
              Descendant
            </DropdownMenuItem>

            {column.getIsSorted() && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                  <IconFilter2X className="size-4" />
                  Reset
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
