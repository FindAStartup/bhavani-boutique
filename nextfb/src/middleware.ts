import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/supabase/middleware'

export async function middleware(request: NextRequest) {
    const response = await updateSession(request)

    // 🛡️ CRITICAL SAFETY CHECK
    if (!response) {
        return NextResponse.next()
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
