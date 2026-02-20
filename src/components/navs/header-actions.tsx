import { IconBookmark, IconFolder, IconInfoCircle, IconSearch, IconTag } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { parseAsString, useQueryState } from 'nuqs'
import { useState } from 'react'
import { bookmarksQueryOptions } from '@/api/tanstack-queries/bookmarks'
import { CreateBookmarkDialog } from '../bookmarks/dialogs/create'
import { CreateFolderDialog } from '../folders/dialogs/create'
import { CreateTagDialog } from '../tags/dialogs/create'
import { Button } from '../ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/menu'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export function HeaderActions() {
  const [isCreateBookmarkOpen, setCreateBookmarkOpen] = useState(false)
  const [isCreateFolderOpen, setCreateFolderOpen] = useState(false)
  const [isCreateTagOpen, setCreateTagOpen] = useState(false)

  const { data: bookmarks = [] } = useQuery(bookmarksQueryOptions())
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''))

  return (
    <>
      <CreateBookmarkDialog open={isCreateBookmarkOpen} onOpenChange={setCreateBookmarkOpen} />
      <CreateFolderDialog open={isCreateFolderOpen} onOpenChange={setCreateFolderOpen} />
      <CreateTagDialog open={isCreateTagOpen} onOpenChange={setCreateTagOpen} />

      <div className="flex items-center gap-2">
        <InputGroup className="w-full bg-background sm:max-w-64">
          <InputGroupInput
            type="search"
            value={searchQuery}
            aria-label="Search"
            placeholder="Search"
            disabled={bookmarks.length === 0}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <IconSearch className="size-4" />
          </InputGroupAddon>

          <InputGroupAddon align="inline-end">
            <Popover>
              <PopoverTrigger
                openOnHover
                render={<Button aria-label="Password requirements" size="icon-xs" variant="ghost" />}
              >
                <IconInfoCircle />
              </PopoverTrigger>
              <PopoverContent side="top" tooltipStyle>
                <p>Search by name or description</p>
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button>Create</Button>} />

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setCreateBookmarkOpen(true)}>
                <IconBookmark />
                Bookmark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCreateFolderOpen(true)}>
                <IconFolder />
                Folder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCreateTagOpen(true)}>
                <IconTag />
                Tag
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
