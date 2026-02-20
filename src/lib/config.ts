export const appName = 'Tahei'
export const appDesc = 'A simple, open-source, self-hosted bookmark manager.'
export const appUrl = 'https://tahei.vercel.app'
export const appOgUrl = 'https://tahei.vercel.app/og'

export const SITE_CONFIG = {
  title: appName,
  description: appDesc,
  url: appUrl,
  icons: {
    favicon: '/favicon.ico',
    appleTouchIcon: '/images/apple-touch-icon.png',
    s16Icon: '/images/favicon-16x16.png',
    s32Icon: '/images/favicon-32x32.png',
    s192Icon: '/images/android-chrome-192x192.png',
    s512Icon: '/images/android-chrome-512x512.png',
  },
  ogTwitter: {
    card: 'summary_large_image',
    title: appName,
    description: appDesc,
    image: appOgUrl,
    creator: '@luzapien, @emigdio821',
  },
  og: {
    title: appName,
    description: appDesc,
    url: appUrl,
    siteName: appName,
    type: 'website',
    image: appOgUrl,
    locale: 'en-US',
  },
  keywords: [
    'Emigdio Torres',
    'Emigdio',
    'Torres',
    'Tahei',
    'tahei',
    'Bookmark manager',
    'bookmarks',
    'Tanstack',
    'TanStack Start',
    'Tailwind',
    'Mexico',
    'opensource',
  ],
} as const

export const LINK_ICONS = [
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: SITE_CONFIG.icons.appleTouchIcon,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: SITE_CONFIG.icons.s16Icon,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: SITE_CONFIG.icons.s32Icon,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: SITE_CONFIG.icons.s192Icon,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '512x512',
    href: SITE_CONFIG.icons.s512Icon,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png',
  },

  {
    rel: 'shortcut icon',
    href: SITE_CONFIG.icons.s512Icon,
  },
  { rel: 'icon', href: SITE_CONFIG.icons.favicon },
] as const
