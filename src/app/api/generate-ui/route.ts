import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { v0MCPClient } from '@/lib/v0-mcp-client'

const GenerateUIRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  type: z.enum(['component', 'page', 'styling']),
  context: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, type, context } = GenerateUIRequestSchema.parse(body)

    const response = await v0MCPClient.generateComponent({
      prompt,
      type,
      context
    })

    if (response.success) {
      return NextResponse.json({
        success: true,
        code: response.code,
        components: response.components,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        error: response.error || 'Failed to generate UI component'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('UI generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate UI component' },
      { status: 500 }
    )
  }
}
