import { Skeleton } from '@/components/ui/skeleton'

export function TextGenericSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-transparent pt-0">
      <Skeleton className="h-2 w-2/4 sm:w-1/2" />
      <Skeleton className="h-2 w-3/4 sm:w-2/3" />
      <Skeleton className="h-2 w-4/4 sm:w-3/4" />
      <Skeleton className="h-2 w-4/4 sm:w-4/5" />
    </div>
  )
}
