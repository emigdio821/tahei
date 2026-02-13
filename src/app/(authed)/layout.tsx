import { AppHeader } from '@/components/app-header'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <section className="mx-auto flex w-full flex-1 flex-col gap-4 p-6 md:max-w-xl lg:max-w-4xl xl:max-w-7xl">
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
