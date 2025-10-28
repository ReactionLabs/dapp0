import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/neon/client'
import { z } from 'zod'

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  type: z.enum(['frontend', 'agent']),
  chain: z.string().min(1, 'Chain is required'),
  generatedCode: z.string().optional(),
  messages: z.array(z.any()).default([]),
  isPublic: z.boolean().default(false)
})

const UpdateProjectSchema = z.object({
  name: z.string().optional(),
  generatedCode: z.string().optional(),
  messages: z.array(z.any()).optional(),
  isPublic: z.boolean().optional(),
  githubRepoUrl: z.string().optional()
})

// GET /api/projects - List user's projects
export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (you'll need to implement proper session handling)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const projects = await databaseService.getProjectsByUserId(userId)

    return NextResponse.json({
      success: true,
      projects: projects || []
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, chain, generatedCode, messages, isPublic } = CreateProjectSchema.parse(body)

    // Get user ID from session
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const project = await databaseService.createProject({
      user_id: userId,
      name,
      type,
      chain,
      generated_code: generatedCode,
      messages,
      is_public: isPublic
    })

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
