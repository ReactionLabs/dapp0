'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from './sidebar'
import { ChatInterface } from './chat-interface'
import { PreviewPanel } from './preview-panel'
import { SettingsModal } from './settings-modal'
import { ProfileSetupModal } from '@/components/auth/profile-setup-modal'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useAuth } from '@/components/providers/auth-provider'
import { ChainType } from '@/lib/chain-config'

type Project = {
  id: string
  name: string
  type: 'frontend' | 'agent'
  lastModified: Date
  messages: Message[]
  generatedCode?: string
}

type Message = {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isGenerating?: boolean
}

export function Dashboard() {
  const { user, isAuthenticated, needsProfileSetup } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false)

  const activeProject = projects.find(p => p.id === activeProjectId)

  // Load projects from database when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProjects()
    } else {
      setProjects([])
    }
  }, [isAuthenticated, user])

  // Show profile setup modal if needed
  useEffect(() => {
    if (isAuthenticated && needsProfileSetup) {
      setIsProfileSetupOpen(true)
    }
  }, [isAuthenticated, needsProfileSetup])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'x-user-id': user?.id || ''
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProjects(data.projects.map((p: any) => ({
            ...p,
            lastModified: new Date(p.updated_at || p.created_at),
            messages: p.messages || []
          })))
        }
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  // No need to save to localStorage anymore - projects are stored in database

  const handleNewProject = async () => {
    if (!user) return

    try {
      const projectType = Math.random() > 0.5 ? 'frontend' : 'agent'
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          name: `New ${projectType === 'frontend' ? 'Frontend' : 'Agent'} Project`,
          type: projectType,
          chain: 'solana' // Default chain
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const newProject = {
            ...data.project,
            lastModified: new Date(data.project.created_at),
            messages: []
          }
          setProjects(prev => [newProject, ...prev])
          setActiveProjectId(newProject.id)
        }
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleProjectSelect = (projectId: string) => {
    setActiveProjectId(projectId)
  }

  const handleSendMessage = (content: string) => {
    if (!activeProject) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    setProjects(prev => prev.map(project => 
      project.id === activeProjectId 
        ? { ...project, messages: [...project.messages, newMessage] }
        : project
    ))
  }

  const handleGenerate = async (prompt: string, chain: ChainType) => {
    if (!activeProject) return

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: activeProject.type,
          chain,
          projectId: activeProject.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const fileExtension = getFileExtension(activeProject.type, chain)
        const assistantMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: `Here's the generated ${activeProject.type} code for ${chain.toUpperCase()}: "${prompt}"\n\n\`\`\`${fileExtension}\n${data.code}\n\`\`\``,
          timestamp: new Date()
        }

        setProjects(prev => prev.map(project => 
          project.id === activeProjectId 
            ? { 
                ...project, 
                messages: [...project.messages, assistantMessage],
                generatedCode: data.code
              }
            : project
        ))
      } else {
        throw new Error(data.error || 'Failed to generate code')
      }
    } catch (error) {
      console.error('Generation error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error while generating the code: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }

      setProjects(prev => prev.map(project => 
        project.id === activeProjectId 
          ? { ...project, messages: [...project.messages, errorMessage] }
          : project
      ))
    } finally {
      setIsGenerating(false)
    }
  }

  const getFileExtension = (type: 'frontend' | 'agent', chain: ChainType): string => {
    if (type === 'frontend') {
      return 'tsx'
    } else {
      switch (chain) {
        case 'solana': return 'rust'
        case 'ethereum': return 'solidity'
        case 'sui': return 'move'
        case 'xrp': return 'javascript'
        default: return 'text'
      }
    }
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Sidebar */}
      <div className="w-80 border-r" style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}>
        <Sidebar
          projects={projects}
          activeProjectId={activeProjectId}
          onProjectSelect={handleProjectSelect}
          onNewProject={handleNewProject}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          <ChatInterface
            projectType={activeProject?.type || 'frontend'}
            messages={activeProject?.messages || []}
            onSendMessage={handleSendMessage}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 border-l" style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}>
          <PreviewPanel
            code={activeProject?.generatedCode}
            isGenerating={isGenerating}
            onRefresh={() => {}}
          />
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <WalletMultiButton style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }} />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={isProfileSetupOpen}
        onClose={() => setIsProfileSetupOpen(false)}
      />
    </div>
  )
}
