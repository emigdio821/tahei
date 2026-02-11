'use client'

import { IconChevronRight, IconFolder } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const hasChildren = folder.subfolders.length > 0

  const href: `/folders/${string}` = `/folders/${folder.id}`
  const isActive = pathname === href

  if (!hasChildren) {
    return (
      <FolderActionsCtxMenu
        folder={folder}
        trigger={
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive}
              onClick={() => setOpenMobile(false)}
              render={
                <Link href={href}>
                  <IconFolder />
                  <span className="truncate">{folder.name}</span>
                </Link>
              }
            />

            {folder.bookmarkCount > 0 && <SidebarMenuBadge>{folder.bookmarkCount}</SidebarMenuBadge>}
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
              isActive={isActive}
              onClick={() => setOpenMobile(false)}
              className="truncate ps-7"
              render={
                <Link href={href}>
                  <span className="truncate">{folder.name}</span>
                </Link>
              }
            />

            {folder.bookmarkCount > 0 && <SidebarMenuBadge>{folder.bookmarkCount}</SidebarMenuBadge>}
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
