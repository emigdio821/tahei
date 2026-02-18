import { IconWorld } from '@tabler/icons-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { cn, hasWhiteSpaces } from '@/lib/utils'
import { BookmarkDetailsDialog } from '../dialogs/details'

interface BookmarkNameCellProps {
  bookmark: Bookmark
}

export function BookmarkNameCell({ bookmark }: BookmarkNameCellProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <>
      <BookmarkDetailsDialog
        bookmark={bookmark}
        state={{ isOpen: isSheetOpen, onOpenChange: setIsSheetOpen }}
      />

      <Button variant="plain" className="min-w-0 max-w-full text-left" onClick={() => setIsSheetOpen(true)}>
        {bookmark.favicon ? (
          <Avatar className="size-4 shrink-0">
            <AvatarImage src={bookmark.favicon} alt={bookmark.name} />
            <AvatarFallback>
              <IconWorld className="size-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <IconWorld className="size-4 text-muted-foreground" />
        )}

        <p
          className={cn(
            'min-w-0 overflow-hidden leading-normal',
            hasWhiteSpaces(bookmark.name) ? 'line-clamp-2 whitespace-normal' : 'truncate',
          )}
        >
          {bookmark.name}
        </p>
      </Button>
    </>
  )
}
