import { IconWorld } from '@tabler/icons-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
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

      <Button variant="plain" className="text-left" onClick={() => setIsSheetOpen(true)}>
        <Avatar className="size-4">
          <AvatarImage src={bookmark.favicon || ''} alt={bookmark.name} />
          <AvatarFallback>
            <IconWorld className="size-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <span className="line-clamp-2 whitespace-normal">{bookmark.name}</span>
      </Button>
    </>
  )
}
