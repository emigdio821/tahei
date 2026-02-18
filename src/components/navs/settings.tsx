'use client'

import { IconSettings } from '@tabler/icons-react'
import { useState } from 'react'
import { SettingsDialog } from '../settings/settings-dialog'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

export function NavSettings({ ...props }: React.ComponentProps<typeof SidebarMenu>) {
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState(false)

  return (
    <>
      <SettingsDialog open={isSettingsDialogOpen} onOpenChange={setSettingsDialogOpen} />

      <SidebarMenu {...props}>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => {
              setSettingsDialogOpen(true)
            }}
          >
            <IconSettings />
            Settings
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
