import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { githubService } from '@/lib/github/github-service'
import { z } from 'zod'

const ExportProjectSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  repoName: z.string().min(1, 'Repository name is required'),
  createNewRepo: z.boolean().default(false),
  repoDescription: z.string().optional(),
  isPrivate: z.boolean().default(false)
})

// POST /api/github/export - Export project to GitHub repository
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, repoName, createNewRepo, repoDescription, isPrivate } = ExportProjectSchema.parse(body)

    const supabase = createServerSupabaseClient()
    
    // Get user ID from session
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get user's GitHub access token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('github_access_token, github_username')
      .eq('id', userId)
      .single()

    if (userError || !user?.github_access_token) {
      return NextResponse.json(
        { success: false, error: 'GitHub not connected' },
        { status: 400 }
      )
    }

    // Authenticate with GitHub
    await githubService.authenticate(user.github_access_token)

    let repoUrl: string

    if (createNewRepo) {
      // Create new repository
      const repo = await githubService.createRepo(
        repoName,
        repoDescription || `Generated ${project.type} for ${project.chain}`,
        isPrivate
      )
      repoUrl = repo.html_url
    } else {
      // Use existing repository
      const repo = await githubService.getRepo(user.github_username!, repoName)
      repoUrl = repo.html_url
    }

    // Prepare files for export
    const files = [
      {
        path: 'README.md',
        content: `# ${project.name}\n\nGenerated with dApp0\n\n## Description\n\nThis is a ${project.type} project for ${project.chain}.\n\n## Generated Code\n\n\`\`\`${project.type === 'frontend' ? 'tsx' : 'rust'}\n${project.generated_code || '// No code generated yet'}\n\`\`\``
      }
    ]

    if (project.generated_code) {
      const fileExtension = project.type === 'frontend' ? 'tsx' : 
                           project.chain === 'solana' ? 'rs' :
                           project.chain === 'ethereum' ? 'sol' :
                           project.chain === 'sui' ? 'move' : 'js'
      
      files.push({
        path: `src/main.${fileExtension}`,
        content: project.generated_code
      })
    }

    // Export to repository
    await githubService.exportProject(
      repoName,
      files,
      `Initial commit: ${project.name}`
    )

    // Update project with GitHub repo URL
    const { error: updateError } = await supabase
      .from('projects')
      .update({ github_repo_url: repoUrl })
      .eq('id', projectId)

    if (updateError) {
      console.error('Failed to update project with repo URL:', updateError)
    }

    return NextResponse.json({
      success: true,
      repoUrl,
      message: 'Project exported successfully'
    })
  } catch (error) {
    console.error('Export project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export project' },
      { status: 500 }
    )
  }
}
