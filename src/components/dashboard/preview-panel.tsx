'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Code, Eye, RefreshCw, ExternalLink, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

type PreviewPanelProps = {
  code?: string
  isGenerating: boolean
  onRefresh: () => void
  className?: string
}

export function PreviewPanel({ code, isGenerating, onRefresh, className }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [iframeKey, setIframeKey] = useState(0)

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1)
    onRefresh()
  }

  const downloadCode = () => {
    if (code) {
      const blob = new Blob([code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'generated-code.tsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const deployToVercel = () => {
    // TODO: Implement Vercel deployment
    console.log('Deploy to Vercel')
  }

  return (
    <div className={cn("flex flex-col h-full bg-gray-900 border-l border-gray-800", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('preview')}
              className="text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant={activeTab === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('code')}
              className="text-white"
            >
              <Code className="w-4 h-4 mr-2" />
              Code
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isGenerating}
              className="text-white border-gray-600 hover:bg-gray-800"
            >
              <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCode}
              disabled={!code}
              className="text-white border-gray-600 hover:bg-gray-800"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deployToVercel}
              disabled={!code}
              className="text-white border-gray-600 hover:bg-gray-800"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' ? (
          <div className="h-full">
            {code ? (
              <iframe
                key={iframeKey}
                srcDoc={`
                  <!DOCTYPE html>
                  <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Preview</title>
                    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                    <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>
                    <script src="https://unpkg.com/@solana/wallet-adapter-base@latest/lib/index.iife.min.js"></script>
                    <script src="https://unpkg.com/@solana/wallet-adapter-react@latest/lib/index.iife.min.js"></script>
                    <script src="https://unpkg.com/@solana/wallet-adapter-react-ui@latest/lib/index.iife.min.js"></script>
                    <script src="https://unpkg.com/tailwindcss@3.4.0/lib/tailwind.min.js"></script>
                    <style>
                      body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; }
                      * { box-sizing: border-box; }
                    </style>
                  </head>
                  <body>
                    <div id="root"></div>
                    <script type="text/babel">
                      ${code}
                    </script>
                  </body>
                  </html>
                `}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No preview available</p>
                  <p className="text-sm">Generate some code to see the preview</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            {code ? (
              <div className="h-full overflow-auto">
                <pre className="p-4 text-sm text-gray-300 bg-gray-800 h-full overflow-auto">
                  <code>{code}</code>
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No code generated yet</p>
                  <p className="text-sm">Start a conversation to generate code</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

