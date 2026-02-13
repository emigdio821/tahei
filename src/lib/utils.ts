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
