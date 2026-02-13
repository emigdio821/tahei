'use client'

import { IconExternalLink, IconFolder, IconTag } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BlurImage } from '@/components/shared/blur-img'
import { CopyButton } from '@/components/shared/copy-btn'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { formatDate, simplifiedURL } from '@/lib/utils'

interface BookmarkDetailsDialogProps {
  bookmark: Bookmark
  state: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
  }
}

export function BookmarkDetailsDialog({ bookmark, state }: BookmarkDetailsDialogProps) {
  const { isOpen, onOpenChange } = state
  const pathname = usePathname()

  const folderHref: `/folders/${string}` | null = bookmark.folder ? `/folders/${bookmark.folder.id}` : null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="line-clamp-2 break-all">{bookmark.name}</DialogTitle>
          <DialogDescription>{bookmark.description || 'Bookmark details'}</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <div className="space-y-4">
            <div className="space-y-2">
              {bookmark.folder && folderHref && (
                <div className="flex items-center gap-2">
                  <IconFolder className="size-4 text-muted-foreground" />
                  {folderHref === pathname ? (
                    <Badge variant="outline">{bookmark.folder.name}</Badge>
                  ) : (
                    <Badge variant="outline" render={<Link href={folderHref}>{bookmark.folder.name}</Link>} />
                  )}
                </div>
              )}

              {bookmark.bookmarkTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <IconTag className="size-4 text-muted-foreground" />
                  {bookmark.bookmarkTags.map((bt) => {
                    const tagHref: `/tags/${string}` = `/tags/${bt.tag.id}`
                    const isCurrentTag = tagHref === pathname

                    return isCurrentTag ? (
                      <Badge key={bt.tag.id} variant="outline">
                        {bt.tag.name}
                      </Badge>
                    ) : (
                      <Badge
                        key={bt.tag.id}
                        variant="outline"
                        render={<Link href={tagHref}>{bt.tag.name}</Link>}
                      />
                    )
                  })}
                </div>
              )}
            </div>

            {bookmark.image && (
              <div className="relative mt-4 h-48 w-full overflow-hidden rounded-md bg-muted md:h-64">
                <BlurImage src={bookmark.image} alt={bookmark.name} fill className="object-cover" />
              </div>
            )}
          </div>
        </DialogPanel>

        <DialogFooter variant="bare" className="block border-t">
          {/* Metadata */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">URL</span>
              <div className="flex items-center gap-1.5">
                <span>{simplifiedURL(bookmark.url)}</span>
                <CopyButton size="icon-xs" variant="plain" value={bookmark.url} tooltipText="Copy full URL" />
              </div>
            </div>

            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Created</span>
              <span className="text-foreground">
                {formatDate(bookmark.createdAt, { timeStyle: 'short' })}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Last updated</span>
              <span className="text-foreground">{formatDate(bookmark.updatedAt)}</span>
            </div>
          </div>
        </DialogFooter>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Close</Button>} />
          <Button onClick={() => window.open(bookmark.url, '_blank')}>
            <IconExternalLink className="size-4" />
            Open
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
