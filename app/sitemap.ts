import { MetadataRoute } from 'next'
import { fetchGrovePosts } from '@/lib/grove'

const BASE = 'https://www.oveners.com'

// Rebuilt hourly so a freshly published grove article reaches Google's next
// sitemap fetch without a redeploy.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchGrovePosts()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/library`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/feedback`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const articles: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...articles]
}
