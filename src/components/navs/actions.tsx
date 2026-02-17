'use client'

import { IconBookmarkPlus, IconFolderPlus, IconTagPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { CreateBookmarkDialog } from '../bookmarks/dialogs/create'
import { CreateFolderDialog } from '../folders/dialogs/create'
import { CreateTagDialog } from '../tags/dialogs/create'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

export function NavActions({ ...props }: React.ComponentProps<typeof SidebarMenu>) {
  const [openCreateBookmarkDialog, setOpenCreateBookmarkDialog] = useState(false)
  const [openCreateFolderDialog, setOpenCreateFolderDialog] = useState(false)
  const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false)

  return (
    <>
      <CreateBookmarkDialog open={openCreateBookmarkDialog} onOpenChange={setOpenCreateBookmarkDialog} />
      <CreateFolderDialog open={openCreateFolderDialog} onOpenChange={setOpenCreateFolderDialog} />
      <CreateTagDialog open={openCreateTagDialog} onOpenChange={setOpenCreateTagDialog} />

      <SidebarMenu {...props}>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="sm"
            onClick={() => {
              setOpenCreateBookmarkDialog(true)
            }}
          >
            <IconBookmarkPlus />
            Create bookmark
          </SidebarMenuButton>
          <SidebarMenuButton
            size="sm"
            onClick={() => {
              setOpenCreateFolderDialog(true)
            }}
          >
            <IconFolderPlus />
            Create folder
          </SidebarMenuButton>
          <SidebarMenuButton
            size="sm"
            onClick={() => {
              setOpenCreateTagDialog(true)
            }}
          >
            <IconTagPlus />
            Create tag
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
