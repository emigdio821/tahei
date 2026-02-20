import { IconBug } from '@tabler/icons-react'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function DefaultErrorBoundary({ error }: ErrorComponentProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBug />
        </EmptyMedia>
        <EmptyTitle>Error</EmptyTitle>
        <EmptyDescription>
          <code className="wrap-break-word block max-h-96 w-full overflow-auto rounded-md bg-muted p-2 font-mono text-xs">
            {error.message}
          </code>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </EmptyContent>
    </Empty>
  )
}
