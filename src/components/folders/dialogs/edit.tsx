import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { LoaderIcon } from '@/components/icons'
import { FoldersCombobox } from '@/components/shared/dropdowns/folders-combobox'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { type UpdateFolderFormData, updateFolderSchema } from '@/lib/form-schemas/folders'
import { type FolderTreeNode, updateFolder } from '@/server-actions/folders'
import { FOLDERS_QUERY_KEY } from '@/tanstack-queries/folders'

interface EditFolderDialogProps extends React.ComponentProps<typeof Dialog> {
  folder: FolderTreeNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditFolderDialog({ open, onOpenChange, folder, ...props }: EditFolderDialogProps) {
  const editFolderFormId = useId()

  const form = useForm<UpdateFolderFormData>({
    resolver: zodResolver(updateFolderSchema),
    values: {
      id: folder.id,
      name: folder.name,
      description: folder.description || '',
      parentFolderId: folder.parentFolderId,
    },
  })

  const updateFolderMutation = useEntityMutation({
    mutationFn: async (data: UpdateFolderFormData) => {
      return await updateFolder(data)
    },
    invalidateKeys: [FOLDERS_QUERY_KEY],
    successTitle: 'Folder updated',
    successDescription: 'The folder has been updated successfully.',
    errorDescription: 'An error occurred while updating the folder, please try again.',
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  function onSubmit(data: UpdateFolderFormData) {
    updateFolderMutation.mutate(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (updateFolderMutation.isPending) return
        onOpenChange(isOpen)
      }}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) form.reset()
      }}
      {...props}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit folder</DialogTitle>
          <DialogDescription>Enter the folder information.</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <form
            className="space-y-4"
            id={editFolderFormId}
            aria-label="Edit folder form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={updateFolderMutation.isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={updateFolderMutation.isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="parentFolderId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Parent folder</FieldLabel>
                  <FoldersCombobox value={field.value} onValueChange={(value) => field.onChange(value)} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </form>
        </DialogPanel>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" type="button">
                Cancel
              </Button>
            }
          />
          <Button type="submit" form={editFolderFormId} disabled={updateFolderMutation.isPending}>
            {updateFolderMutation.isPending && <LoaderIcon />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
