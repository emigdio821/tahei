'use server'

import metascraper from 'metascraper'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperFavicon from 'metascraper-logo-favicon'
import metascraperTitle from 'metascraper-title'
import puppeteer, { type Browser } from 'puppeteer'
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

export async function getBookmarkMetadata(url: string): Promise<BookmarkMetadata> {
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

  let browser: Browser | undefined

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
    })

    const page = await browser.newPage()

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    )
    await page.setViewport({ width: 1920, height: 1080 })

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false })
    })

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 15000,
    })

    const html = await page.content()
    const metadata = await scraper({ html, url })

    return {
      title: truncate(metadata.title || metadata.ogTitle || url, BOOKMARK_NAME_MAX_LENGTH),
      description: truncate(metadata.description || '', DESCRIPTION_MAX_LENGTH),
      image: metadata.image || undefined,
      favicon: metadata.logo || undefined,
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
    if (browser) {
      await browser.close()
    }
  }
}
