'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { tagsQueryOptions } from '@/tanstack-queries/tags'
import { TagsActionsCtxMenu } from '../tags/actions-context-menu'
import { CreateTagDialog } from '../tags/dialogs/create'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '../ui/empty'
import { Separator } from '../ui/separator'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, useSidebar } from '../ui/sidebar'
import { Skeleton } from '../ui/skeleton'

export function NavTags({ ...props }: React.ComponentProps<typeof SidebarGroup>) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false)

  const { data: tags = [], isLoading, error, refetch } = useQuery(tagsQueryOptions())

  function renderTags() {
    if (error) {
      return (
        <Empty className="gap-2 rounded-xl bg-muted/50 p-2 md:p-2">
          <EmptyHeader>
            <EmptyTitle className="text-sm">Error</EmptyTitle>
            <EmptyDescription className="text-xs">
              Something went wrong while fetching your tags.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" className="w-full" size="xs" onClick={() => refetch()}>
              Retry
            </Button>
          </EmptyContent>
        </Empty>
      )
    }

    if (isLoading) {
      const widths = ['w-12', 'w-14', 'w-10', 'w-11', 'w-13', 'w-10']
      return Array.from({ length: 8 }).map((_, index) => {
        const width = widths[index % widths.length]
        return <Skeleton key={crypto.randomUUID()} className={`h-4.5 ${width}`} />
      })
    }

    if (tags.length === 0) {
      return (
        <>
          <CreateTagDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />

          <Empty className="gap-2 rounded-xl bg-muted/50 p-2 md:p-2">
            <EmptyHeader>
              <EmptyTitle className="text-sm">Empty</EmptyTitle>
              <EmptyDescription className="text-xs">There are no tags yet.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                size="xs"
                variant="outline"
                className="w-full"
                onClick={() => setCreateDialogOpen(true)}
              >
                Create
              </Button>
            </EmptyContent>
          </Empty>
        </>
      )
    }

    const tagsToRender = (
      <>
        {tags.map((tag) => {
          const href: `/tags/${string}` = `/tags/${tag.id}`
          const isActive = pathname === href

          return (
            <TagsActionsCtxMenu
              key={tag.id}
              tag={tag}
              trigger={
                <Badge
                  key={tag.id}
                  className="gap-0.5"
                  variant={isActive ? 'default' : 'outline'}
                  render={
                    isActive ? (
                      <div>
                        <span className="cursor-default text-xs">{tag.name}</span>
                        {tag.bookmarkCount > 0 && (
                          <>
                            <Separator orientation="vertical" />
                            <span className="tabular-nums">
                              <div>{tag.bookmarkCount}</div>
                            </span>
                          </>
                        )}
                      </div>
                    ) : (
                      <Link className="text-xs" onClick={() => setOpenMobile(false)} href={href}>
                        <span className="text-xs">{tag.name}</span>
                        {tag.bookmarkCount > 0 && (
                          <>
                            <Separator orientation="vertical" />
                            <span className="tabular-nums">
                              <div>{tag.bookmarkCount}</div>
                            </span>
                          </>
                        )}
                      </Link>
                    )
                  }
                />
              }
            />
          )
        })}
      </>
    )

    return tagsToRender
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Tags</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <div className="flex flex-wrap gap-2 p-2">{renderTags()}</div>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
