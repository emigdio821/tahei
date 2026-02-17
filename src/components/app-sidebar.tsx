import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { NavActions } from './navs/actions'
import { NavFolders } from './navs/folders'
import { HeaderNav } from './navs/header'
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
        <NavActions />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
