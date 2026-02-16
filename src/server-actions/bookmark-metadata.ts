'use server'

import metascraper from 'metascraper'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperFavicon from 'metascraper-logo-favicon'
import metascraperTitle from 'metascraper-title'
import { BOOKMARK_NAME_MAX_LENGTH, DESCRIPTION_MAX_LENGTH } from '@/lib/constants'
import { truncateString } from '@/lib/utils'

export interface BookmarkMetadata {
  title: string
  description: string
  image?: string
  favicon?: string
}

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage(),
  metascraperFavicon(),
])

function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? truncateString(text, maxLength - 3) : text
}

export async function getBookmarkMetadata(url: string, timeoutMs = 3000): Promise<BookmarkMetadata> {
  try {
    new URL(url)
  } catch {
    return {
      title: truncate(url, BOOKMARK_NAME_MAX_LENGTH),
      description: '',
      image: undefined,
      favicon: undefined,
    }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BookmarkBot/1.0)',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const metadata = await scraper({ html, url })

    return {
      title: truncate(metadata.title || url, BOOKMARK_NAME_MAX_LENGTH),
      description: truncate(metadata.description || '', DESCRIPTION_MAX_LENGTH),
      image: metadata.image,
      favicon: metadata.logo,
    }
  } catch (error) {
    console.error(`Metadata failed for ${url}:`, error)

    return {
      title: truncate(url, BOOKMARK_NAME_MAX_LENGTH),
      description: '',
      image: undefined,
      favicon: undefined,
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
