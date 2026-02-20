import { IconReload, IconSearch, IconSelector } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import type React from 'react'
import { useMemo } from 'react'
import { tagsQueryOptions } from '@/api/tanstack-queries/tags'
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

export type TagsComboboxValue = string[] | null

interface TagsComboboxProps
  extends Omit<React.ComponentProps<typeof Combobox>, 'multiple' | 'value' | 'defaultValue'> {
  value?: TagsComboboxValue
  defaultValue?: TagsComboboxValue
}

export function TagsMultiCombobox({ disabled, ...comboboxProps }: TagsComboboxProps) {
  const { data: tags = [], isLoading, error, refetch } = useQuery(tagsQueryOptions())

  const items: string[] = useMemo(() => {
    const mappedTags = tags.map((tag) => tag.id)

    return mappedTags
  }, [tags])

  if (error) {
    return (
      <Button variant="outline" onClick={() => refetch()} className="w-full justify-between font-normal">
        Error loading tags. Click to retry.
        <IconReload className="-me-1!" />
      </Button>
    )
  }

  function getTagNameById(tagId: string) {
    const tag = tags.find((t) => t.id === tagId)
    return tag ? tag.name : tagId
  }

  function renderValue(value: TagsComboboxValue) {
    if (isLoading) {
      return <span className="animate-pulse italic">Loading tags...</span>
    }

    if (items.length === 0) {
      return <span className="text-muted-foreground">No tags available</span>
    }

    if (!value) return 'Select tags'

    if (value.length === 0) return 'Select tags'
    if (value.length === 1) return getTagNameById(value[0])

    return `${value.length} tags selected`
  }

  return (
    <Combobox disabled={tags.length === 0 || disabled} multiple items={items} {...comboboxProps}>
      <ComboboxTrigger render={<Button className="w-full justify-between font-normal" variant="outline" />}>
        <ComboboxValue>{renderValue}</ComboboxValue>
        <IconSelector className="-me-1!" />
      </ComboboxTrigger>
      <ComboboxPopup aria-label="Select tags">
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
          {(tagId: string) => (
            <ComboboxItem key={tagId} value={tagId}>
              {getTagNameById(tagId)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  )
}
