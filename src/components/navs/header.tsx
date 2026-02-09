'use client'

import { IconHomeStats } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroupContent className="flex flex-col gap-2" {...props}>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            render={
              <Link href="/" onClick={() => setOpenMobile(false)}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary">
                  <TaheiIcon className="size-4 text-sidebar-primary-foreground" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-none">
                  <span className="truncate font-medium text-base text-sidebar-accent-foreground">
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
            onClick={() => setOpenMobile(false)}
            isActive={pathname === '/'}
            render={
              <Link href="/">
                <IconHomeStats className="size-4" />
                <span>Inicio</span>
              </Link>
            }
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  )
}
