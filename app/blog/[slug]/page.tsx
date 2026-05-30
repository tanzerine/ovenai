import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { POSTS } from '@/lib/blog-posts'

/* ── Metadata ────────────────────────────────────────── */
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = POSTS.find(p => p.slug === params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://www.oveners.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.oveners.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: [post.topic, '3D icons', 'Oven AI'],
    },
  }
}

export function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }))
}

/* ── Page ────────────────────────────────────────────── */
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Oven AI',
      url: 'https://www.oveners.com',
    },
    datePublished: post.date,
    url: `https://www.oveners.com/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 120px' }}>
        {/* Back */}
        <Link
          href="/blog"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', marginBottom: 40, textDecoration: 'none' }}
        >
          ← All posts
        </Link>

        {/* Topic + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--muted)', marginBottom: 20 }}>
          <span style={{ color: 'var(--blue)', fontWeight: 600, background: 'var(--blue-soft)', padding: '3px 10px', borderRadius: 100, fontSize: 11 }}>
            {post.topic}
          </span>
          <span>{post.date}</span>
          <span style={{ color: 'var(--muted-2)' }}>·</span>
          <span>{post.read} read</span>
          <span style={{ color: 'var(--muted-2)' }}>·</span>
          <span>{post.author}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.1, marginBottom: 20 }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        <p style={{ fontSize: 18, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 40, borderBottom: '1px solid var(--line)', paddingBottom: 32 }}>
          {post.excerpt}
        </p>

        {/* Cover image */}
        <div style={{ background: post.bg, borderRadius: 20, padding: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, minHeight: 220 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            style={{ width: '40%', maxWidth: 200, objectFit: 'contain', filter: 'drop-shadow(0 16px 32px rgba(20,30,80,0.18))' }}
          />
        </div>

        {/* Body */}
        <div style={{ fontSize: 16.5, lineHeight: 1.75, color: 'var(--ink-2)' }}>
          {post.body.split('\n\n').map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return (
                <h2 key={i} style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 36, marginBottom: 12, color: 'var(--ink)' }}>
                  {para.slice(2, -2)}
                </h2>
              )
            }
            if (para.startsWith('*') && para.includes('\n')) {
              return (
                <ul key={i} style={{ paddingLeft: 20, marginBottom: 20 }}>
                  {para.split('\n').map((line, j) => (
                    <li key={j} style={{ marginBottom: 6 }}>{line.replace(/^\*\s*/, '')}</li>
                  ))}
                </ul>
              )
            }
            return (
              <p key={i} style={{ marginBottom: 20 }}>
                {para.replace(/\*\*(.*?)\*\*/g, '$1')}
              </p>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/blog" style={{ fontSize: 14, color: 'var(--blue)', fontWeight: 500, textDecoration: 'none' }}>
            ← Back to blog
          </Link>
          <Link href="/main" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'var(--ink)', color: 'white', borderRadius: 100, fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
            Try Oven AI →
          </Link>
        </div>
      </div>
    </>
  )
}
