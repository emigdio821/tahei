import { redirect } from 'next/navigation'
import { Footer } from '@/components/footer'
import { TaheiIcon } from '@/components/icons'
import { LoginFormCard } from '@/components/login/form-card'
import { Frame, FrameDescription, FrameHeader, FrameTitle } from '@/components/ui/frame'
import { appName } from '@/lib/config/site'
import { getSession } from '@/server-actions/session'

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 px-2 py-6">
        <div className="flex items-center gap-2 self-center">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TaheiIcon className="size-4" />
          </div>
          <span className="font-medium text-base text-foreground">{appName}</span>
        </div>

        <Frame className="w-full max-w-sm">
          <FrameHeader>
            <FrameTitle>Login</FrameTitle>
            <FrameDescription>Enter your credentials to access your account.</FrameDescription>
          </FrameHeader>
          <LoginFormCard />
        </Frame>
      </div>

      <Footer />
    </div>
  )
}
