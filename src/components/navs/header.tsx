import { IconBookmark, IconHeart } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { parseAsBoolean, useQueryStates } from 'nuqs'
import { bookmarksQueryOptions } from '@/api/tanstack-queries/bookmarks'
import { appName } from '@/lib/config'
import { cn } from '@/lib/utils'
import { TaheiIcon } from '../icons'
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
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

  const { data: bookmarks = [] } = useQuery(bookmarksQueryOptions())

  const totalBookmarks = bookmarks.length
  const favoritesCount = bookmarks.filter((bookmark) => bookmark.isFavorite === true).length

  return (
    <SidebarGroupContent className="flex flex-col gap-2" {...props}>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            render={
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary">
                  <TaheiIcon className="size-4 text-sidebar-primary-foreground" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-none">
                  <span className="truncate font-heading font-semibold text-sidebar-accent-foreground text-sm leading-none">
                    {appName}
                  </span>
                  <span className="truncate text-sidebar-foreground text-xs">Bookmark manager</span>
                </div>
              </Link>
            }
          />
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            className={cn(totalBookmarks > 0 && 'pe-10')}
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
            <span className="truncate">All bookmarks</span>
          </SidebarMenuButton>

          {totalBookmarks > 0 && (
            <SidebarMenuBadge className="text-muted-foreground!">{totalBookmarks}</SidebarMenuBadge>
          )}
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            className={cn(favoritesCount > 0 && 'pe-10')}
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
            <span className="truncate">Favorites</span>
          </SidebarMenuButton>

          {favoritesCount > 0 && (
            <SidebarMenuBadge className="text-muted-foreground!">{favoritesCount}</SidebarMenuBadge>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  )
}
