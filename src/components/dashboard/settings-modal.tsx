'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { V0Config } from '@/components/settings/v0-config'
import { Settings, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function SettingsModal({ isOpen, onClose, className }: SettingsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={cn("bg-gray-900 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto", className)}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Settings</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <V0Config />
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Multi-Chain Support</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Solana (Rust/Anchor)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Ethereum (Solidity)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Sui (Move)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>XRP Ledger (JavaScript)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Polygon (Coming Soon)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Avalanche (Coming Soon)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                AI-powered code generation with v0
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Multi-chain wallet integration
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Live code preview
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Project management
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Export and deployment
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

