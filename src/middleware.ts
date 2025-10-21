import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if Neon database URL is available
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL environment variable not found. Skipping database middleware.')
    return res
  }

  // For now, we'll handle authentication at the API level
  // You can add session validation here if needed
  
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
