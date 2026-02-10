'use client'

import { IconChevronRight } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { FolderSelect } from '@/db/schema/zod/folders'
import { foldersQueryOptions } from '@/tanstack-queries/folders'
import { TextGenericSkeleton } from '../shared/skeletons/text-generic'
import { Button } from '../ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '../ui/empty'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from '../ui/sidebar'

type TreeFolderItem = FolderSelect | FolderSelect[]

function FolderTree({ item }: { item: TreeFolderItem }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const [folder, ...items] = Array.isArray(item) ? item : [item]

  if (!items.length) {
    const href: `/folders/${string}` = `/folders/${folder.id}`
    const isActive = pathname === href

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => setOpenMobile(false)}
          render={<Link href={href}>{folder.name}</Link>}
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

        <SidebarMenuButton className="ps-7">
          <span className="truncate">{folder.name}</span>
        </SidebarMenuButton>

        {/* <SidebarMenuAction>
          <IconDotsVertical className="size-4" />
        </SidebarMenuAction> */}
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem) => (
              <FolderTree key={subItem.id} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function NavFolders({ ...props }: React.ComponentProps<typeof SidebarGroup>) {
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

    const tagsToRender = (
      <>
        {folders.map((item) => (
          <FolderTree key={item.id} item={item} />
        ))}
      </>
    )

    return tagsToRender
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>{renderFolders()}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
