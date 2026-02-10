import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { getQueryClient } from '@/lib/query-client'
import { loggedUserQueryOptions } from '@/tanstack-queries/logged-user'
import { HeaderNav } from './navs/header'
import { NavMain } from './navs/main'
import { NavUser } from './navs/user'

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(loggedUserQueryOptions())

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <HeaderNav />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NavUser />
        </HydrationBoundary>
      </SidebarFooter>
    </Sidebar>
  )
}
