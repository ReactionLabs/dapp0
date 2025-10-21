import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon/server'
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

    const [project] = await sql`
      SELECT * FROM projects 
      WHERE id = ${params.id} AND user_id = ${userId}
    `

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

    // Build dynamic update query
    const updateFields = []
    const updateValues = []
    
    if (updateData.name !== undefined) {
      updateFields.push('name = $' + (updateFields.length + 1))
      updateValues.push(updateData.name)
    }
    if (updateData.generatedCode !== undefined) {
      updateFields.push('generated_code = $' + (updateFields.length + 1))
      updateValues.push(updateData.generatedCode)
    }
    if (updateData.messages !== undefined) {
      updateFields.push('messages = $' + (updateFields.length + 1))
      updateValues.push(JSON.stringify(updateData.messages))
    }
    if (updateData.isPublic !== undefined) {
      updateFields.push('is_public = $' + (updateFields.length + 1))
      updateValues.push(updateData.isPublic)
    }
    if (updateData.githubRepoUrl !== undefined) {
      updateFields.push('github_repo_url = $' + (updateFields.length + 1))
      updateValues.push(updateData.githubRepoUrl)
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      )
    }

    updateFields.push('updated_at = NOW()')
    updateValues.push(params.id, userId)

    const [project] = await sql`
      UPDATE projects 
      SET ${sql(updateFields.join(', '))}
      WHERE id = ${params.id} AND user_id = ${userId}
      RETURNING *
    `

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

    const result = await sql`
      DELETE FROM projects 
      WHERE id = ${params.id} AND user_id = ${userId}
    `

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

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
