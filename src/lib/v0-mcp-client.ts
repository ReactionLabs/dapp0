import { v0Integration } from './v0-integration'

export interface V0MCPRequest {
  prompt: string
  type: 'component' | 'page' | 'styling'
  context?: string
}

export interface V0MCPResponse {
  success: boolean
  code: string
  components?: string[]
  error?: string
}

export class V0MCPClient {
  private v0Integration: typeof v0Integration

  constructor() {
    this.v0Integration = v0Integration
  }

  async generateComponent(request: V0MCPRequest): Promise<V0MCPResponse> {
    try {
      const enhancedPrompt = this.buildComponentPrompt(request)
      
      const response = await this.v0Integration.generateCode({
        prompt: enhancedPrompt,
        type: 'frontend',
        chain: 'solana' // Use Solana as base for UI components
      })

      if (response.success) {
        return {
          success: true,
          code: response.code,
          components: this.extractComponents(response.code)
        }
      } else {
        return {
          success: false,
          code: '',
          error: response.error
        }
      }
    } catch (error) {
      return {
        success: false,
        code: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private buildComponentPrompt(request: V0MCPRequest): string {
    const basePrompt = `Create a modern React component with the following requirements:

${request.prompt}

Requirements:
- Use TypeScript
- Use Tailwind CSS for styling
- Use shadcn/ui components where appropriate
- Make it responsive
- Add proper TypeScript types
- Include proper accessibility
- Use modern React patterns (hooks, functional components)
- Add smooth animations with Framer Motion
- Make it look like v0.dev with clean, modern design
- Use proper color schemes for light/dark mode
- Add subtle shadows and borders
- Make buttons and corners boxy (not rounded)
- Use proper spacing and typography

${request.context ? `Context: ${request.context}` : ''}

Please generate a complete, production-ready component:`

    return basePrompt
  }

  private extractComponents(code: string): string[] {
    // Extract component names from the code
    const componentRegex = /export\s+(?:default\s+)?(?:function\s+|const\s+)([A-Z][a-zA-Z0-9]*)/g
    const components: string[] = []
    let match

    while ((match = componentRegex.exec(code)) !== null) {
      components.push(match[1])
    }

    return components
  }

  async generateStyling(prompt: string): Promise<V0MCPResponse> {
    return this.generateComponent({
      prompt: `Create CSS styles and Tailwind classes for: ${prompt}`,
      type: 'styling',
      context: 'v0.dev inspired design system'
    })
  }

  async generatePage(prompt: string): Promise<V0MCPResponse> {
    return this.generateComponent({
      prompt: `Create a complete page layout for: ${prompt}`,
      type: 'page',
      context: 'v0.dev inspired layout with sidebar, main content, and proper navigation'
    })
  }
}

export const v0MCPClient = new V0MCPClient()
