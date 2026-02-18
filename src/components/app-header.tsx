import { Separator } from '@/components/ui/separator'
import { HeaderActions } from './navs/header-actions'
import { SidebarTrigger } from './ui/sidebar'

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear sm:h-16">
      <div className="mx-auto flex w-full items-center gap-2 px-6 md:max-w-xl lg:max-w-5xl xl:max-w-7xl">
        <SidebarTrigger className="-ml-1 sm:-ml-2" />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="font-medium text-base">Bookmarks</h1>
        <div className="ml-auto">
          <HeaderActions />
        </div>
      </div>
    </header>
  )
}
