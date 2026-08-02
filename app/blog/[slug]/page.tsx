import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import Link from 'next/link'

// trygroveai.com is grove's live origin (grove-red.vercel.app is a stale
// deployment alias that could disappear on any cleanup).
const GROVE_BASE = 'https://trygroveai.com'
const SELF_HOST = 'www.oveners.com'

type Related = {
  slug: string
  title: string
  meta_description: string | null
  cover_image_url: string | null
  published_at: string | null
}

type Article = {
  slug: string
  title: string
  meta_title: string
  meta_description: string
  // Grove returns the SAME article in three shapes. `html` is the recommended
  // one: a self-contained two-column layout — body left, sticky table-of-
  // contents rail right, CTA below — with its own scoped <style>. `body_md` is
  // the fallback for consumers that only render markdown; it carries a
  // full-width TOC card and the CTA inline instead of the rail. This page used
  // to render body_md, which is why it had a boxy TOC and no sidebar while
  // grove's own copy of the same post had one.
  html: string | null
  body_md: string
  published_at: string
  cover_image_url: string | null
  cover_image_credit: { name: string } | null
  genre: string | null
  author: string | null
  related: Related[] | null
  // grove returns these so THIS page can fire the read beacon — grove's
  // strategy loop (what to write next month) steers on reads/dwell, and
  // without the beacon every reader on oveners.com is invisible to it.
  post_id: string
  domain_id: string
}

