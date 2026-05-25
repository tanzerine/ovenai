import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/_vercel/',
          '/main',
        ],
      },
    ],
    sitemap: 'https://www.oveners.com/sitemap.xml',
    host: 'https://www.oveners.com',
  }
}
