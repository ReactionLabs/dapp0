'use client'

import React from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { ChainType, getChainConfig, SUPPORTED_CHAINS } from '@/lib/chain-config'

type ChainSelectorProps = {
  selectedChain: ChainType
  onChainChange: (chain: ChainType) => void
  className?: string
}

export function ChainSelector({ selectedChain, onChainChange, className }: ChainSelectorProps) {
  const selectedConfig = getChainConfig(selectedChain)

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-300">Select Chain:</span>
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
          <span className="text-lg">{selectedConfig.icon}</span>
          <span className="text-sm font-medium text-white">{selectedConfig.name}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {SUPPORTED_CHAINS.map((chain) => {
          const config = getChainConfig(chain)
          const isSelected = selectedChain === chain
          
          return (
            <Button
              key={chain}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onChainChange(chain)}
              className={cn(
                "flex items-center gap-2 p-3 h-auto",
                isSelected 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white"
              )}
            >
              <span className="text-lg">{config.icon}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{config.name}</span>
                <span className="text-xs opacity-75">{config.language}</span>
              </div>
            </Button>
          )
        })}
      </div>
      
      <div className="mt-2 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-300">Chain Info:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div>
            <span className="font-medium">Language:</span> {selectedConfig.language}
          </div>
          <div>
            <span className="font-medium">Framework:</span> {selectedConfig.framework}
          </div>
          <div>
            <span className="font-medium">Symbol:</span> {selectedConfig.symbol}
          </div>
          <div>
            <span className="font-medium">Network:</span> Testnet
          </div>
        </div>
      </div>
    </div>
  )
}

