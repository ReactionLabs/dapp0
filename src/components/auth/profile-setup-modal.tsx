'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { User, Mail, Github, X } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'

interface ProfileSetupModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ProfileSetupModal({ isOpen, onClose, className }: ProfileSetupModalProps) {
  const { updateProfile, user } = useAuth()
  const [formData, setFormData] = useState({
    email: user?.email || '',
    username: user?.username || '',
    avatar_url: user?.avatar_url || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsLoading(true)
      setErrors({})
      
      await updateProfile(formData)
      onClose()
    } catch (error) {
      console.error('Profile update error:', error)
      setErrors({ general: 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={cn("bg-card rounded-lg border w-full max-w-md", className)} style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
            <h2 className="text-xl font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
              Complete Your Profile
            </h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--input))',
                  color: 'hsl(var(--foreground))'
                }}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Choose a username"
                className="w-full pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--input))',
                  color: 'hsl(var(--foreground))'
                }}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-destructive mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
              Avatar URL (Optional)
            </label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) => handleInputChange('avatar_url', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: 'hsl(var(--background))', 
                borderColor: 'hsl(var(--input))',
                color: 'hsl(var(--foreground))'
              }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
              style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>

        <div className="px-6 pb-6">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(var(--muted))' }}>
            <div className="flex items-center gap-2 mb-2">
              <Github className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                Connect GitHub (Optional)
              </span>
            </div>
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Connect your GitHub account to export projects and sync with repositories.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              Connect GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
