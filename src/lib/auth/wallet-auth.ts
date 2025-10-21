import { supabase } from '@/lib/supabase/client'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { ChainType } from '@/lib/chain-config'

export interface User {
  id: string
  email?: string
  username?: string
  avatar_url?: string
  github_username?: string
  wallets: Wallet[]
  created_at: string
}

export interface Wallet {
  id: string
  wallet_address: string
  chain_type: ChainType
  is_primary: boolean
  created_at: string
}

export interface ProfileData {
  email?: string
  username?: string
  avatar_url?: string
}

export class WalletAuthService {
  private supabase = supabase

  // Generate nonce for signature
  async generateNonce(walletAddress: string): Promise<string> {
    const nonce = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)
    
    // Store nonce temporarily (you might want to use Redis or similar in production)
    localStorage.setItem(`nonce_${walletAddress}`, nonce)
    
    return nonce
  }

  // Verify signature and authenticate
  async verifyAndAuth(
    walletAddress: string, 
    signature: string, 
    chain: ChainType
  ): Promise<User> {
    try {
      // Get stored nonce
      const nonce = localStorage.getItem(`nonce_${walletAddress}`)
      if (!nonce) {
        throw new Error('No nonce found for this wallet address')
      }

      // Verify signature based on chain
      const isValid = await this.verifySignature(walletAddress, signature, nonce, chain)
      if (!isValid) {
        throw new Error('Invalid signature')
      }

      // Clean up nonce
      localStorage.removeItem(`nonce_${walletAddress}`)

      // Get or create user
      const user = await this.getOrCreateUser(walletAddress, chain)
      
      // Create session
      await this.createSession(user.id)
      
      return user
    } catch (error) {
      console.error('Authentication error:', error)
      throw error
    }
  }

  // Verify signature based on chain type
  private async verifySignature(
    walletAddress: string, 
    signature: string, 
    message: string, 
    chain: ChainType
  ): Promise<boolean> {
    try {
      switch (chain) {
        case 'solana':
          return this.verifySolanaSignature(walletAddress, signature, message)
        case 'ethereum':
          return this.verifyEthereumSignature(walletAddress, signature, message)
        default:
          // For other chains, implement specific verification
          return true // Placeholder
      }
    } catch (error) {
      console.error('Signature verification error:', error)
      return false
    }
  }

  // Verify Solana signature
  private verifySolanaSignature(
    walletAddress: string, 
    signature: string, 
    message: string
  ): boolean {
    try {
      const messageBytes = new TextEncoder().encode(message)
      const signatureBytes = bs58.decode(signature)
      const publicKeyBytes = bs58.decode(walletAddress)
      
      return nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      )
    } catch (error) {
      console.error('Solana signature verification error:', error)
      return false
    }
  }

  // Verify Ethereum signature (simplified - you might want to use ethers.js)
  private verifyEthereumSignature(
    walletAddress: string, 
    signature: string, 
    message: string
  ): boolean {
    // This is a simplified version - in production, use proper Ethereum signature verification
    return true // Placeholder
  }

  // Create or get user by wallet
  async getOrCreateUser(walletAddress: string, chain: ChainType): Promise<User> {
    try {
      // First, check if wallet exists
      const { data: existingWallet, error: walletError } = await this.supabase
        .from('wallets')
        .select(`
          *,
          users (*)
        `)
        .eq('wallet_address', walletAddress)
        .single()

      if (existingWallet && !walletError) {
        // Wallet exists, return user
        return {
          id: existingWallet.users.id,
          email: existingWallet.users.email,
          username: existingWallet.users.username,
          avatar_url: existingWallet.users.avatar_url,
          github_username: existingWallet.users.github_username,
          wallets: [existingWallet],
          created_at: existingWallet.users.created_at
        }
      }

      // Create new user and wallet
      const { data: newUser, error: userError } = await this.supabase
        .from('users')
        .insert({
          email: null,
          username: null
        })
        .select()
        .single()

      if (userError) {
        throw new Error(`Failed to create user: ${userError.message}`)
      }

      // Create wallet
      const { data: newWallet, error: walletCreateError } = await this.supabase
        .from('wallets')
        .insert({
          user_id: newUser.id,
          wallet_address: walletAddress,
          chain_type: chain,
          is_primary: true
        })
        .select()
        .single()

      if (walletCreateError) {
        throw new Error(`Failed to create wallet: ${walletCreateError.message}`)
      }

      return {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        avatar_url: newUser.avatar_url,
        github_username: newUser.github_username,
        wallets: [newWallet],
        created_at: newUser.created_at
      }
    } catch (error) {
      console.error('Get or create user error:', error)
      throw error
    }
  }

  // Create session
  private async createSession(userId: string): Promise<void> {
    try {
      // In a real implementation, you would create a proper session
      // For now, we'll store the user ID in localStorage
      localStorage.setItem('dapp0_user_id', userId)
    } catch (error) {
      console.error('Session creation error:', error)
      throw error
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const userId = localStorage.getItem('dapp0_user_id')
      if (!userId) return null

      const { data: user, error } = await this.supabase
        .from('users')
        .select(`
          *,
          wallets (*)
        `)
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Get current user error:', error)
        return null
      }

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar_url: user.avatar_url,
        github_username: user.github_username,
        wallets: user.wallets,
        created_at: user.created_at
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  // Update user profile
  async updateProfile(userId: string, data: ProfileData): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('users')
        .update(data)
        .eq('id', userId)

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`)
      }
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      localStorage.removeItem('dapp0_user_id')
      // Clear any other session data
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }
}

export const walletAuthService = new WalletAuthService()
