import { IconGhost3 } from '@tabler/icons-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { appName, siteConfig } from '@/lib/config/site'

export const metadata: Metadata = {
  title: {
    template: `%s · ${appName}`,
    default: 'Not found',
  },
  description: siteConfig.description,
  authors: [
    {
      name: 'Emigdio Torres',
      url: siteConfig.url,
    },
  ],
  creator: 'Emigdio Torres',
  icons: siteConfig.icons,
  openGraph: siteConfig.og,
  metadataBase: new URL(siteConfig.url),
  twitter: siteConfig.ogTwitter,
}

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconGhost3 />
        </EmptyMedia>
        <EmptyTitle className="font-extrabold text-4xl">404</EmptyTitle>
        <EmptyDescription>
          The page you're looking for doesn't exist. It may have been removed or the URL may be incorrect.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button nativeButton={false} render={<Link href="/">Home</Link>} />
      </EmptyContent>
    </Empty>
  )
}
