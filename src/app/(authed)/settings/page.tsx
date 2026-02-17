import type { Metadata } from 'next'
import { AppThemeSettings } from '@/components/settings/app-theme'
import { BookmarksSettings } from '@/components/settings/bookmarks'
import { ProfileSettings } from '@/components/settings/profile'
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
      <h1 className="mb-4 font-heading font-semibold text-xl leading-none">Settings</h1>

      <section className="space-y-4">
        <ProfileSettings />
        <AppThemeSettings />
        <BookmarksSettings />
      </section>
    </div>
  )
}
