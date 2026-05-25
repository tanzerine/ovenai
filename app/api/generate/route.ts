import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const imageFile = formData.get('image') as File | null
    const imageUrl = formData.get('imageUrl') as string | null

    let prediction

    if (imageFile || imageUrl) {
      // Remix / img2img → nano-banana-pro follows prompts faithfully
      const imageInputs: (string | Blob)[] = imageFile
        ? [new Blob([await imageFile.arrayBuffer()], { type: imageFile.type })]
        : [imageUrl!]

      prediction = await replicate.predictions.create({
        model: "google/nano-banana-pro",
        input: {
          prompt,
          image_input: imageInputs,
          aspect_ratio: "1:1",
          resolution: "1K",
          output_format: "png",
        }
      })
    } else {
      // Text-to-image → fine-tuned UNGDUNG 3D icon model
      prediction = await replicate.predictions.create({
        version: "c2cffd3b2c9004cf28cb9600940eb4c5ee7423af7d242f95f2ae0229eac62362",
        input: {
          prompt: `UNGDUNG ${prompt}`,
          output_format: "png",
          width: 1024,
          height: 1024,
          num_inference_steps: 28,
        }
      })
    }

    if (!prediction?.id) {
      throw new Error("Failed to create prediction")
    }

    return NextResponse.json({ success: true, predictionId: prediction.id })
  } catch (error) {
    console.error("Error in generate API:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 })
  }
}
