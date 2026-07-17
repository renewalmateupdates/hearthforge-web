import { MetadataRoute } from 'next'

const BASE_URL = 'https://raidreadylabs.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/products`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/about`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/blog`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/portfolio`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/faq`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/contact`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/privacy`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${BASE_URL}/terms`, priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  return staticPages.map((page) => ({
    url: page.url,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
