'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Folder, Search, Settings, Bot, Code } from 'lucide-react'
import { cn } from '@/lib/utils'

type Project = {
  id: string
  name: string
  type: 'frontend' | 'agent'
  lastModified: Date
}

type SidebarProps = {
  projects: Project[]
  activeProjectId?: string
  onProjectSelect: (projectId: string) => void
  onNewProject: () => void
  onOpenSettings: () => void
  className?: string
}

export function Sidebar({ 
  projects, 
  activeProjectId, 
  onProjectSelect, 
  onNewProject,
  onOpenSettings,
  className 
}: SidebarProps) {
  return (
    <div className={cn("flex flex-col h-full border-r", className)} style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--primary))' }}>
            <Code className="w-4 h-4" style={{ color: 'hsl(var(--primary-foreground))' }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>dApp0</h1>
        </div>
        
        <Button 
          onClick={onNewProject}
          className="w-full"
          style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: 'hsl(var(--background))', 
              borderColor: 'hsl(var(--input))',
              color: 'hsl(var(--foreground))'
            }}
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-2">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No projects yet</p>
              <p className="text-sm">Create your first project</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={cn(
                  "p-3 rounded cursor-pointer transition-colors",
                  activeProjectId === project.id
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-muted/50 hover:bg-muted border border-transparent hover:border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  {project.type === 'frontend' ? (
                    <Code className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Bot className="w-4 h-4 text-green-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.lastModified.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          onClick={onOpenSettings}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  )
}
