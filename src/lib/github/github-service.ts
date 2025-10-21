import { Octokit } from '@octokit/rest'

export interface Repo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  clone_url: string
  private: boolean
  created_at: string
  updated_at: string
}

export interface File {
  path: string
  content: string
  encoding?: 'base64' | 'utf-8'
}

export class GitHubService {
  private octokit: Octokit | null = null

  // Authenticate with user's token
  async authenticate(accessToken: string): Promise<void> {
    this.octokit = new Octokit({
      auth: accessToken
    })
  }

  // List user's repositories
  async listRepos(): Promise<Repo[]> {
    if (!this.octokit) {
      throw new Error('Not authenticated with GitHub')
    }

    try {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100
      })

      return data.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        private: repo.private,
        created_at: repo.created_at,
        updated_at: repo.updated_at
      }))
    } catch (error) {
      console.error('GitHub list repos error:', error)
      throw error
    }
  }

  // Create new repository
  async createRepo(name: string, description: string, isPrivate: boolean = false): Promise<Repo> {
    if (!this.octokit) {
      throw new Error('Not authenticated with GitHub')
    }

    try {
      const { data } = await this.octokit.repos.createForAuthenticatedUser({
        name,
        description,
        private: isPrivate,
        auto_init: true
      })

      return {
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        description: data.description,
        html_url: data.html_url,
        clone_url: data.clone_url,
        private: data.private,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('GitHub create repo error:', error)
      throw error
    }
  }

  // Export project to repo
  async exportProject(
    repoName: string, 
    files: File[], 
    commitMessage: string = 'Initial commit from dApp0'
  ): Promise<void> {
    if (!this.octokit) {
      throw new Error('Not authenticated with GitHub')
    }

    try {
      // Get current user to determine owner
      const { data: user } = await this.octokit.users.getAuthenticated()
      const owner = user.login

      // Create files in the repository
      for (const file of files) {
        await this.octokit.repos.createOrUpdateFileContents({
          owner,
          repo: repoName,
          path: file.path,
          message: commitMessage,
          content: Buffer.from(file.content).toString('base64')
        })
      }
    } catch (error) {
      console.error('GitHub export project error:', error)
      throw error
    }
  }

  // Commit generated code
  async commitCode(
    owner: string,
    repo: string, 
    path: string,
    code: string, 
    message: string
  ): Promise<void> {
    if (!this.octokit) {
      throw new Error('Not authenticated with GitHub')
    }

    try {
      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(code).toString('base64')
      })
    } catch (error) {
      console.error('GitHub commit code error:', error)
      throw error
    }
  }

  // Get repo details
  async getRepo(owner: string, repo: string): Promise<Repo> {
    if (!this.octokit) {
      throw new Error('Not authenticated with GitHub')
    }

    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo
      })

      return {
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        description: data.description,
        html_url: data.html_url,
        clone_url: data.clone_url,
        private: data.private,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('GitHub get repo error:', error)
      throw error
    }
  }

  // Get repository contents
  async getRepoContents(owner: string, repo: string, path: string = ''): Promise<any[]> {
    if (!this.octokit) {
      throw new Error('Not authenticated with GitHub')
    }

    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path
      })

      return Array.isArray(data) ? data : [data]
    } catch (error) {
      console.error('GitHub get repo contents error:', error)
      throw error
    }
  }

  // Create a new file in repository
  async createFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string
  ): Promise<void> {
    if (!this.octokit) {
      throw new Error('Not authenticated with GitHub')
    }

    try {
      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64')
      })
    } catch (error) {
      console.error('GitHub create file error:', error)
      throw error
    }
  }

  // Update an existing file in repository
  async updateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha: string
  ): Promise<void> {
    if (!this.octokit) {
      throw new Error('Not authenticated with GitHub')
    }

    try {
      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        sha
      })
    } catch (error) {
      console.error('GitHub update file error:', error)
      throw error
    }
  }
}

export const githubService = new GitHubService()
