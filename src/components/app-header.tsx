import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
// import { TaheiIcon } from './icons'
import { SidebarTrigger } from './ui/sidebar'
import Link from 'next/link'
import { siteConfig } from '@/lib/config/site'

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 lg:hidden">
      <div className="flex w-full items-center gap-1 px-4">
        <SidebarTrigger className="-ml-2" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
        />
        <Button
          variant="ghost"
          className="px-2"
          nativeButton={false}
          render={
            <Link href="/">
              {/* <TaheiIcon className="size-4" /> */}
              <span className="text-base font-medium">{siteConfig.name}</span>
            </Link>
          }
        />
      </div>
    </header>
  )
}
