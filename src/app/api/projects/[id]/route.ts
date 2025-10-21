import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
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
    const supabase = createServerSupabaseClient()
    
    // Get user ID from session
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        )
      }
      throw new Error(`Failed to fetch project: ${error.message}`)
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

    const supabase = createServerSupabaseClient()
    
    // Get user ID from session
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        )
      }
      throw new Error(`Failed to update project: ${error.message}`)
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
    const supabase = createServerSupabaseClient()
    
    // Get user ID from session
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`)
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
