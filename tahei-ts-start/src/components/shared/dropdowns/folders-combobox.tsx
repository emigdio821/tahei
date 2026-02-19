'use client'

import { IconChevronRight, IconReload, IconSearch, IconSelector } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import type React from 'react'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from '@/components/ui/combobox'
import type { FolderTreeNode } from '@/server-actions/folders'
import { foldersQueryOptions } from '@/tanstack-queries/folders'

const NULL_OPTION_LABEL = 'Select folder'

export type FoldersComboboxValue = string | null

interface FoldersComboboxProps
  extends Omit<React.ComponentProps<typeof Combobox>, 'multiple' | 'value' | 'defaultValue'> {
  value?: FoldersComboboxValue
  defaultValue?: FoldersComboboxValue
  includeNullOption?: boolean
  excludeOptions?: FoldersComboboxValue[]
}

interface FlatFolder {
  id: string
  name: string
  path: string[]
}

function flattenFolders(folders: FolderTreeNode[], parentPath: string[] = []): FlatFolder[] {
  const flattened: FlatFolder[] = []

  for (const folder of folders) {
    const currentPath = [...parentPath, folder.name]

    flattened.push({
      id: folder.id,
      name: folder.name,
      path: parentPath,
    })

    if (folder.subfolders.length > 0) {
      flattened.push(...flattenFolders(folder.subfolders, currentPath))
    }
  }

  return flattened
}

function buildFolderDisplayName(folder: FlatFolder): React.ReactNode {
  if (folder.path.length === 0) {
    return folder.name
  }

  if (folder.path.length === 1) {
    return (
      <span className="flex items-center gap-1 truncate">
        <span className="text-muted-foreground text-xs">{folder.path[0]}</span>
        <IconChevronRight className="size-3 text-muted-foreground" />
        <span className="text-sm">{folder.name}</span>
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1">
      <span className="text-muted-foreground text-xs">{folder.path[0]}</span>
      <IconChevronRight className="size-3 text-muted-foreground" />
      <span className="text-muted-foreground text-xs">...</span>
      <IconChevronRight className="size-3 text-muted-foreground" />
      <span className="text-sm">{folder.name}</span>
    </span>
  )
}

export function FoldersCombobox({
  disabled,
  includeNullOption = true,
  excludeOptions = [],
  ...comboboxProps
}: FoldersComboboxProps) {
  const { data: folderTree = [], isLoading, error, refetch } = useQuery(foldersQueryOptions())

  const flatFolders = useMemo(() => flattenFolders(folderTree), [folderTree])

  const items: FoldersComboboxValue[] = useMemo(() => {
    const mappedFolders: FoldersComboboxValue[] = flatFolders.map((folder) => folder.id)
    let foldersToInclude = mappedFolders

    if (excludeOptions.length > 0) {
      foldersToInclude = mappedFolders.filter((id) => !excludeOptions.includes(id))
    }

    if (includeNullOption && foldersToInclude.length > 0) {
      foldersToInclude.unshift(null)
    }

    return foldersToInclude
  }, [flatFolders, includeNullOption, excludeOptions])

  if (error) {
    return (
      <Button variant="outline" onClick={() => refetch()} className="w-full justify-between font-normal">
        Error loading folders. Click to retry.
        <IconReload className="-me-1!" />
      </Button>
    )
  }

  function getFolderDisplayById(folderId: FoldersComboboxValue) {
    if (folderId === null) return NULL_OPTION_LABEL

    const folder = flatFolders.find((f) => f.id === folderId)
    return folder ? buildFolderDisplayName(folder) : folderId
  }

  function renderValue(value: FoldersComboboxValue) {
    if (isLoading) {
      return <span className="animate-pulse italic">Loading folders...</span>
    }

    if (items.length === 0) {
      return <span className="text-muted-foreground">No folders available</span>
    }

    if (!value) return NULL_OPTION_LABEL

    return getFolderDisplayById(value)
  }

  return (
    <Combobox disabled={items.length === 0 || disabled} items={items} {...comboboxProps}>
      <ComboboxTrigger render={<Button className="w-full justify-between font-normal" variant="outline" />}>
        <ComboboxValue>{renderValue}</ComboboxValue>
        <IconSelector className="-me-1!" />
      </ComboboxTrigger>
      <ComboboxPopup aria-label={NULL_OPTION_LABEL} className="max-w-(--anchor-width)">
        {items.length > 15 && (
          <div className="border-b p-2">
            <ComboboxInput
              placeholder="Search"
              showTrigger={false}
              startAddon={<IconSearch />}
              className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
            />
          </div>
        )}
        <ComboboxEmpty>No folders found.</ComboboxEmpty>
        <ComboboxList>
          {(folderId: string) => (
            <ComboboxItem key={folderId} value={folderId}>
              {getFolderDisplayById(folderId)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  )
}
