import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeString(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function simplifiedURL(url: string) {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function formatDate(
  date: ConstructorParameters<typeof Date>[0],
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  })
}

export function truncateString(str: string, size: number) {
  return `${str.slice(0, size)}...`
}

export function hasWhiteSpaces(str: string): boolean {
  return /\s/.test(str)
}

/**
 * Process items concurrently with controlled concurrency and error handling
 * @param items - Array of items to process
 * @param asyncFn - Async function to process each item
 * @param concurrency - Maximum number of concurrent operations (default: 4)
 * @returns Array of PromiseSettledResult in the same order as input items
 */
export async function processConcurrently<T, R>(
  items: T[],
  asyncFn: (item: T) => Promise<R>,
  concurrency = 4,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = []
  const executing: Promise<void>[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const promise = asyncFn(item)
      .then((result) => {
        results[i] = { status: 'fulfilled', value: result }
      })
      .catch((error) => {
        results[i] = { status: 'rejected', reason: error }
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

export function getAvatarFallback(userName: string): string {
  const fallback = `${userName.split(' ')[0].charAt(0)}${userName.split(' ')[1]?.charAt(0) ?? ''}`

  return fallback
}
