'use server'

import metascraper from 'metascraper'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperFavicon from 'metascraper-logo-favicon'
import metascraperTitle from 'metascraper-title'
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/lib/constants'
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

export async function getBookmarkMetadata(url: string): Promise<BookmarkMetadata> {
  try {
    new URL(url)
  } catch {
    return {
      title: url,
      description: '',
      image: undefined,
      favicon: undefined,
    }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BookmarkBot/1.0)',
      },
      redirect: 'follow',
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const metadata = await scraper({ html, url })

    return {
      title: truncate(metadata.title || url, TITLE_MAX_LENGTH),
      description: truncate(metadata.description || '', DESCRIPTION_MAX_LENGTH),
      image: metadata.image,
      favicon: metadata.logo,
    }
  } catch (error) {
    let message = 'unknown error'
    if (error instanceof Error) {
      message = error.message
    }
    console.error(`Failed to fetch metadata for ${url}: ${message}`)

    return {
      title: truncate(url, TITLE_MAX_LENGTH),
      description: '',
      image: undefined,
      favicon: undefined,
    }
  }
}

/**
 * Batch fetch metadata for multiple URLs with concurrency control
 * @param urls - Array of URLs to fetch metadata for
 * @param concurrency - Maximum number of concurrent requests (default: 10)
 * @returns Array of metadata in the same order as input URLs
 */
export async function getBookmarkMetadataBatch(
  urls: string[],
  concurrency = 10,
): Promise<BookmarkMetadata[]> {
  const results: BookmarkMetadata[] = []
  const executing: Promise<void>[] = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const promise = getBookmarkMetadata(url).then((metadata) => {
      results[i] = metadata
    })

    const wrapped = promise.then(() => {
      executing.splice(executing.indexOf(wrapped), 1)
    })

    executing.push(wrapped)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
    }
  }

  await Promise.all(executing)
  return results
}
