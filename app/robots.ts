import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.oveners.com'

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
          // /main intentionally allowed: it's the generate page. Unauthenticated
          // users hitting it via Google are redirected to Clerk sign-in by
          // middleware, then bounced back to /main after auth.
          '/billing',
          '/success',
          '/feedback',
        ],
      },
      // Explicit allow for major LLM crawlers so Oven AI can be cited
      // in answers from ChatGPT, Perplexity, Claude, Gemini, etc.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
