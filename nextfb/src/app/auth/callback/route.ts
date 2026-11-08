import { NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            if (next.startsWith('/') && URL.canParse(next, origin)) {
                const destination = new URL(next, origin);
                if (destination.origin === origin) return NextResponse.redirect(destination);
            }
            return NextResponse.redirect(new URL('/', origin));
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
