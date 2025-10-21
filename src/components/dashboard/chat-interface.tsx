'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChainSelector } from '@/components/ui/chain-selector'
import { Send, Bot, Code, Sparkles, Copy, Download, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChainType } from '@/lib/chain-config'

type Message = {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isGenerating?: boolean
}

type ChatInterfaceProps = {
  projectType: 'frontend' | 'agent'
  messages: Message[]
  onSendMessage: (message: string) => void
  onGenerate: (prompt: string, chain: ChainType) => void
  isGenerating: boolean
  className?: string
}

export function ChatInterface({ 
  projectType, 
  messages, 
  onSendMessage, 
  onGenerate, 
  isGenerating,
  className 
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [selectedChain, setSelectedChain] = useState<ChainType>('solana')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isGenerating) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleGenerate = () => {
    if (input.trim() && !isGenerating) {
      onGenerate(input.trim(), selectedChain)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const downloadCode = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn("flex flex-col h-full bg-gray-900", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          {projectType === 'frontend' ? (
            <Code className="w-5 h-5 text-blue-400" />
          ) : (
            <Bot className="w-5 h-5 text-green-400" />
          )}
          <h2 className="text-lg font-semibold text-white">
            {projectType === 'frontend' ? 'Frontend Generator' : 'AI Agent Builder'}
          </h2>
          <div className="ml-auto">
            <Button
              onClick={handleGenerate}
              disabled={!input.trim() || isGenerating}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>
        
        {/* Chain Selector */}
        <ChainSelector
          selectedChain={selectedChain}
          onChainChange={setSelectedChain}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {projectType === 'frontend' ? (
                <Code className="w-8 h-8 text-purple-400" />
              ) : (
                <Bot className="w-8 h-8 text-green-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {projectType === 'frontend' ? 'Build Your Frontend' : 'Create Your AI Agent'}
            </h3>
            <p className="text-gray-400 mb-6">
              {projectType === 'frontend' 
                ? 'Describe the UI you want to build and we\'ll generate the React code for you.'
                : 'Describe the agent behavior and we\'ll create the on-chain program for you.'
              }
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => setInput(projectType === 'frontend' 
                  ? 'Build a Solana NFT minter UI with wallet connect and mint button'
                  : 'Create an agent that monitors SOL price and swaps to USDC if it drops 5%'
                )}
                className="text-left justify-start h-auto p-3"
              >
                <div>
                  <p className="font-medium text-white">
                    {projectType === 'frontend' 
                      ? 'Build a Solana NFT minter UI with wallet connect and mint button'
                      : 'Create an agent that monitors SOL price and swaps to USDC if it drops 5%'
                    }
                  </p>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-4",
                  message.type === 'user'
                    ? "bg-purple-500/20 border border-purple-500/30 text-white"
                    : "bg-gray-800 border border-gray-700 text-white"
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {message.type === 'assistant' && message.content.includes('```') && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(message.content)}
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadCode(message.content, 'generated-code.tsx')}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Deploy
                    </Button>
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white">U</span>
                </div>
              )}
            </div>
          ))
        )}
        
        {isGenerating && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-gray-400 ml-2">Generating...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={projectType === 'frontend' 
                ? 'Describe the UI you want to build...'
                : 'Describe the agent behavior you want...'
              }
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
