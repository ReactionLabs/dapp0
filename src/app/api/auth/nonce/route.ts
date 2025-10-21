import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const NonceRequestSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress } = NonceRequestSchema.parse(body)

    // Generate nonce
    const nonce = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)
    
    // In production, you might want to store this in Redis or similar
    // For now, we'll return it and let the client handle storage
    
    return NextResponse.json({
      success: true,
      nonce,
      message: `Sign this message to authenticate with dApp0:\n\n${nonce}`
    })
  } catch (error) {
    console.error('Nonce generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate nonce' },
      { status: 500 }
    )
  }
}
