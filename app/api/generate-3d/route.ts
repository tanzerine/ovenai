import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()
    if (!imageUrl) return NextResponse.json({ success: false, error: 'imageUrl required' }, { status: 400 })

    const prediction = await replicate.predictions.create({
      model: "tencent/hunyuan-3d-3.1",
      input: {
        image: imageUrl,
        enable_pbr: true,
        face_count: 400000,
        generate_type: "Normal",
      }
    })

    if (!prediction?.id) throw new Error("Failed to create prediction")
    return NextResponse.json({ success: true, predictionId: prediction.id })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
