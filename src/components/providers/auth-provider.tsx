'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { walletAuthService, User, ProfileData } from '@/lib/auth/wallet-auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: ProfileData) => Promise<void>
  needsProfileSetup: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { publicKey, signMessage, connected } = useWallet()

  const isAuthenticated = !!user
  const needsProfileSetup = user && (!user.email || !user.username)

  // Load user on mount
  useEffect(() => {
    loadUser()
  }, [])

  // Handle wallet connection
  useEffect(() => {
    if (connected && publicKey && !user) {
      handleWalletConnection()
    }
  }, [connected, publicKey, user])

  const loadUser = async () => {
    try {
      setIsLoading(true)
      const currentUser = await walletAuthService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Load user error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnection = async () => {
    if (!publicKey || !signMessage) return

    try {
      setIsLoading(true)
      
      // Generate nonce
      const nonce = await walletAuthService.generateNonce(publicKey.toBase58())
      const message = `Sign this message to authenticate with dApp0:\n\n${nonce}`
      
      // Request signature
      const signature = await signMessage(new TextEncoder().encode(message))
      
      // Verify and authenticate
      const user = await walletAuthService.verifyAndAuth(
        publicKey.toBase58(),
        bs58.encode(signature),
        'solana' // Default to Solana for now
      )
      
      setUser(user)
    } catch (error) {
      console.error('Authentication error:', error)
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async () => {
    if (!publicKey || !signMessage) {
      throw new Error('Wallet not connected')
    }

    try {
      setIsLoading(true)
      
      // Generate nonce
      const nonce = await walletAuthService.generateNonce(publicKey.toBase58())
      const message = `Sign this message to authenticate with dApp0:\n\n${nonce}`
      
      // Request signature
      const signature = await signMessage(new TextEncoder().encode(message))
      
      // Verify and authenticate
      const user = await walletAuthService.verifyAndAuth(
        publicKey.toBase58(),
        bs58.encode(signature),
        'solana' // Default to Solana for now
      )
      
      setUser(user)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await walletAuthService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const updateProfile = async (data: ProfileData) => {
    if (!user) {
      throw new Error('Not authenticated')
    }

    try {
      await walletAuthService.updateProfile(user.id, data)
      
      // Reload user to get updated data
      const updatedUser = await walletAuthService.getCurrentUser()
      setUser(updatedUser)
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    updateProfile,
    needsProfileSetup
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Import bs58 for signature encoding
import bs58 from 'bs58'
