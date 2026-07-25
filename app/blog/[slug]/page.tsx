import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import Link from 'next/link'
import GroveTracker from '@/components/blog/GroveTracker'

// trygroveai.com is grove's live origin (grove-red.vercel.app is a stale
// deployment alias that could disappear on any cleanup).
const GROVE_BASE = 'https://trygroveai.com'
const SELF_HOST = 'www.oveners.com'

type Article = {
  post_id?: string | null
  domain_id?: string | null
  slug: string
  title: string
  meta_title: string
  meta_description: string
  body_md: string
  published_at: string
  cover_image_url: string | null
  cover_image_credit: { name: string } | null
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
    },
  }
}

marked.setOptions({ gfm: true, breaks: false })

export default async function BlogArticle({ params }: { params: { slug: string } }) {
  const article = await fetchArticle(params.slug)
  if (!article) notFound()

  const html = marked.parse(article.body_md ?? '', { async: false }) as string
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>
      <GroveTracker postId={article.post_id} domainId={article.domain_id} />
      <Link href="/blog" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
        ← All articles
      </Link>

      <header style={{ marginTop: 24, marginBottom: 32 }}>
        <h1 style={{ fontSize: 'clamp(28px, 4.2vw, 44px)', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
          {article.title}
        </h1>
        {date && (
          <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em' }}>
            {date}
          </div>
        )}
      </header>

      <article
        className="grove-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style>{`
        .grove-prose { font-size: 17px; line-height: 1.75; color: var(--ink); }
        .grove-prose > * + * { margin-top: 1.1em; }
        .grove-prose h1, .grove-prose h2, .grove-prose h3 {
          font-weight: 600; line-height: 1.2; letter-spacing: -0.015em;
          margin-top: 2em; margin-bottom: 0.5em;
        }
        .grove-prose h2 { font-size: 1.7em; padding-bottom: 0.25em; border-bottom: 1px solid var(--line); }
        .grove-prose h3 { font-size: 1.3em; }
        .grove-prose p { margin: 0 0 1em; }
        .grove-prose a { color: var(--blue); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
        .grove-prose ul, .grove-prose ol { padding-left: 1.6em; margin: 0.5em 0 1em; }
        .grove-prose li { margin: 0.4em 0; }
        .grove-prose blockquote {
          margin: 1.3em 0; padding: 0.5em 0 0.5em 1.1em;
          border-left: 3px solid var(--blue); background: rgba(0,0,0,0.02);
          color: var(--ink); font-style: italic; border-radius: 0 8px 8px 0;
        }
        .grove-prose code { background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 0.9em; }
        .grove-prose pre { background: #1a1a1a; color: #f6f4ee; padding: 16px; border-radius: 10px; overflow-x: auto; }
        .grove-prose pre code { background: transparent; padding: 0; }
        .grove-prose hr { border: none; border-top: 1px dashed var(--line); margin: 2.2em auto; width: 60%; }
        .grove-prose table { width: 100%; border-collapse: collapse; margin: 1.4em 0; font-size: 15px; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
        .grove-prose th, .grove-prose td { padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--line); }
        .grove-prose th { background: rgba(0,0,0,0.03); font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
        .grove-prose img { width: 100%; height: auto; border-radius: 14px; display: block; margin: 1.6em 0; }
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
