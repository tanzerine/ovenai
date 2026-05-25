import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

function parseProgress(logs: string | null): number {
  if (!logs) return 0
  const matches = Array.from(logs.matchAll(/(\d+)%\|/g))
  return matches.length ? parseInt(matches[matches.length - 1][1]) : 0
}

function parseStep(logs: string | null): string {
  if (!logs) return 'Starting up…'
  const lines = logs.split('\n').filter(l => l.trim())
  const last = lines[lines.length - 1] || ''
  if (last.includes('%|')) {
    const m = last.match(/(\d+)%\|.*\|\s*(\d+)\/(\d+)/)
    if (m) return `Step ${m[2]} / ${m[3]}`
  }
  if (last.toLowerCase().includes('seed')) return 'Initializing model…'
  return last.slice(0, 60) || 'Processing…'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    const prediction = await replicate.predictions.get(id)
    const logs = prediction.logs ?? null

    if (prediction.status === 'succeeded') {
      const url = Array.isArray(prediction.output)
        ? prediction.output[0]
        : prediction.output as string
      return NextResponse.json({ status: 'completed', url, progress: 100, step: 'Done!' })
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      return NextResponse.json({ status: 'failed', error: String(prediction.error ?? 'Generation failed') })
    }

    return NextResponse.json({ status: 'processing', progress: parseProgress(logs), step: parseStep(logs) })
  } catch {
    return NextResponse.json({ status: 'failed', error: 'Failed to check prediction' }, { status: 500 })
  }
}
