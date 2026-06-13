import type { Metadata } from 'next'
import Script from 'next/script'

const GROVE_BASE = 'https://grove-red.vercel.app'

export const metadata: Metadata = {
  title: 'Blog — Notes from the oven',
  description:
    'Field reports, build logs, prompt cheatsheets, and opinions about the future of design tooling from the Oven AI team.',
  alternates: { canonical: 'https://www.oveners.com/blog' },
  openGraph: {
    title: 'Oven AI Blog — Notes from the oven',
    description: 'Engineering posts, tutorials, product updates and design thinking from the Oven AI team.',
    url: 'https://www.oveners.com/blog',
  },
}

// The whole blog front end (featured card, search, genre filters, pagination)
// is rendered by Grove's embed. Cards link to our own /blog/[slug] pages
// (data-article-base) so articles stay server-rendered and SEO-credited to
// oveners.com. No list component to maintain.
export default function BlogPage() {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 96px' }}>
      <section style={{ textAlign: 'center', marginBottom: 36 }}>
        <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>◆ Blog</div>
        <h1 style={{ fontSize: 'clamp(40px, 5.2vw, 64px)', letterSpacing: '-0.035em', fontWeight: 600, lineHeight: 0.98, marginBottom: 18 }}>
          Notes from the <span className="serif" style={{ fontWeight: 400 }}>oven.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.5 }}>
          Field reports, build logs, prompt cheatsheets, and the occasional opinion about how the future of design tooling should feel.
        </p>
      </section>

      <div id="grove-blog" data-article-base="/blog" data-accent="#3B82F6" />
      <Script src={`${GROVE_BASE}/embed.js`} strategy="afterInteractive" />
    </main>
  )
}
