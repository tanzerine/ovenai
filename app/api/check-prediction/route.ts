// app/api/check-prediction/route.ts
import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function GET(request: Request) {
  console.log('GET request received for check-prediction');
  const { searchParams } = new URL(request.url)
  const predictionId = searchParams.get('id')

  if (!predictionId) {
    return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 })
  }

  try {
    const prediction = await replicate.predictions.get(predictionId)

    if (prediction.status === 'succeeded') {
      return NextResponse.json({ 
        success: true, 
        status: 'completed',
        imageUrl: prediction.output
      })
    } else if (prediction.status === 'failed') {
      return NextResponse.json({ success: false, status: 'failed', error: prediction.error })
    } else {
      return NextResponse.json({ success: true, status: 'processing' })
    }
  } catch (error) {
    console.error("Error checking prediction:", error)
    return NextResponse.json({ success: false, error: 'Failed to check prediction status' }, { status: 500 })
  }
}
