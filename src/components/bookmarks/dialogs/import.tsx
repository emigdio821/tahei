import { zodResolver } from '@hookform/resolvers/zod'
import { IconUpload } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type React from 'react'
import { useId, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { LoaderIcon } from '@/components/icons'
import { FoldersCombobox } from '@/components/shared/dropdowns/folders-combobox'
import { TagsMultiCombobox } from '@/components/shared/dropdowns/tags-multi-combobox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupTextarea } from '@/components/ui/input-group'
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { type ImportBookmarksFormData, importBookmarksSchema } from '@/lib/form-schemas/bookmarks'
import { type CreateBookmarksBatchResult, createBookmarksBatch } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'

interface ImportBookmarksDialogProps extends React.ComponentProps<typeof Dialog> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportBookmarkDialog({ open, onOpenChange, ...props }: ImportBookmarksDialogProps) {
  const importBookmarksFormId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [unformattedUrls, setUnformattedUrls] = useState('')
  const [progress, setProgress] = useState(0)
  const queryClient = useQueryClient()

  const form = useForm<ImportBookmarksFormData>({
    shouldUnregister: true,
    resolver: zodResolver(importBookmarksSchema),
    defaultValues: {
      urls: [],
      tags: [],
      folderId: null,
    },
  })

  const batchImportMutation = useMutation({
    mutationFn: async (data: ImportBookmarksFormData) => {
      setProgress(0)

      const bookmarksData = data.urls.map((url) => ({
        url,
        tags: data.tags,
        folderId: data.folderId,
      }))

      const CHUNK_SIZE = 10
      const allResults: CreateBookmarksBatchResult[] = []

      for (let i = 0; i < bookmarksData.length; i += CHUNK_SIZE) {
        const chunk = bookmarksData.slice(i, i + CHUNK_SIZE)
        const chunkResults = await createBookmarksBatch(chunk)
        allResults.push(...chunkResults)
        setProgress((Math.min(i + CHUNK_SIZE, bookmarksData.length) / bookmarksData.length) * 100)
      }

      return allResults
    },
    onSuccess: (results) => {
      const succeeded = results.filter((r) => r.success).length
      const failed = results.filter((r) => !r.success).length

      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] })

      if (failed === 0) {
        toast.success('Bookmarks imported', {
          description: `Successfully imported all bookmarks.`,
        })
      } else if (succeeded === 0) {
        toast.error('Import failed', {
          description: 'Failed to import any bookmarks. Please check the URLs and try again.',
        })
      } else {
        toast.warning('Partial import', {
          description: `${succeeded} imported, ${failed} failed.`,
        })
      }

      if (succeeded > 0) {
        onOpenChange(false)
      }
    },
    onError: (error) => {
      toast.error('Import failed', {
        description: error instanceof Error ? error.message : 'An error occurred while importing bookmarks.',
      })
    },
  })

  function onSubmit(data: ImportBookmarksFormData) {
    batchImportMutation.mutate(data)
  }

  function handleOpenChange(open: boolean) {
    if (batchImportMutation.isPending) return
    onOpenChange(open)
  }

  function handleUploadTxtFile() {
    fileInputRef.current?.click()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.name.endsWith('.txt')) {
      toast.error('Invalid file type', {
        description: 'Please upload a .txt file',
      })
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result as string

      if (content) {
        setUnformattedUrls(content)
        const urls = content
          .split('\n')
          .map((url) => url.trim())
          .filter((url) => url !== '')
        form.setValue('urls', urls, { shouldValidate: true })
      }
    }

    reader.onerror = () => {
      toast.error('Error reading file', {
        description: 'Failed to read the file. Please try again.',
      })
    }

    reader.readAsText(file)

    event.target.value = ''
  }

  function renderValidUrlsBadge() {
    const urls = form.getValues('urls')

    const validUrlsLength = urls.filter((url) => {
      return z.url().safeParse(url).success
    }).length

    return validUrlsLength > 5 ? <Badge variant="outline">{validUrlsLength} URLs</Badge> : null
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) {
          setUnformattedUrls('')
          setProgress(0)
        }
      }}
      {...props}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import bookmarks</DialogTitle>
          <DialogDescription>
            Paste the URLs of the bookmarks you want to import, one per line.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <input
            type="file"
            accept=".txt"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            aria-label="Upload .txt file"
          />
          <form
            id={importBookmarksFormId}
            className="flex flex-col gap-4"
            aria-label="Create bookmark form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Controller
              name="urls"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    URLs <span className="text-destructive">*</span>
                  </FieldLabel>

                  <InputGroup className="max-h-80">
                    <InputGroupTextarea
                      onBlur={field.onBlur}
                      id={field.name}
                      value={unformattedUrls}
                      onChange={(e) => {
                        setUnformattedUrls(e.target.value)
                        const urls = e.target.value
                          .split('\n')
                          .map((url) => url.trim())
                          .filter((url) => url !== '')
                        field.onChange(urls)
                      }}
                      disabled={batchImportMutation.isPending}
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end" className="justify-between pt-1 pr-1 pb-1">
                      {renderValidUrlsBadge()}

                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              size="icon-xs"
                              variant="ghost"
                              className="ms-auto"
                              aria-label="Upload .txt file"
                              onClick={handleUploadTxtFile}
                              disabled={batchImportMutation.isPending}
                            />
                          }
                        >
                          <IconUpload />
                        </TooltipTrigger>
                        <TooltipContent>Upload .txt file</TooltipContent>
                      </Tooltip>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="folderId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Folder</FieldLabel>
                  <FoldersCombobox
                    id={field.name}
                    value={field.value}
                    disabled={batchImportMutation.isPending}
                    onValueChange={(value) => field.onChange(value)}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                  <TagsMultiCombobox
                    id={field.name}
                    value={field.value}
                    disabled={batchImportMutation.isPending}
                    onValueChange={(value) => {
                      field.onChange(value || [])
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </form>

          {batchImportMutation.isPending && (
            <Progress className="mt-4" value={progress}>
              <div className="flex items-center justify-between gap-2 text-muted-foreground">
                <ProgressLabel>Importing...</ProgressLabel>
                <ProgressValue />
              </div>
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
          )}
        </DialogPanel>

        <DialogFooter>
          <DialogClose
            render={
              <Button disabled={batchImportMutation.isPending} variant="outline" type="button">
                Cancel
              </Button>
            }
          />
          <Button type="submit" form={importBookmarksFormId} disabled={batchImportMutation.isPending}>
            {batchImportMutation.isPending && <LoaderIcon />}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
