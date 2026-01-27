'use server';

import { createClient } from '@supabase/supabase-js';

export async function checkEmailAvailability(email: string) {
    if (!email || !email.includes('@')) {
        return { available: false, message: 'Invalid email address.' };
    }

    if (!email.toLowerCase().endsWith('.com')) {
        return { available: false, message: 'Email must end with .com' };
    }

    // Check if Service Role Key is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Check Email Error: SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.');
        // We return true (available) so the user isn't blocked, but we log the error for the developer.
        // The final signup step will still catch duplicates, but the "early check" won't work.
        return { available: true };
    }

    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Try to list users - iterating pages to find the email
        // Note: This is an O(N) operation and not scalable for millions of users.
        // Ideally, in a real production app, you'd use a unique constraint on a public "profiles" table
        // or a dedicated Edge Function that uses direct DB access.
        // For now, we'll check the first 1000 users which covers most dev/startup cases.
        // Note: listUsers() page default size is 50.

        let found = false;
        let page = 1;
        const perPage = 100; // Check up to 100 users per batch

        // We will limit to checking the first 1000 users to prevent timeouts.
        while (page <= 10) {
            const { data, error } = await supabaseAdmin.auth.admin.listUsers({
                page: page,
                perPage: perPage
            });

            if (error) {
                console.error('Supabase Admin Error:', error);
                return { available: true }; // Fail open
            }

            const users = data.users;
            if (users.length === 0) break; // No more users

            found = users.some(u => u.email?.toLowerCase() === email.toLowerCase());
            if (found) break;

            page++;
        }

        if (found) {
            return {
                available: false,
                message: 'This email is already registered. Please sign in.'
            };
        }

        return { available: true };
    } catch (error) {
        console.error('Check Email Critical Error:', error);
        return { available: true };
    }
}
