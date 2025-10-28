import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/neon/client'
import { z } from 'zod'

const UpdateProjectSchema = z.object({
  name: z.string().optional(),
  generatedCode: z.string().optional(),
  messages: z.array(z.any()).optional(),
  isPublic: z.boolean().optional(),
  githubRepoUrl: z.string().optional()
})

// GET /api/projects/[id] - Get specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from session
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const project = await databaseService.getProjectById(params.id, userId)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updateData = UpdateProjectSchema.parse(body)

    // Get user ID from session
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const updateFields: any = {}
    
    if (updateData.name !== undefined) {
      updateFields.name = updateData.name
    }
    if (updateData.generatedCode !== undefined) {
      updateFields.generated_code = updateData.generatedCode
    }
    if (updateData.messages !== undefined) {
      updateFields.messages = updateData.messages
    }
    if (updateData.isPublic !== undefined) {
      updateFields.is_public = updateData.isPublic
    }
    if (updateData.githubRepoUrl !== undefined) {
      updateFields.github_repo_url = updateData.githubRepoUrl
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      )
    }

    const project = await databaseService.updateProject(params.id, userId, updateFields)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from session
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await databaseService.deleteProject(params.id, userId)

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
