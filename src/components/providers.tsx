'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

interface ProvidersProps {
  children: React.ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: ProvidersProps) {
  return (
    <NuqsAdapter>
      <NextThemesProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delay={300}>
            {children}
            <Toaster />
          </TooltipProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </NextThemesProvider>
    </NuqsAdapter>
  )
}
