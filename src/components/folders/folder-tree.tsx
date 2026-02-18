'use client'

import { IconChevronRight, IconFolder } from '@tabler/icons-react'
import { parseAsString, useQueryState } from 'nuqs'
import type { FolderTreeNode } from '@/server-actions/folders'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from '../ui/sidebar'
import { FolderActionsCtxMenu } from './actions-context-menu'

export function FolderTree({ folder }: { folder: FolderTreeNode }) {
  const { setOpenMobile, isMobile } = useSidebar()
  const hasChildren = folder.subfolders.length > 0

  const [selectedFolder, setSelectedFolder] = useQueryState('folder', parseAsString.withDefault(''))

  if (!hasChildren) {
    return (
      <FolderActionsCtxMenu
        folder={folder}
        trigger={
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={selectedFolder === folder.id}
              onClick={() => {
                if (isMobile) setOpenMobile(false)
                setSelectedFolder((prev) => (prev === folder.id ? '' : folder.id))
              }}
            >
              <IconFolder />
              <span className="truncate">{folder.name}</span>
            </SidebarMenuButton>

            {folder.bookmarkCount > 0 && (
              <SidebarMenuBadge className="text-muted-foreground!">{folder.bookmarkCount}</SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        }
      />
    )
  }

  return (
    <Collapsible>
      <FolderActionsCtxMenu
        folder={folder}
        trigger={
          <SidebarMenuItem>
            <CollapsibleTrigger
              render={
                <SidebarMenuAction className="left-1 text-sidebar-accent-foreground aria-expanded:[&_svg]:rotate-90">
                  <IconChevronRight className="size-4 transition-transform" />
                </SidebarMenuAction>
              }
            />

            <SidebarMenuButton
              isActive={selectedFolder === folder.id}
              onClick={() => {
                if (isMobile) setOpenMobile(false)
                setSelectedFolder((prev) => (prev === folder.id ? '' : folder.id))
              }}
              className="truncate ps-7"
            >
              <span className="truncate">{folder.name}</span>
            </SidebarMenuButton>

            {folder.bookmarkCount > 0 && (
              <SidebarMenuBadge className="text-muted-foreground!">{folder.bookmarkCount}</SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        }
      />

      <CollapsibleContent>
        <SidebarMenuSub>
          {folder.subfolders.map((child) => (
            <FolderTree key={child.id} folder={child} />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}
