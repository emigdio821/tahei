import { zodResolver } from '@hookform/resolvers/zod'
import { IconUpload } from '@tabler/icons-react'
import type React from 'react'
import { useId, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LoaderIcon } from '@/components/icons'
import { FoldersCombobox } from '@/components/shared/dropdowns/folders-combobox'
import { TagsMultiCombobox } from '@/components/shared/dropdowns/tags-multi-combobox'
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
import { Progress, ProgressIndicator, ProgressTrack, ProgressValue } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBatchCreate } from '@/hooks/use-batch-create'
import { type ImportBookmarksFormData, importBookmarksSchema } from '@/lib/form-schemas/bookmarks'
import { createBookmark } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'

interface ImportBookmarksDialogProps extends React.ComponentProps<typeof Dialog> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportBookmarkDialog({ open, onOpenChange, ...props }: ImportBookmarksDialogProps) {
  const importBookmarksFormId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [unformattedUrls, setUnformattedUrls] = useState('')

  const form = useForm<ImportBookmarksFormData>({
    shouldUnregister: true,
    resolver: zodResolver(importBookmarksSchema),
    defaultValues: {
      urls: [],
      tags: [],
      folderId: null,
    },
  })

  const batchImportMutation = useBatchCreate({
    items: form.getValues().urls,
    successTitle: 'Bookmarks imported',
    successDescription: 'The bookmarks have been successfully imported.',
    createFn: async (url) => {
      await createBookmark({
        url,
        tags: form.getValues().tags,
        folderId: form.getValues().folderId,
      })
    },
    invalidateKeys: [BOOKMARKS_QUERY_KEY],
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  function onSubmit() {
    batchImportMutation.mutate()
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

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) setUnformattedUrls('')
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
                    <InputGroupAddon align="block-end" className="justify-end p-1 pt-0">
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              size="icon-xs"
                              variant="ghost"
                              aria-label="Upload .txt file"
                              onClick={handleUploadTxtFile}
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
            <Progress
              className="mt-4"
              max={form.getValues('urls').length}
              value={batchImportMutation.processedItems}
            >
              <div className="flex items-center justify-end gap-2">
                <ProgressValue>
                  {(_formatted, value) => `${value} / ${form.getValues('urls')?.length}`}
                </ProgressValue>
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
