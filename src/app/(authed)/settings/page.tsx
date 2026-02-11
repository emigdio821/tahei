import type { Metadata } from 'next'
import { appName } from '@/lib/config/site'

export const metadata: Metadata = {
  title: {
    template: `%s · ${appName}`,
    default: 'Settings',
  },
}

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="font-heading font-semibold text-xl leading-none">Settings</h1>
        {/* <p className="text-muted-foreground text-sm">
        </p> */}
      </div>
    </div>
  )
}
