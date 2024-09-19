// app/api/generate/route.ts
import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: Request) {
  try {
    console.log('Generate API route called')
    const { prompt } = await request.json()
    console.log('Received prompt:', prompt)

    console.log('Generating image...')
    const imageOutput = await replicate.run(
      "tanzerine/3d_icon:c2cffd3b2c9004cf28cb9600940eb4c5ee7423af7d242f95f2ae0229eac62362",
      {
        input: {
          prompt: prompt,
          output_format: "png",
          width: 512,
          height: 512,
          num_inference_steps: 20
        }
      }
    )
    console.log('Image generation output:', imageOutput)

    if (!Array.isArray(imageOutput) || imageOutput.length === 0) {
      throw new Error("Invalid image generation output")
    }

    const originalImageUrl = imageOutput[0]
    console.log('Generated image URL:', originalImageUrl)

    return NextResponse.json({ 
      success: true, 
      image_url: originalImageUrl
    })
  } catch (error) {
    console.error("Error in generate API:", error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 })
  }
}