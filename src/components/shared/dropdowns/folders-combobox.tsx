'use client'

import { IconReload, IconSearch, IconSelector } from '@tabler/icons-react'
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
import { foldersQueryOptions } from '@/tanstack-queries/folders'

const NULL_OPTION_LABEL = 'Select folder'

export type FoldersComboboxValue = string | null

interface FoldersComboboxProps
  extends Omit<React.ComponentProps<typeof Combobox>, 'multiple' | 'value' | 'defaultValue'> {
  value?: FoldersComboboxValue
  defaultValue?: FoldersComboboxValue
  includeNullOption?: boolean
}

export function FoldersCombobox({
  disabled,
  includeNullOption = true,
  ...comboboxProps
}: FoldersComboboxProps) {
  const { data: folders = [], isLoading, error, refetch } = useQuery(foldersQueryOptions())

  const items: FoldersComboboxValue[] = useMemo(() => {
    const mappedFolders: FoldersComboboxValue[] = folders.map((folder) => folder.id)

    if (includeNullOption) {
      mappedFolders.unshift(null)
    }

    return mappedFolders
  }, [folders, includeNullOption])

  if (error) {
    return (
      <Button variant="outline" onClick={() => refetch()} className="w-full justify-between font-normal">
        Error loading folders. Click to retry.
        <IconReload className="-me-1!" />
      </Button>
    )
  }

  function getFolderNameById(folderId: FoldersComboboxValue) {
    if (folderId === null) return NULL_OPTION_LABEL

    const folder = folders.find((f) => f.id === folderId)
    return folder ? folder.name : folderId
  }

  function renderValue(value: FoldersComboboxValue) {
    if (isLoading) {
      return <span className="animate-pulse italic">Loading folders...</span>
    }

    if (items.length === 0) {
      return <span className="text-muted-foreground">No folders available</span>
    }

    if (!value) return NULL_OPTION_LABEL

    return getFolderNameById(value)
  }

  return (
    <Combobox disabled={folders.length === 0 || disabled} items={items} {...comboboxProps}>
      <ComboboxTrigger render={<Button className="w-full justify-between font-normal" variant="outline" />}>
        <ComboboxValue>{renderValue}</ComboboxValue>
        <IconSelector className="-me-1!" />
      </ComboboxTrigger>
      <ComboboxPopup aria-label={NULL_OPTION_LABEL}>
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
        <ComboboxEmpty>No tags found.</ComboboxEmpty>
        <ComboboxList>
          {(folderId: string) => (
            <ComboboxItem key={folderId} value={folderId}>
              {getFolderNameById(folderId)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  )
}
