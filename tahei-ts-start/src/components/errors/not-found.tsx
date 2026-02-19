import { IconGhost3 } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Link } from '@tanstack/react-router'


export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconGhost3 />
        </EmptyMedia>
        <EmptyTitle className="font-extrabold text-4xl">404</EmptyTitle>
        <EmptyDescription>
          The page you're looking for doesn't exist. It may have been removed or the URL may be incorrect.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button nativeButton={false} render={<Link to="/">Home</Link>} />
      </EmptyContent>
    </Empty>
  )
}
