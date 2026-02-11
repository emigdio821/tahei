'use client'

import { IconPlus } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { foldersQueryOptions } from '@/tanstack-queries/folders'
import { CreateFolderDialog } from '../folders/dialogs/create'
import { FolderTree } from '../folders/folder-tree'
import { TextGenericSkeleton } from '../shared/skeletons/text-generic'
import { Button } from '../ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '../ui/empty'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '../ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function NavFolders({ ...props }: React.ComponentProps<typeof SidebarGroup>) {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false)

  const { data: folders = [], isLoading, error, refetch } = useQuery(foldersQueryOptions())

  function renderFolders() {
    if (error) {
      return (
        <Empty className="gap-2 rounded-xl bg-muted/50 p-2 md:p-2">
          <EmptyHeader>
            <EmptyTitle className="text-sm">Error</EmptyTitle>
            <EmptyDescription className="text-xs">
              Something went wrong while fetching your folders.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" className="w-full" size="xs" onClick={() => refetch()}>
              Retry
            </Button>
          </EmptyContent>
        </Empty>
      )
    }

    if (isLoading) {
      return (
        <div className="p-2">
          <TextGenericSkeleton />
        </div>
      )
    }

    if (folders.length === 0) {
      return (
        <Empty className="gap-2 rounded-xl bg-muted/50 p-2 md:p-2">
          <EmptyHeader>
            <EmptyTitle className="text-sm">Empty</EmptyTitle>
            <EmptyDescription className="text-xs">There are no folders yet.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" className="w-full" size="xs" onClick={() => refetch()}>
              Create
            </Button>
          </EmptyContent>
        </Empty>
      )
    }

    return (
      <>
        {folders.map((folder) => (
          <FolderTree key={folder.id} folder={folder} />
        ))}
      </>
    )
  }

  return (
    <>
      <CreateFolderDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />

      <SidebarGroup {...props}>
        <SidebarGroupLabel>
          Folders
          <Tooltip>
            <TooltipTrigger
              render={
                <SidebarGroupAction onClick={() => setCreateDialogOpen(true)} aria-label="Create folder">
                  <IconPlus />
                </SidebarGroupAction>
              }
            />
            <TooltipContent>Create folder</TooltipContent>
          </Tooltip>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>{renderFolders()}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
