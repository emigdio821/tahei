import { IconRefresh } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { loggedUserQueryOptions } from '@/api/tanstack-queries/logged-user'
import { getAvatarFallback } from '@/lib/utils'
import { UpdatePasswordDialog } from '../shared/update-password-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Frame, FrameDescription, FrameHeader, FrameTitle } from '../ui/frame'
import { Skeleton } from '../ui/skeleton'

export function ProfileSettings() {
  const [isUpdatePassDialogOpen, setUpdatePassDialogOpen] = useState(false)
  const { data: user, isLoading, error, refetch } = useQuery(loggedUserQueryOptions())

  function renderProfile() {
    if (isLoading) {
      return (
        <div className="flex h-12 items-center gap-2">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-5 w-1/6" />
            <Skeleton className="h-3 w-2/9" />
          </div>
        </div>
      )
    } else if (error || !user) {
      return (
        <div className="flex h-12 items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} size="lg">
            Refetch profile
            <IconRefresh className="ml-auto size-4" />
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <Avatar className="size-12">
          <AvatarImage src={user.image || ''} alt={user.name} />
          <AvatarFallback>{getAvatarFallback(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-base">{user.name}</p>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <UpdatePasswordDialog open={isUpdatePassDialogOpen} onOpenChange={setUpdatePassDialogOpen} />

      <Frame>
        <FrameHeader>
          <FrameTitle>Profile</FrameTitle>
          <FrameDescription>Update your profile information.</FrameDescription>
        </FrameHeader>
        <Card>
          <CardContent>{renderProfile()}</CardContent>
          <CardFooter>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full sm:w-auto"
              onClick={() => setUpdatePassDialogOpen(true)}
            >
              Update password
            </Button>
          </CardFooter>
        </Card>
      </Frame>
    </>
  )
}
