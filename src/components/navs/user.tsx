'use client'

import { IconLogout, IconMoon, IconRefresh, IconSelector, IconSettings, IconSun } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import type { User } from 'better-auth'
import Link from 'next/link'
import { useTheme } from 'next-themes'
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
import { loggedUserQueryOptions } from '@/tanstack-queries/logged-user'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { Skeleton } from '../ui/skeleton'

interface NavUserProps {
  user: User
}

export function NavUser({ user }: NavUserProps) {
  const { theme, setTheme } = useTheme()
  const {
    data: loggedUser = null,
    isLoading,
    error,
    refetch,
  } = useQuery({ ...loggedUserQueryOptions(), initialData: user })

  function getAvatarFallback() {
    if (!loggedUser) return null

    const userName = loggedUser.name
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
              <DropdownMenuLabel className="line-clamp-2">{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />

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
                    <DropdownMenuCheckboxItem checked={theme === 'system'} onClick={() => setTheme('system')}>
                      System
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={
                  <Link href="/settings">
                    <IconSettings className="size-4" />
                    Settings
                  </Link>
                }
              />
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {}}>
                <IconLogout className="size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
