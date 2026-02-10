import metascraper from 'metascraper'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperFavicon from 'metascraper-logo-favicon'
import metascraperTitle from 'metascraper-title'
import { truncateString } from '@/lib/utils'

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage(),
  metascraperFavicon(),
])

function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? truncateString(text, maxLength - 3) : text
}

export async function getBookmarkMetadata(url: string) {
  const response = await fetch(url)
  const html = await response.text()

  const metadata = await scraper({ html, url })

  return {
    title: truncate(metadata.title || url, 100),
    description: truncate(metadata.description || '', 200),
    image: metadata.image,
    favicon: metadata.logo,
  }
}
