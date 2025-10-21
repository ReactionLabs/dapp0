import { NextResponse } from 'next/server'
import { sql } from '@/lib/neon/server'

export async function GET() {
  try {
    // Test database connection
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: result[0]
    })
  } catch (error) {
    console.error('Database connection test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
