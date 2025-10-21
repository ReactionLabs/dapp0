import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { githubService } from '@/lib/github/github-service'

// GET /api/github/repos - List user's GitHub repositories
export async function GET(request: NextRequest) {
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

    // Get user's GitHub access token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('github_access_token')
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

    // Get repositories
    const repos = await githubService.listRepos()

    return NextResponse.json({
      success: true,
      repos
    })
  } catch (error) {
    console.error('Get GitHub repos error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}
