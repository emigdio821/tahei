import { redirect } from 'next/navigation'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { getSession } from '@/server-actions/session'
import { HeaderNav } from './navs/header'
import { NavMain } from './navs/main'
import { NavUser } from './navs/user'

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await getSession()

  if (!session) redirect('/login')

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <HeaderNav />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
