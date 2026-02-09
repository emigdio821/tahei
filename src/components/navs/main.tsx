'use client'

import { IconBell, IconGavel, IconHomeShield, IconPigMoney, IconShield, IconTool } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar'

export function NavMain({ ...props }: React.ComponentProps<typeof SidebarGroup>) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Secciones</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {/* <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              isActive={pathname === '/presidency'}
              render={
                <Link href="/presidency">
                  <IconGavel className="size-4" />
                  <span>Presidencia</span>
                </Link>
              }
            />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              isActive={pathname === '/treasury'}
              render={
                <Link href="/treasury">
                  <IconPigMoney className="size-4" />
                  <span>Tesorería</span>
                </Link>
              }
            />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              isActive={pathname === '/maintenance'}
              render={
                <Link href="/maintenance">
                  <IconTool className="size-4" />
                  <span>Mantenimiento</span>
                </Link>
              }
            />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              isActive={pathname === '/security'}
              render={
                <Link href="/security">
                  <IconShield className="size-4" />
                  <span>Seguridad</span>
                </Link>
              }
            />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              isActive={pathname === '/hoa-board'}
              render={
                <Link href="/hoa-board">
                  <IconHomeShield className="size-4" />
                  <span>Mesa directiva</span>
                </Link>
              }
            />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              isActive={pathname === '/notifications'}
              render={
                <Link href="/notifications">
                  <IconBell className="size-4" />
                  <span>Notificaciones</span>
                </Link>
              }
            />
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
