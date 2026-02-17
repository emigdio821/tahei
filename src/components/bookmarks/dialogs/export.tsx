import { toast } from 'sonner'
import { AlertDialogGeneric } from '@/components/shared/alert-dialog-generic'
import { appName } from '@/lib/config/site'
import { getAllBookmarkUrls } from '@/server-actions/bookmarks'

interface ExportBookmarksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportBookmarksDialog({ open, onOpenChange }: ExportBookmarksDialogProps) {
  async function handleExportBookmarks() {
    try {
      const bookmarks = await getAllBookmarkUrls()

      if (!bookmarks || bookmarks.length === 0) {
        toast.warning('There are no bookmarks to export.')
        onOpenChange(false)
        return
      }

      const fileData = bookmarks.map((bk) => bk.url).join('\n')
      const blob = new Blob([fileData], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${appName}-bookmarks.txt`
      link.href = url
      link.click()
      onOpenChange(false)
    } catch (error) {
      console.error('Error exporting bookmarks:', error)
      toast.error('Error', { description: 'Unable to export bookmarks at this time, try again.' })
    }
  }

  return (
    <AlertDialogGeneric
      open={open}
      title="Export bookmarks?"
      onOpenChange={onOpenChange}
      action={handleExportBookmarks}
      description="All your bookmark URLs will be exported in a .txt file, one URL per line."
    />
  )
}