async function fetchArticle(slug: string): Promise<Article | null> {
  try {
    const r = await fetch(
      `${GROVE_BASE}/api/embed/host/${SELF_HOST}/article/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } }
    )
    if (!r.ok) return null
    const j = await r.json()
    return j.article
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await fetchArticle(params.slug)
  if (!article) return {}
  // blog.oveners.com is the canonical home of every article — grove serves it
  // there with the full SEO stack (Article JSON-LD, internal links, sitemap,
  // robots, llms.txt). This page stays up for site visitors but defers its
  // search equity to the subdomain, so the two copies never compete on Google.
  const url = `https://blog.oveners.com/${params.slug}`
  return {
    title: article.meta_title || article.title,
    description: article.meta_description,
    alternates: { canonical: url },
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description,
      url,
      type: 'article',
      publishedTime: article.published_at,
      images: article.cover_image_url ? [article.cover_image_url] : undefined,
    },
  }
}

marked.setOptions({ gfm: true, breaks: false })

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

/**
 * Grove ships the article typography it writes — same stylesheet embed.js
 * links on every customer site, themeable through the --gv-* properties mapped
 * below. This page used to maintain a hand-rolled fork of it, which is why the
 * same article read differently here than on blog.oveners.com: the fork was
 * missing the measure cap, the lead paragraph, the list marker colors and the
 * image captions.
 *
 * Fetched server-side and inlined rather than <link>ed, for two reasons: this
 * is React 18 / Next 14, where a <link> rendered in a page component isn't
 * hoisted to <head> and flashes unstyled; and inlining removes a blocking
 * cross-origin request on a page that has already paid for one round trip to
 * grove. It shares the article's 5-minute ISR window, so grove retuning its
 * typography reaches this page on its own.
 */
async function fetchArticleCss(): Promise<string> {
  try {
    const r = await fetch(`${GROVE_BASE}/article.css`, { next: { revalidate: 300 } })
    return r.ok ? await r.text() : ''
  } catch {
    return ''
  }
}

export default async function BlogArticle({ params }: { params: { slug: string } }) {
  const [article, articleCss] = await Promise.all([fetchArticle(params.slug), fetchArticleCss()])
  if (!article) notFound()

  // Prefer grove's rendered two-column HTML. The markdown fallback only runs if
  // a cached response predates the `html` field — it's wrapped in the same
  // .grv-body element grove uses so ONE set of prose rules styles both.
  const inner = article.html
    ? article.html
    : `<div class="grv-body">${marked.parse(article.body_md ?? '', { async: false }) as string}</div>`
  const related = article.related ?? []

  return (
    <main className="blog-article">
      {/* Grove's article typography, verbatim. Ahead of the page's own <style>
          so the local rules below (anchor offset, rail breakpoint) win on ties. */}
      {articleCss && <style dangerouslySetInnerHTML={{ __html: articleCss }} />}

      <Link href="/blog" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
        ← All articles
      </Link>

      <header style={{ marginTop: 24, marginBottom: 28, maxWidth: 760 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <span style={{ color: 'var(--blue)', fontWeight: 600, background: 'var(--blue-soft)', padding: '3px 10px', borderRadius: 100, fontSize: 11 }}>
            {article.genre || 'Article'}
          </span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em' }}>
            {article.author ? `By ${article.author} · ` : ''}{fmtDate(article.published_at)}
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4.2vw, 44px)', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0 }}>
          {article.title}
        </h1>
      </header>

      {article.cover_image_url && (
        <figure style={{ margin: '0 0 34px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.cover_image_url} alt="" style={{ width: '100%', height: 'auto', borderRadius: 16, display: 'block' }} />
          {article.cover_image_credit?.name && (
            <figcaption style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 8 }}>
              Photo: {article.cover_image_credit.name}
            </figcaption>
          )}
        </figure>
      )}

      {/* grove's html brings the TOC rail and the CTA with it — don't add either
          here, or the page ships two of each. */}
      <div className="grove-article" dangerouslySetInnerHTML={{ __html: inner }} />

      {related.length > 0 && (
        <section style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--line)' }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 18 }}>
            Keep reading
          </div>
          <div className="blog-related">
            {related.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                {rp.cover_image_url && (
                  <div style={{ height: 116, background: `url(${rp.cover_image_url}) center / cover no-repeat` }} />
                )}
                <div style={{ padding: '14px 16px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 6 }}>{rp.title}</div>
                  {rp.meta_description && (
                    <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {rp.meta_description}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        /* Wide enough for grove's two-column grid: it collapses to one column
           under 820px of VIEWPORT, so a 720px shell would have squeezed the
           body into ~430px next to the rail on every desktop. */
        .blog-article { max-width: 1060px; margin: 0 auto; padding: 60px 24px 80px; }

        /* Grove's markup themes itself through --gv-* custom properties, with
           its own neutrals only as fallbacks. Mapping them onto Oven's tokens
           here is the supported way to make the TOC rail and CTA look native —
           no overriding of grove's selectors, so upstream changes still land. */
        .grove-article {
          --gv-ink: var(--ink);
          --gv-muted: var(--muted);
          --gv-line: var(--line);
          --gv-surface: var(--card);
          /* --ga-paper (block quotes, table headers, figure captions) chains off
             this one. The article sits directly on --bg, so a raised block has
             to be lighter than the page, not the same grey. */
          --gv-raise: var(--card);
          --gv-accent: var(--blue);
          /* Code blocks invert against the page; grove's default is its own dark
             green, which would be the one un-Oven thing on the page. */
          --gv-code-bg: var(--ink);
          --gv-code-ink: #f6f7f9;
          --gv-radius: 14px;
          --gv-label-font: var(--font-geist-mono), ui-monospace, monospace;
        }

        /* The prose itself is grove's stylesheet, inlined above — nothing about
           the article body is restated here. The one addition is an anchor
           offset, because the TOC rail links to in-page headings and grove has
           no way to know how tall this site's sticky nav is. */
        .grove-article .grv-body :is(h1, h2, h3, h4) { scroll-margin-top: 90px; }

        .blog-related { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        /* Grove drops its rail at 820px of viewport, which assumes the html sits
           in a full-width container. It doesn't here — this shell caps at 1060,
           so between 820 and 1000 the 240px rail was leaving the body under
           550px. The container width is the host page's knowledge, so the
           threshold belongs here; grove's own chrome is left untouched. */
        @media (max-width: 1000px) {
          .grove-article .grv-wrap { grid-template-columns: minmax(0, 1fr) !important; }
          .grove-article .grv-toc { display: none; }
          /* Once the rail is gone the shell has to come back in with it —
             otherwise the body inherits the full 1060 and the line length runs
             to ~90 characters, which reads worse than the narrow column did. */
          .blog-article { max-width: 780px; }
        }
        @media (max-width: 820px) {
          .blog-related { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* First-party read beacon → grove's analytics (same event shape as the
          grove-hosted blog: view / dwell / scroll / exit, per-tab session id,
          server-side bot filtering + dedupe). Grove's monthly strategy loop
          steers on these reads — without this, visitors here are invisible. */}
      <script dangerouslySetInnerHTML={{ __html: trackerScript(article.post_id, article.domain_id) }} />
    </main>
  )
}

function trackerScript(postId: string, domainId: string): string {
  const endpoint = `${GROVE_BASE}/api/track`
  return `(function(){
try{
var s=sessionStorage.getItem('g_sid');
if(!s){s=Math.random().toString(36).slice(2)+Date.now().toString(36);sessionStorage.setItem('g_sid',s);}
var u=new URL(location.href);
var utm={utm_source:u.searchParams.get('utm_source')||undefined,utm_medium:u.searchParams.get('utm_medium')||undefined,utm_campaign:u.searchParams.get('utm_campaign')||undefined};
var post=function(extra){
  try{
    var body=JSON.stringify(Object.assign({post_id:${JSON.stringify(postId)},domain_id:${JSON.stringify(domainId)},session_id:s,referrer:document.referrer||undefined},utm,extra));
    if(navigator.sendBeacon){navigator.sendBeacon(${JSON.stringify(endpoint)},new Blob([body],{type:'application/json'}));}
    else{fetch(${JSON.stringify(endpoint)},{method:'POST',headers:{'content-type':'application/json'},body:body,keepalive:true}).catch(function(){});}
  }catch(e){}
};
post({type:'view'});
var dwell=0,active=true,sentDepths={};
document.addEventListener('visibilitychange',function(){active=document.visibilityState==='visible';});
setInterval(function(){if(active){dwell+=15000;post({type:'dwell',dwell_ms:dwell});}},15000);
window.addEventListener('scroll',function(){
  var h=document.documentElement;var max=(h.scrollTop+h.clientHeight)/h.scrollHeight*100;
  [25,50,75,100].forEach(function(d){if(max>=d&&!sentDepths[d]){sentDepths[d]=1;post({type:'scroll',scroll_depth:d});}});
},{passive:true});
window.addEventListener('pagehide',function(){post({type:'exit',dwell_ms:dwell});});
}catch(e){}})();`
}

// The CTA that used to be appended here now arrives inside grove's `html`
// (branded with the customer's palette and pointing at domains.cta_url), so
// there is deliberately no second "Try Oven AI" box in this file.
