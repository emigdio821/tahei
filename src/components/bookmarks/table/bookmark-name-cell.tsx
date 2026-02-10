import { useState } from 'react'
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

      <Button
        variant="plain"
        className="line-clamp-2 whitespace-normal text-left"
        onClick={() => setIsSheetOpen(true)}
      >
        {bookmark.name}
      </Button>
    </>
  )
}
