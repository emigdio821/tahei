import { IconGhost3 } from '@tabler/icons-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardFooter } from '@/components/ui/card'
import { Frame, FrameDescription, FrameHeader, FrameTitle } from '@/components/ui/frame'
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
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 px-2 py-6">
        <div className="flex items-center gap-2 self-center">
          <IconGhost3 className="size-8" />
        </div>

        <Frame className="w-full max-w-sm">
          <FrameHeader>
            <FrameTitle className="font-extrabold text-4xl">404</FrameTitle>
            <FrameDescription>This page does not exist.</FrameDescription>
          </FrameHeader>
          <Card>
            <CardFooter>
              <Button nativeButton={false} className="grow" render={<Link href="/">Home</Link>} />
            </CardFooter>
          </Card>
        </Frame>
      </div>

      <Footer />
    </div>
  )
}
