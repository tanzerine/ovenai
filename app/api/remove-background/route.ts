import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()
    if (!imageUrl) throw new Error("No image URL provided")

    const imageUrlString = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl

    const prediction = await replicate.predictions.create({
      version: "4067ee2a58f6c161d434a9c077cfa012820b8e076efa2772aa171e26557da919",
      input: { image: imageUrlString }
    })

    if (!prediction?.id) throw new Error("Failed to create prediction")
    return NextResponse.json({ success: true, predictionId: prediction.id })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 })
  }
}
