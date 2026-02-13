import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

interface BatchDeleteConfig<TData> {
  deleteFn: (item: TData) => Promise<unknown>
  invalidateKeys: string[]
  successTitle: React.ReactNode
  successDescription: React.ReactNode
  errorTitle?: React.ReactNode
  errorDescription?: React.ReactNode
  items: TData[]
  onSuccess?: () => void
}

export function useBatchDelete<TData>({
  deleteFn,
  invalidateKeys,
  successTitle,
  successDescription,
  errorTitle,
  errorDescription,
  items,
  onSuccess: customOnSuccess,
}: BatchDeleteConfig<TData>) {
  const queryClient = useQueryClient()
  const [processedItems, setProcessedItems] = useState(0)

  const mutation = useMutation({
    mutationFn: async () => {
      setProcessedItems(0)

      const results = await Promise.allSettled(
        items.map(async (item) => {
          const result = await deleteFn(item)
          setProcessedItems((prev) => prev + 1)
          return result
        }),
      )

      const fulfilled = results.filter((r) => r.status === 'fulfilled').length
      const rejected = results.filter((r) => r.status === 'rejected').length

      return { fulfilled, rejected, total: results.length }
    },
    onSuccess: ({ fulfilled, rejected }) => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })

      if (rejected === 0) {
        toast.success(successTitle, {
          description: successDescription,
        })
      } else if (fulfilled === 0) {
        toast.error(errorTitle || 'Error', {
          description: errorDescription || 'Something went wrong while deleting the items. Please try again.',
        })
      } else {
        toast.warning('Warning', {
          description: `${fulfilled} deleted, ${rejected} failed.`,
        })
      }

      customOnSuccess?.()
    },
    onError: (error) => {
      toast.error(errorTitle || 'Error', {
        description: errorDescription || 'Something went wrong while deleting the items. Please try again.',
      })

      console.error('Batch delete error:', error)
    },
  })

  return {
    ...mutation,
    processedItems,
  }
}
