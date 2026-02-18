'use client'

import { IconBookmark, IconHeart } from '@tabler/icons-react'
import { parseAsBoolean, useQueryStates } from 'nuqs'
import { appName } from '@/lib/config/site'
import { TaheiIcon } from '../icons'
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar'

export function HeaderNav({ ...props }: React.ComponentProps<typeof SidebarGroupContent>) {
  const { setOpenMobile, isMobile } = useSidebar()

  const [filters, setFilters] = useQueryStates({
    showAll: parseAsBoolean.withDefault(true),
    showFavorites: parseAsBoolean.withDefault(false),
  })

  return (
    <SidebarGroupContent className="flex flex-col gap-2" {...props}>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 rounded-lg p-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <TaheiIcon className="size-4 text-sidebar-primary-foreground" />
            </div>

            <div className="grid flex-1 text-left text-sm leading-none">
              <span className="truncate font-heading font-semibold text-sidebar-accent-foreground text-sm leading-none">
                {appName}
              </span>
              <span className="truncate text-sidebar-foreground text-xs">Bookmark manager</span>
            </div>
          </div>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={filters.showAll === true}
            onClick={() => {
              setFilters({
                showAll: true,
                showFavorites: false,
              })
              if (isMobile) setOpenMobile(false)
            }}
          >
            <IconBookmark className="size-4" />
            <span>All bookmarks</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={filters.showFavorites === true}
            onClick={() => {
              setFilters({
                showAll: false,
                showFavorites: true,
              })
              if (isMobile) setOpenMobile(false)
            }}
          >
            <IconHeart className="size-4" />
            <span>Favorites</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  )
}
