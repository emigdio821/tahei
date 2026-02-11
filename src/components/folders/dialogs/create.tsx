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
import { type CreateFolderFormData, createFolderSchema } from '@/lib/form-schemas/folders'
import { createFolder } from '@/server-actions/folders'
import { FOLDERS_QUERY_KEY } from '@/tanstack-queries/folders'

interface CreateFolderDialogProps extends React.ComponentProps<typeof Dialog> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFolderDialog({ open, onOpenChange, ...props }: CreateFolderDialogProps) {
  const createFolderFormId = useId()

  const form = useForm<CreateFolderFormData>({
    shouldUnregister: true,
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: '',
      description: '',
      parentFolderId: null,
    },
  })

  const createFolderMutation = useEntityMutation({
    mutationFn: async (data: CreateFolderFormData) => {
      return await createFolder(data)
    },
    invalidateKeys: [FOLDERS_QUERY_KEY],
    successTitle: 'Folder created',
    successDescription: 'The folder has been created successfully.',
    errorDescription: 'An error occurred while creating the folder, please try again.',
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  function onSubmit(data: CreateFolderFormData) {
    createFolderMutation.mutate(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (createFolderMutation.isPending) return
        onOpenChange(isOpen)
      }}
      {...props}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
          <DialogDescription>Enter the information for the new folder.</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <form
            className="space-y-4"
            id={createFolderFormId}
            aria-label="Create folder form"
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
                    disabled={createFolderMutation.isPending}
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
                    disabled={createFolderMutation.isPending}
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
          <Button type="submit" form={createFolderFormId} disabled={createFolderMutation.isPending}>
            {createFolderMutation.isPending && <LoaderIcon />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
