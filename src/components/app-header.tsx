import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { siteConfig } from '@/lib/config/site'
import { SidebarTrigger } from './ui/sidebar'

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 lg:hidden">
      <div className="flex w-full items-center gap-1 px-4">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-4" />
        <Button
          variant="ghost"
          className="px-2"
          nativeButton={false}
          render={
            <Link href="/">
              <span className="font-semibold">{siteConfig.name}</span>
            </Link>
          }
        />
      </div>
    </header>
  )
}
