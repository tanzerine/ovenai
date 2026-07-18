// trygroveai.com is grove's live origin (grove-red.vercel.app is a stale
// deployment alias that 404s, which silently emptied the blog list).
const GROVE_BASE = 'https://trygroveai.com'
const SELF_HOST = 'oveners.com'

export type GrovePost = {
  slug: string
  title: string
  excerpt: string
  url: string
  date: string | null
  cover_image_url: string | null
  cover_image_credit: { name: string } | null
  read_minutes: number
  genre: string | null
  author: string | null
}

export async function fetchGrovePosts(): Promise<GrovePost[]> {
  try {
    const all: GrovePost[] = []
    let page = 1
    while (page <= 10) {
      const r = await fetch(
        `${GROVE_BASE}/api/embed/host/${SELF_HOST}?limit=24&page=${page}`,
        { next: { revalidate: 300 } }
      )
      if (!r.ok) break
      const j = await r.json()
      all.push(...((j.posts ?? []) as GrovePost[]))
      if (page >= (j.pages ?? 1)) break
      page++
    }
    return all
  } catch {
    return []
  }
}
