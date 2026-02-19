import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import { Providers } from '@/components/providers'
import { TSDevtools } from '@/components/tanstack/devtools'
import { LINK_ICONS } from '@/lib/config'
import { createSEOMeta } from '@/lib/seo'
import appCss from '../styles.css?url'
import { DefaultErrorBoundary } from '@/components/errors/default-boundary'
import NotFound from '@/components/errors/not-found'

interface RouteContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouteContext>()({
  head: () => ({
    meta: createSEOMeta(),
    links: [
      ...LINK_ICONS,
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultErrorBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="relative">
        <Providers>
          <main className="isolate flex min-h-dvh flex-col antialiased">{children}</main>
        </Providers>
        <TSDevtools />
        <Scripts />
      </body>
    </html>
  )
}
