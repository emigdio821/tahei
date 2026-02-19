import { SITE_CONFIG } from './config'

interface SEOOptions {
  title?: string
  description?: string
  image?: string
  url?: string
  noIndex?: boolean
}

export function createSEOTitle(title?: string, includeBase = true) {
  if (!title) {
    return SITE_CONFIG.title
  }

  return includeBase ? `${title} · ${SITE_CONFIG.title}` : title
}

export function createSEOMeta(options?: SEOOptions) {
  const title = createSEOTitle(options?.title)
  const description = options?.description || SITE_CONFIG.description
  const image = options?.image || SITE_CONFIG.ogTwitter.image
  const url = options?.url || SITE_CONFIG.url

  return [
    { charSet: 'utf-8' },
    {
      name: 'creator',
      content: 'Emigdio Torres',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
    },
    { title },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'theme-color',
      media: '(prefers-color-scheme: light)',
      content: '#ffffff',
    },
    {
      name: 'theme-color',
      media: '(prefers-color-scheme: dark)',
      content: '#171717',
    },
    { name: 'keywords', content: SITE_CONFIG.keywords.join(',') },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:creator',
      content: '@emigdio821',
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:image',
      content: image,
    },
    // Open Graph
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:url',
      content: url,
    },
    {
      property: 'og:site_name',
      content: SITE_CONFIG.og.siteName,
    },
    {
      property: 'og:locale',
      content: SITE_CONFIG.og.locale,
    },
    {
      property: 'og:type',
      content: SITE_CONFIG.og.type,
    },
    {
      property: 'og:image',
      content: image,
    },
    // Robots
    ...(options?.noIndex
      ? [
          {
            name: 'robots',
            content: 'noindex, nofollow',
          },
        ]
      : []),
  ]
}
