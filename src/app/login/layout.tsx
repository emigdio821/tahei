import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site'

export const metadata: Metadata = {
  title: `Login · ${siteConfig.name}`,
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

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
