'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { getAllBookmarkIds, resyncBookmarksMetadataBatch } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'
import { ExportBookmarksDialog } from '../bookmarks/dialogs/export'
import { ImportBookmarkDialog } from '../bookmarks/dialogs/import'
import { AlertDialogGeneric } from '../shared/alert-dialog-generic'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Frame, FrameDescription, FrameHeader, FrameTitle } from '../ui/frame'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

export function BookmarksSettings() {
  const queryClient = useQueryClient()
  const [assetsOnly, setAssetsOnly] = useState(false)

  const [isExportDialogOpen, setExportDialogOpen] = useState(false)
  const [isImportDialogOpen, setImportDialogOpen] = useState(false)
  const [isUpdateMetadataDialogOpen, setUpdateMetadataDialogOpen] = useState(false)

  const updateMetadataMutation = useMutation({
    mutationFn: async (options: {
      assetsOnly: boolean
      onProgress?: (current: number, total: number) => void
    }) => {
      const ids = await getAllBookmarkIds()
      const bookmarkIds = ids.map((bookmark) => bookmark.id)

      const CHUNK_SIZE = 4
      const allResults = []

      for (let i = 0; i < bookmarkIds.length; i += CHUNK_SIZE) {
        const chunk = bookmarkIds.slice(i, i + CHUNK_SIZE)
        const chunkResults = await resyncBookmarksMetadataBatch(chunk, options)
        allResults.push(...chunkResults)

        options.onProgress?.(Math.min(i + CHUNK_SIZE, bookmarkIds.length), bookmarkIds.length)
      }

      return allResults
    },
  })

  async function handleUpdateMetadata(options: { assetsOnly: boolean }) {
    const toastId = toast.loading('Updating metadata...', {
      description: 'Preparing to update bookmarks...',
    })

    try {
      const results = await updateMetadataMutation.mutateAsync({
        ...options,
        onProgress: (current, total) => {
          toast.loading('Updating metadata...', {
            id: toastId,
            description: `Processing ${current} of ${total} bookmarks...`,
          })
        },
      })
      const succeeded = results.filter((r) => r.success).length
      const failed = results.filter((r) => !r.success).length

      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] })

      if (failed === 0) {
        toast.success('Success', {
          id: toastId,
          description: 'All bookmarks metadata updated successfully.',
        })
      } else if (succeeded === 0) {
        toast.error('Error', {
          id: toastId,
          description: 'Failed to update bookmarks metadata. Please try again later.',
        })
      } else {
        toast.success('Partial update', {
          id: toastId,
          description: `${succeeded} updated, ${failed} failed.`,
        })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while updating metadata.'
      console.error('Batch metadata update failed', error)

      toast.error('Error', {
        id: toastId,
        description: errorMessage,
      })
    }
  }

  return (
    <>
      <AlertDialogGeneric
        title="Update bookmarks metadata?"
        description="It may take a while depending on the number of bookmarks you have."
        action={() => {
          handleUpdateMetadata({ assetsOnly })
          setUpdateMetadataDialogOpen(false)
          setAssetsOnly(false)
        }}
        contentProps={{
          className: 'sm:max-w-md',
        }}
        content={
          <div>
            <Label
              htmlFor="assets-only-checkbox"
              className="flex items-center gap-6 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
            >
              <div className="flex flex-col">
                <p className="text-sm">Assets only</p>
                <p className="font-normal text-muted-foreground text-sm">
                  Update favicon and preview images only.
                </p>
              </div>
              <Switch
                id="assets-only-checkbox"
                className="ms-auto"
                checked={assetsOnly}
                onCheckedChange={(value) => {
                  setAssetsOnly(value)
                }}
              />
            </Label>
          </div>
        }
        open={isUpdateMetadataDialogOpen}
        onOpenChangeComplete={(isOpen) => {
          if (!isOpen) setAssetsOnly(false)
        }}
        onOpenChange={setUpdateMetadataDialogOpen}
      />

      <ExportBookmarksDialog open={isExportDialogOpen} onOpenChange={setExportDialogOpen} />
      <ImportBookmarkDialog open={isImportDialogOpen} onOpenChange={setImportDialogOpen} />

      <Frame>
        <FrameHeader>
          <FrameTitle>Bookmarks</FrameTitle>
          <FrameDescription>Import, export, and update bookmarks metadata.</FrameDescription>
        </FrameHeader>
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setImportDialogOpen(true)}
              >
                Import
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setExportDialogOpen(true)}
              >
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={updateMetadataMutation.isPending}
                onClick={() => setUpdateMetadataDialogOpen(true)}
              >
                Update metadata
              </Button>
            </div>
          </CardContent>
        </Card>
      </Frame>
    </>
  )
}
