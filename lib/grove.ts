const GROVE_BASE = 'https://grove-red.vercel.app'
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
    const r = await fetch(
      `${GROVE_BASE}/api/embed/host/${SELF_HOST}?limit=24`,
      { next: { revalidate: 300 } }
    )
    if (!r.ok) return []
    const j = await r.json()
    return (j.posts ?? []) as GrovePost[]
  } catch {
    return []
  }
}
