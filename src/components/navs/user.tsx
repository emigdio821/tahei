'use client'

import { IconLogout, IconRefresh, IconSelector } from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/menu'
import { authClient } from '@/lib/auth/client'
import { getAvatarFallback } from '@/lib/utils'
import { loggedUserQueryOptions } from '@/tanstack-queries/logged-user'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { Skeleton } from '../ui/skeleton'

export function NavUser() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: user, isLoading, error, refetch } = useQuery(loggedUserQueryOptions())

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

  if (isLoading)
    return (
      <div className="flex h-12 items-center gap-2 p-2">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-2/4" />
          <Skeleton className="h-2 w-3/4" />
        </div>
      </div>
    )

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
                    <AvatarFallback>{getAvatarFallback(user.name)}</AvatarFallback>
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
              <DropdownMenuLabel>
                <span className="line-clamp-2">{user.name}</span>
              </DropdownMenuLabel>

              <DropdownMenuItem onClick={handleLogOut}>
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
