import { NextRequest } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

// Parse the last progress % from Replicate's tqdm log lines
// e.g. " 42%|████▎     | 12/28 [00:02<00:02,  6.1it/s]"
function parseProgress(logs: string | null): number {
  if (!logs) return 0
  const matches = Array.from(logs.matchAll(/(\d+)%\|/g))
  return matches.length ? parseInt(matches[matches.length - 1][1]) : 0
}

// Return a short human-readable status line from the latest log line
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

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return new Response('Missing id', { status: 400 })

  const encoder = new TextEncoder()
  let closed = false

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) => {
        if (closed) return
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }

      const MAX = 60
      let attempts = 0

      while (attempts < MAX) {
        attempts++
        try {
          const prediction = await replicate.predictions.get(id)
          const progress = parseProgress(prediction.logs ?? null)
          const step = parseStep(prediction.logs ?? null)

          if (prediction.status === 'succeeded') {
            const url = Array.isArray(prediction.output)
              ? prediction.output[0]
              : prediction.output
            send({ status: 'completed', url, progress: 100, step: 'Done!' })
            break
          }

          if (prediction.status === 'failed' || prediction.status === 'canceled') {
            send({ status: 'failed', error: String(prediction.error ?? 'Generation failed') })
            break
          }

          send({ status: 'processing', progress, step })
        } catch (err) {
          send({ status: 'failed', error: String(err) })
          break
        }

        // Wait 2 s between polls
        await new Promise(r => setTimeout(r, 2000))
      }

      if (attempts >= MAX) {
        send({ status: 'failed', error: 'Timed out after 2 minutes' })
      }

      closed = true
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
