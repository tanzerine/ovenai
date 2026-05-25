// app/api/remove-background/route.ts
import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: Request) {
  try {
    console.log('Remove background API route called')
    const { imageUrl } = await request.json()
    console.log('Received image URL:', imageUrl)

    if (!imageUrl) {
      throw new Error("No image URL provided")
    }

    // Ensure imageUrl is a string
    const imageUrlString = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl

    console.log('Removing background...')
    const backgroundRemovalOutput = await replicate.run(
      "smoretalk/rembg-enhance:4067ee2a58f6c161d434a9c077cfa012820b8e076efa2772aa171e26557da919",
      {
        input: {
          image: imageUrlString
        }
      }
    )
    console.log('Background removal output:', JSON.stringify(backgroundRemovalOutput, null, 2))

    let removedBgImageUrl: string

    if (typeof backgroundRemovalOutput === 'string') {
      removedBgImageUrl = backgroundRemovalOutput
    } else if (Array.isArray(backgroundRemovalOutput) && backgroundRemovalOutput.length > 0) {
      removedBgImageUrl = backgroundRemovalOutput[0]
    } else if (typeof backgroundRemovalOutput === 'object' && backgroundRemovalOutput !== null && 'image' in backgroundRemovalOutput) {
      removedBgImageUrl = (backgroundRemovalOutput as { image: string }).image
    } else {
      console.error("Unexpected background removal output format:", backgroundRemovalOutput)
      throw new Error("Invalid background removal output format")
    }

    console.log('Background removed image URL:', removedBgImageUrl)

    return NextResponse.json({ 
      success: true, 
      removed_bg_image_url: removedBgImageUrl
    })
  } catch (error) {
    console.error("Error in remove background API:", error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 })
  }
}