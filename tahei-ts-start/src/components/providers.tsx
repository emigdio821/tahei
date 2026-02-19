import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
// import { Toaster } from './ui/sonner'
// import { TooltipProvider } from './ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
        {/* <TooltipProvider delay={200}> */}
        {children}
        {/* </TooltipProvider>
        <Toaster /> */}
      </ThemeProvider>
    </NuqsAdapter>
  )
}
