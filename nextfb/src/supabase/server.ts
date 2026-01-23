import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This client IS for authenticated actions (Admin, User Profile, etc.)
// It forces Dynamic rendering because it checks cookies.
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

// 👇 NEW: This client is for PUBLIC data only (Products, Categories, etc.)
// It allows Static rendering because it returns empty cookies.
export async function createStaticClient() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return []
                },
                setAll(cookiesToSet) {
                    // Do nothing
                },
            },
        }
    )
}