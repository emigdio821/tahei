import { AppThemeSettings } from '@/components/settings/app-theme'
import { BookmarksSettings } from '@/components/settings/bookmarks'
import { ProfileSettings } from '@/components/settings/profile'

export default function SettingsPage() {
  return (
    <div>
      <ProfileSettings />
      <AppThemeSettings />
      <BookmarksSettings />
    </div>
  )
}
