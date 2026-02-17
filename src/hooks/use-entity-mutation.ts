import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface BaseEntityMutationConfig<TData, TVariables, TQueryData = TData> {
  mutationFn: (variables: TVariables) => Promise<TData>
  invalidateKeys: (string | unknown[])[]
  errorTitle?: React.ReactNode
  errorDescription?: React.ReactNode
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
  optimisticUpdate?: {
    queryKey: unknown[]
    updateFn: (oldData: TQueryData | undefined, variables: TVariables) => TQueryData
  }
}

interface EntityMutationConfigWithToast<TData, TVariables, TQueryData = TData>
  extends BaseEntityMutationConfig<TData, TVariables, TQueryData> {
  showSuccessToast?: true
  successTitle?: React.ReactNode
  successDescription?: React.ReactNode
}

interface EntityMutationConfigWithoutToast<TData, TVariables, TQueryData = TData>
  extends BaseEntityMutationConfig<TData, TVariables, TQueryData> {
  showSuccessToast: false
  successTitle?: React.ReactNode
  successDescription?: React.ReactNode
}

type EntityMutationConfig<TData, TVariables, TQueryData = TData> =
  | EntityMutationConfigWithToast<TData, TVariables, TQueryData>
  | EntityMutationConfigWithoutToast<TData, TVariables, TQueryData>

type MutationContext<TQueryData> = {
  previousData?: TQueryData
}

export function useEntityMutation<TData = unknown, TVariables = unknown, TQueryData = TData>({
  mutationFn,
  invalidateKeys,
  successTitle = 'Success',
  successDescription,
  errorTitle = 'Error',
  errorDescription = 'Something went wrong, please try again.',
  showSuccessToast = true,
  onSuccess: customOnSuccess,
  onError: customOnError,
  optimisticUpdate,
}: EntityMutationConfig<TData, TVariables, TQueryData>) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables, MutationContext<TQueryData>>({
    mutationFn,
    onMutate: async (variables) => {
      if (!optimisticUpdate) return { previousData: undefined }

      await queryClient.cancelQueries({ queryKey: optimisticUpdate.queryKey })

      const previousData = queryClient.getQueryData<TQueryData>(optimisticUpdate.queryKey)

      queryClient.setQueryData<TQueryData>(optimisticUpdate.queryKey, (oldData) => {
        return optimisticUpdate.updateFn(oldData, variables)
      })

      return { previousData }
    },
    onSuccess: (data) => {
      invalidateKeys.forEach((key) => {
        const queryKey = Array.isArray(key) ? key : [key]
        queryClient.invalidateQueries({ queryKey })
      })

      if (showSuccessToast) {
        toast.success(successTitle, {
          description: successDescription,
        })
      }

      customOnSuccess?.(data)
    },
    onError: (error, _variables, context) => {
      if (optimisticUpdate && context?.previousData !== undefined) {
        queryClient.setQueryData(optimisticUpdate.queryKey, context.previousData)
      }

      toast.error(errorTitle, {
        description: errorDescription,
      })

      console.error('Entity mutation error:', error)

      customOnError?.(error)
    },
    onSettled: () => {
      if (optimisticUpdate) {
        queryClient.invalidateQueries({ queryKey: optimisticUpdate.queryKey })
      }
    },
  })
}
