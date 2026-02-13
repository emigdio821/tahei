import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

interface BatchCreateConfig<TData, TResult = unknown> {
  createFn: (item: TData) => Promise<TResult>
  invalidateKeys: string[]
  successTitle: React.ReactNode
  successDescription: React.ReactNode
  errorTitle?: React.ReactNode
  errorDescription?: React.ReactNode
  items: TData[]
  onSuccess?: (results: TResult[]) => void
}

export function useBatchCreate<TData, TResult = unknown>({
  createFn,
  invalidateKeys,
  successTitle,
  successDescription,
  errorTitle,
  errorDescription,
  items,
  onSuccess: customOnSuccess,
}: BatchCreateConfig<TData, TResult>) {
  const queryClient = useQueryClient()
  const [processedItems, setProcessedItems] = useState(0)

  const mutation = useMutation({
    mutationFn: async () => {
      setProcessedItems(0)

      const results = await Promise.allSettled(
        items.map(async (item) => {
          const result = await createFn(item)
          setProcessedItems((prev) => prev + 1)
          return result
        }),
      )

      const fulfilled = results.filter((r) => r.status === 'fulfilled').length
      const rejected = results.filter((r) => r.status === 'rejected').length

      const createdItems = results.filter((r) => r.status === 'fulfilled').map((r) => r.value)

      return { fulfilled, rejected, total: results.length, createdItems }
    },
    onSuccess: ({ fulfilled, rejected, createdItems }) => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })

      if (rejected === 0) {
        toast.success(successTitle, {
          description: successDescription,
        })
      } else if (fulfilled === 0) {
        toast.error(errorTitle || 'Error', {
          description: errorDescription || 'Something went wrong while creating the items. Please try again.',
        })
      } else {
        toast.warning('Warning', {
          description: `${fulfilled} created, ${rejected} failed.`,
        })
      }

      customOnSuccess?.(createdItems)
    },
    onError: (error) => {
      toast.error(errorTitle || 'Error', {
        description: errorDescription || 'Something went wrong while creating the items. Please try again.',
      })

      console.error('Batch create error:', error)
    },
  })

  return {
    ...mutation,
    processedItems,
  }
}
