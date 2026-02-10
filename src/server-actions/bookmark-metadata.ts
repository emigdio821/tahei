import metascraper from 'metascraper'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperFavicon from 'metascraper-logo-favicon'
import metascraperTitle from 'metascraper-title'

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage(),
  metascraperFavicon(),
])

export async function getBookmarkMetadata(url: string) {
  const response = await fetch(url)
  const html = await response.text()

  const metadata = await scraper({ html, url })

  return {
    title: metadata.title,
    description: metadata.description,
    image: metadata.image,
    favicon: metadata.logo,
  }
}
