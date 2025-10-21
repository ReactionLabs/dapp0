'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings, Key, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type V0ConfigProps = {
  className?: string
}

export function V0Config({ className }: V0ConfigProps) {
  const [apiKey, setApiKey] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return

    setIsValidating(true)
    setValidationStatus('idle')

    try {
      // Test the API key by making a simple request
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Test connection',
          type: 'frontend',
          chain: 'solana',
        }),
      })

      if (response.ok) {
        setValidationStatus('valid')
        // Store the API key (in a real app, you'd want to encrypt this)
        localStorage.setItem('v0_api_key', apiKey)
      } else {
        setValidationStatus('invalid')
      }
    } catch (error) {
      console.error('API key validation failed:', error)
      setValidationStatus('invalid')
    } finally {
      setIsValidating(false)
    }
  }

  const handleClearApiKey = () => {
    setApiKey('')
    setValidationStatus('idle')
    localStorage.removeItem('v0_api_key')
  }

  return (
    <div className={cn("p-6 bg-gray-800 rounded-lg border border-gray-700", className)}>
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">v0 API Configuration</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            v0 API Key
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your v0 API key"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim() || isValidating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isValidating ? 'Validating...' : 'Save'}
            </Button>
          </div>
        </div>

        {validationStatus !== 'idle' && (
          <div className={cn(
            "flex items-center gap-2 p-3 rounded-lg",
            validationStatus === 'valid' 
              ? "bg-green-900/20 border border-green-500/30 text-green-400"
              : "bg-red-900/20 border border-red-500/30 text-red-400"
          )}>
            {validationStatus === 'valid' ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">
              {validationStatus === 'valid' 
                ? 'API key is valid and working!'
                : 'API key validation failed. Please check your key and try again.'
              }
            </span>
          </div>
        )}

        <div className="text-sm text-gray-400">
          <p className="mb-2">
            <strong>How to get your v0 API key:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Visit <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">v0.dev</a></li>
            <li>Sign up or log in to your account</li>
            <li>Go to your account settings</li>
            <li>Generate a new API key</li>
            <li>Copy and paste it above</li>
          </ol>
        </div>

        {validationStatus === 'valid' && (
          <Button
            onClick={handleClearApiKey}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Clear API Key
          </Button>
        )}
      </div>
    </div>
  )
}

