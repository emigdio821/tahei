import { createFileRoute } from '@tanstack/react-router'
import { AppThemeSettings } from '@/components/settings/app-theme'
import { BookmarksSettings } from '@/components/settings/bookmarks'
import { ProfileSettings } from '@/components/settings/profile'
import { createSEOTitle } from '@/lib/seo'

export const Route = createFileRoute('/_authed/settings')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: createSEOTitle('Settings') }],
  }),
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <ProfileSettings />
      <AppThemeSettings />
      <BookmarksSettings />
    </div>
  )
}
