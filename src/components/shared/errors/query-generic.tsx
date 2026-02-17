import { IconBug } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface TSQueryGenericErrorProps extends React.ComponentProps<typeof Empty> {
  refetch: () => void
  errorTitle?: React.ReactNode
  errorDescription?: React.ReactNode
}

export function TSQueryGenericError(props: TSQueryGenericErrorProps) {
  const { refetch, errorTitle = 'Error', errorDescription = 'Something went wrong.', ...emptyProps } = props

  return (
    <Empty className="flex-0 rounded-xl bg-muted/72" {...emptyProps}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBug />
        </EmptyMedia>
        <EmptyTitle>{errorTitle}</EmptyTitle>
        <EmptyDescription>{errorDescription}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => refetch()}>Retry</Button>
      </EmptyContent>
    </Empty>
  )
}
