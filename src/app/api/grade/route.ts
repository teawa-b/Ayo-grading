import { NextResponse } from 'next/server'
import Replicate from 'replicate'

let replicateClient: Replicate | null = null

const getReplicateClient = () => {
  if (replicateClient) {
    return replicateClient
  }

  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    throw new Error('REPLICATE_API_TOKEN is not set')
  }

  replicateClient = new Replicate({
    auth: token,
  })

  return replicateClient
}

const decodeImagePayload = (payload: string) => {
  if (!payload) {
    throw new Error('Missing image payload')
  }

  // Accept both base64 data URLs and plain URLs
  if (payload.startsWith('data:')) {
    const matches = payload.match(/^data:(.+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid data URL provided')
    }
    return Buffer.from(matches[2], 'base64')
  }

  return payload
}

export async function POST(request: Request) {
  try {
    const replicate = getReplicateClient()
    const { referenceImage, targetImage } = await request.json()

    if (!referenceImage || !targetImage) {
      return NextResponse.json(
        { error: 'Both referenceImage and targetImage are required' },
        { status: 400 }
      )
    }

    const prompt =
    'Extract the color histogram and tonal curve data from Image 1. Apply this exact grading profile to Image 2. Match the white balance, saturation levels, and contrast ratio of the reference. Ensure skin tones remain natural but adopt the ambient hue of the source. High-fidelity tone mapping transfer.'
      // 'Transfer the color grading and lighting from image IMAGE 1 (Image on the left) to image 2 (image on the right)'

    const input = {
      resolution: '2K',
      image_input: [decodeImagePayload(referenceImage), decodeImagePayload(targetImage)],
      aspect_ratio: 'match_input_image',
      output_format: 'png',
      safety_filter_level: 'block_only_high',
      prompt,
    }

    const output = await replicate.run('google/nano-banana-pro', {
      input,
    })

    const fileOutput = Array.isArray(output) ? output[0] : output

    let outputUrl: string | null = null

    if (fileOutput && typeof fileOutput === 'object' && 'url' in fileOutput && typeof fileOutput.url === 'function') {
      const url = fileOutput.url()
      outputUrl = url instanceof URL ? url.toString() : `${url}`
    } else if (typeof fileOutput === 'string') {
      outputUrl = fileOutput
    }

    if (!outputUrl) {
      throw new Error('Replicate response did not include a URL')
    }

    return NextResponse.json({ outputUrl })
  } catch (error) {
    console.error('Replicate API error:', error)
    const message =
      error instanceof Error ? error.message : 'Unexpected error while grading image'
    const status = message.includes('REPLICATE_API_TOKEN') ? 500 : 502

    return NextResponse.json({ error: message }, { status })
  }
}
