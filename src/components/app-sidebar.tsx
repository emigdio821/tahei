import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { NavFolders } from './navs/folders'
import { HeaderNav } from './navs/header'
import { NavSettings } from './navs/settings'
import { NavTags } from './navs/tags'
import { NavUser } from './navs/user'

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <HeaderNav />
      </SidebarHeader>
      <SidebarContent>
        <NavFolders />
        <NavTags />
      </SidebarContent>
      <SidebarFooter>
        <NavSettings />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
