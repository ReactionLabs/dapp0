import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { databaseService } from '@/lib/neon/client'
import { ChainType } from '@/lib/chain-config'

const VerifyRequestSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  signature: z.string().min(1, 'Signature is required'),
  chain: z.enum(['solana', 'ethereum', 'sui', 'xrp', 'polygon', 'avalanche']),
  message: z.string().min(1, 'Message is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, signature, chain, message } = VerifyRequestSchema.parse(body)

    // Verify signature based on chain
    const isValid = await verifySignature(walletAddress, signature, message, chain as ChainType)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Check if wallet exists
    let user = await databaseService.getUserByWalletAddress(walletAddress)

    if (!user) {
      // Create new user and wallet
      const newUser = await databaseService.createUser({
        email: null,
        username: null
      })

      // Create wallet
      const newWallet = await databaseService.createWallet({
        user_id: newUser.id,
        wallet_address: walletAddress,
        chain_type: chain,
        is_primary: true
      })

      user = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        avatar_url: newUser.avatar_url,
        github_username: newUser.github_username,
        wallets: [newWallet],
        created_at: newUser.created_at
      }
    }

    return NextResponse.json({
      success: true,
      user,
      needsProfileSetup: !user.email || !user.username
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify signature' },
      { status: 500 }
    )
  }
}

async function verifySignature(
  walletAddress: string, 
  signature: string, 
  message: string, 
  chain: ChainType
): Promise<boolean> {
  try {
    switch (chain) {
      case 'solana':
        return verifySolanaSignature(walletAddress, signature, message)
      case 'ethereum':
        return verifyEthereumSignature(walletAddress, signature, message)
      default:
        // For other chains, implement specific verification
        return true // Placeholder
    }
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

async function verifySolanaSignature(
  walletAddress: string, 
  signature: string, 
  message: string
): Promise<boolean> {
  try {
    const nacl = await import('tweetnacl')
    const bs58 = await import('bs58')
    
    const messageBytes = new TextEncoder().encode(message)
    const signatureBytes = bs58.default.decode(signature)
    const publicKeyBytes = bs58.default.decode(walletAddress)
    
    return nacl.default.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    )
  } catch (error) {
    console.error('Solana signature verification error:', error)
    return false
  }
}

async function verifyEthereumSignature(
  walletAddress: string, 
  signature: string, 
  message: string
): Promise<boolean> {
  // This is a simplified version - in production, use proper Ethereum signature verification
  return true // Placeholder
}
