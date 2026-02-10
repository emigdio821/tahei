import type { Metadata } from 'next'
import { appName } from '@/lib/config/site'

export const metadata: Metadata = {
  title: `Favorites · ${appName}`,
}

export default function FavoritesPage() {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="font-heading font-semibold text-xl leading-none">Favorites</h1>
        {/* <p className="text-muted-foreground text-sm">
        </p> */}
      </div>
    </div>
  )
}
