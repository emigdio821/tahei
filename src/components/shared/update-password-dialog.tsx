import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { LoaderIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { authClient } from '@/lib/auth/client'
import { type UpdatePasswordFormData, updatePasswordSchema } from '@/lib/form-schemas/profile'
import { InputPassword } from '../ui/input-password'
import { AlertDialogGeneric } from './alert-dialog-generic'

interface UpdatePasswordDialogProps extends React.ComponentProps<typeof Dialog> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdatePasswordDialog({ open, onOpenChange, ...props }: UpdatePasswordDialogProps) {
  const createFolderFormId = useId()
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false)

  const form = useForm<UpdatePasswordFormData>({
    shouldUnregister: true,
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    },
  })

  const updatePasswordMutation = useEntityMutation({
    mutationFn: async (data: UpdatePasswordFormData) => {
      return await authClient.changePassword({
        revokeOtherSessions: true,
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        fetchOptions: {
          onError: (error) => {
            console.error('Error during change password:', error)
          },
        },
      })
    },
    invalidateKeys: [],
    successTitle: 'Password updated',
    successDescription: 'Your password has been successfully updated.',
    errorDescription:
      'An error occurred while updating your password, please try again or check if you entered the correct current password.',
    onSuccess: () => {
      onOpenChange(false)
    },
    onError: (error) => {
      console.log('Update password error:', error)
    },
  })

  function onSubmit() {
    setConfirmationDialogOpen(true)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (updatePasswordMutation.isPending) return
        onOpenChange(isOpen)
      }}
      {...props}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update password</DialogTitle>
        </DialogHeader>

        <DialogPanel>
          <form
            id={createFolderFormId}
            className="flex flex-col gap-4"
            aria-label="Update password form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Current password <span className="text-destructive">*</span>
                  </FieldLabel>
                  <InputPassword
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={updatePasswordMutation.isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    New password <span className="text-destructive">*</span>
                  </FieldLabel>
                  <InputPassword
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={updatePasswordMutation.isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="newPasswordConfirmation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Confirm new password <span className="text-destructive">*</span>
                  </FieldLabel>
                  <InputPassword
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={updatePasswordMutation.isPending}
                  />
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
          <Button type="submit" form={createFolderFormId} disabled={updatePasswordMutation.isPending}>
            {updatePasswordMutation.isPending && <LoaderIcon />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialogGeneric
        title="Are you sure?"
        open={isConfirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
        description="You will be logged out from all other sessions."
        action={() => {
          updatePasswordMutation.mutate(form.getValues())
          setConfirmationDialogOpen(false)
        }}
        variant="destructive"
      />
    </Dialog>
  )
}
