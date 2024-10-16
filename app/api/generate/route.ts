import { NextRequest, NextResponse } from 'next/server'
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface GenerateInput {
  prompt: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    console.log('Received prompt:', prompt)

    const input: GenerateInput = {
      prompt,
    }

    console.log('Creating prediction...')
    let prediction = await replicate.deployments.predictions.create(
      "tanzerine",
      "3d-icon-generator",
      {
        input
      }
    );

    console.log('Waiting for prediction to complete...')
    prediction = await replicate.wait(prediction);

    console.log('Prediction completed:', prediction)
    if (!prediction || !prediction.output) {
      throw new Error("Failed to create prediction or no output received")
    }

    console.log('Prediction output:', prediction.output)
    return NextResponse.json({ 
      success: true, 
      output: prediction.output
    })
  } catch (error) {
    console.error("Error in generate API:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { status: 500 })
  }
}
