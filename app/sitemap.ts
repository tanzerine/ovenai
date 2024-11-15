// app/sitemap.ts
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://oveners.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://oveners.com/payment', // billing 페이지
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://oveners.com/landing',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // 다른 페이지들도 추가
  ]
}