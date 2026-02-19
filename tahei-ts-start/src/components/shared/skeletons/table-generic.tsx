import { Skeleton } from '@/components/ui/skeleton'
import { TextGenericSkeleton } from './text-generic'

interface TableGenericSkeletonProps {
  withHeader?: boolean
  headerContent?: React.ReactNode
}

export function TableGenericSkeleton({ withHeader = true, headerContent }: TableGenericSkeletonProps) {
  return (
    <div className="space-y-2">
      {withHeader && (
        <div>{headerContent ? headerContent : <Skeleton className="h-8 w-full rounded-lg sm:w-sm" />}</div>
      )}

      <TextGenericSkeleton />
    </div>
  )
}
