// app/robots.ts
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // API 경로 차단
          '/admin/', // 관리자 페이지 차단
          '/_next/', // Next.js 내부 경로 차단
          '/_vercel/', // Vercel 내부 경로 차단
        ],
      },
    ],
    sitemap: 'https://oveners.com/sitemap.xml', // 사이트맵 위치
    host: 'https://oveners.com', // 호스트 도메인 추가
  }
}