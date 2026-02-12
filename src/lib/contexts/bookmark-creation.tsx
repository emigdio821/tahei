'use client'

import type React from 'react'
import { createContext, useContext } from 'react'

interface BookmarkCreationContextValue {
  defaultFolderId?: string | null
  defaultTags?: string[]
  defaultIsFavorite?: boolean
  hiddenFields?: {
    folder?: boolean
    tags?: boolean
    isFavorite?: boolean
  }
}

const BookmarkCreationContext = createContext<BookmarkCreationContextValue | undefined>(undefined)

interface BookmarkCreationProviderProps {
  children: React.ReactNode
  value: BookmarkCreationContextValue
}

export function BookmarkCreationProvider({ children, value = {} }: BookmarkCreationProviderProps) {
  return <BookmarkCreationContext.Provider value={value}>{children}</BookmarkCreationContext.Provider>
}

export function useBookmarkCreationContext() {
  const context = useContext(BookmarkCreationContext)

  return context ?? {}
}
