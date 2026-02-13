'use client'

import {
  IconBookmark,
  IconFileExport,
  IconFileImport,
  IconHexagonAsterisk,
  IconLogout,
  IconMoon,
  IconRefresh,
  IconSelector,
  IconSun,
} from '@tabler/icons-react'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/menu'
import { authClient } from '@/lib/auth/client'
import { loggedUserQueryOptions } from '@/tanstack-queries/logged-user'
import { ExportBookmarksDialog } from '../bookmarks/dialogs/export'
import { ImportBookmarkDialog } from '../bookmarks/dialogs/import'
import { UpdatePasswordDialog } from '../shared/update-password-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { Skeleton } from '../ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function NavUser() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { theme, setTheme } = useTheme()
  const [isExportDialogOpen, setExportDialogOpen] = useState(false)
  const [isImportDialogOpen, setImportDialogOpen] = useState(false)
  const [isUpdatePassDialogOpen, setUpdatePassDialogOpen] = useState(false)

  const { data: user, isLoading, error, refetch } = useSuspenseQuery(loggedUserQueryOptions())

  async function handleLogOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          queryClient.clear()
          router.replace('/login')
        },
        onError: (error) => {
          console.error('Error during sign out:', error)
        },
      },
    })
  }

  function getAvatarFallback() {
    if (!user) return null

    const userName = user.name
    const fallback = `${userName.split(' ')[0].charAt(0)}${userName.split(' ')[1]?.charAt(0) ?? ''}`

    return fallback
  }

  if (isLoading) return <Skeleton className="h-12 rounded-lg" />

  if (error || !user)
    return (
      <SidebarMenuButton onClick={() => refetch()} size="lg">
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">Refetch profile</span>
        </div>
        <IconRefresh className="ml-auto size-4" />
      </SidebarMenuButton>
    )

  return (
    <>
      <ExportBookmarksDialog open={isExportDialogOpen} onOpenChange={setExportDialogOpen} />
      <ImportBookmarkDialog open={isImportDialogOpen} onOpenChange={setImportDialogOpen} />
      <UpdatePasswordDialog open={isUpdatePassDialogOpen} onOpenChange={setUpdatePassDialogOpen} />

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Avatar>
                      <AvatarImage src={user.image || ''} alt={user.name} />
                      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="truncate font-medium">{user.name.split(' ')[0]}</p>
                      <p className="truncate text-muted-foreground text-xs">{user.email}</p>
                    </div>
                  </div>
                  <IconSelector className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              }
            />
            <DropdownMenuContent className="w-(--anchor-width)" align="center">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center justify-between gap-2 whitespace-normal">
                  <span className="line-clamp-2">{user.name}</span>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          className="-me-1.5"
                          aria-label="Update password"
                          onClick={() => setUpdatePassDialogOpen(true)}
                        >
                          <IconHexagonAsterisk />
                        </Button>
                      }
                    />
                    <TooltipContent>Update password</TooltipContent>
                  </Tooltip>
                </DropdownMenuLabel>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <IconMoon className="hidden size-4 dark:block" />
                    <IconSun className="size-4 dark:hidden" />
                    <span>Appearance</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuCheckboxItem checked={theme === 'light'} onClick={() => setTheme('light')}>
                        Light
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={theme === 'dark'} onClick={() => setTheme('dark')}>
                        Dark
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={theme === 'system'}
                        onClick={() => setTheme('system')}
                      >
                        System
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <IconBookmark />
                    <span>Bookmarks</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                        <IconFileImport />
                        Import
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>
                        <IconFileExport />
                        Export
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLogOut}>
                  <IconLogout className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
