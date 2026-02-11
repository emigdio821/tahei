'use client'

import { IconChevronRight, IconDotsVertical, IconFolder } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { FolderTreeNode } from '@/server-actions/folders'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from '../ui/sidebar'
import { FolderActionsDropdown } from './actions-dropdown'

export function FolderTree({ folder }: { folder: FolderTreeNode }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const hasChildren = folder.subfolders.length > 0

  const href: `/folders/${string}` = `/folders/${folder.id}`
  const isActive = pathname === href

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => setOpenMobile(false)}
          render={
            <Link href={href}>
              <IconFolder />
              {folder.name}
            </Link>
          }
        />

        <FolderActionsDropdown
          folder={folder}
          trigger={
            <SidebarMenuAction showOnHover>
              <IconDotsVertical className="size-4" />
            </SidebarMenuAction>
          }
        />
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible>
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
          className="ps-7"
          render={<Link href={href}>{folder.name}</Link>}
        />

        <FolderActionsDropdown
          folder={folder}
          trigger={
            <SidebarMenuAction showOnHover>
              <IconDotsVertical className="size-4" />
            </SidebarMenuAction>
          }
        />
      </SidebarMenuItem>

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
