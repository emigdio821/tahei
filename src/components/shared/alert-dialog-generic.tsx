'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, type ButtonProps } from '@/components/ui/button'
import { LoaderIcon } from '../icons'

interface AlertDialogGenericProps extends React.ComponentProps<typeof AlertDialog> {
  action?: () => void | Promise<void>
  title?: React.ReactNode
  description?: React.ReactNode
  actionLabel?: React.ReactNode
  variant?: ButtonProps['variant']
  content?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AlertDialogGeneric(props: AlertDialogGenericProps) {
  const { action, title, description, actionLabel, variant, content, open, onOpenChange } = props
  const [isExecutingAction, setExecutingAction] = useState(false)

  async function handleAction() {
    if (action) {
      setExecutingAction(true)
      try {
        await action()
      } catch (error) {
        console.error('Error executing action:', error)
        throw error
      } finally {
        setExecutingAction(false)
      }
    } else {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isExecutingAction) return
        onOpenChange(isOpen)
      }}
    >
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title || 'Proceed?'}</AlertDialogTitle>
          <AlertDialogDescription>{description || 'This action cannot be undone.'}</AlertDialogDescription>
        </AlertDialogHeader>
        {content && <div className="px-6 pb-6">{content}</div>}
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline" disabled={isExecutingAction} />}>
            Cancel
          </AlertDialogClose>
          <Button variant={variant} onClick={handleAction} disabled={isExecutingAction}>
            {isExecutingAction && <LoaderIcon />}
            {actionLabel || 'Proceed'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
