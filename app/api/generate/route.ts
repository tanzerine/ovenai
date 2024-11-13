import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

interface GenerateInput {
  prompt: string;
  output_format: string;
  width: number;
  height: number;
  num_inference_steps: number;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const imageFile = formData.get('image') as File | null

    console.log('Received prompt:', prompt)

    const input: GenerateInput = {
      prompt,
      output_format: "png",
      width: 1024,  // Always set to 1024
      height: 1024, // Always set to 1024
      num_inference_steps: 28, // Increased for better quality
    }

    if (imageFile) {
      console.log('Image file received:', imageFile.name)
      const arrayBuffer = await imageFile.arrayBuffer()
      const base64Image = Buffer.from(arrayBuffer).toString('base64')
      input.image = `data:${imageFile.type};base64,${base64Image}`
    }

    console.log('Creating prediction...')
    const prediction = await replicate.predictions.create({
      version: "c2cffd3b2c9004cf28cb9600940eb4c5ee7423af7d242f95f2ae0229eac62362",
      input
    })

    console.log('Prediction created:', prediction)

    if (!prediction || !prediction.id) {
      throw new Error("Failed to create prediction")
    }

    console.log('Prediction ID:', prediction.id)

    return NextResponse.json({ 
      success: true, 
      predictionId: prediction.id
    })
  } catch (error) {
    console.error("Error in generate API:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { status: 500 })
  }
}