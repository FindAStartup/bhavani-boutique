'use server'

import { createClient } from '@/supabase/server'
import { findUserProfileById } from '../repositories/user.repo'

export async function getUserRole() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Authentication required' }
    }

    try {
        const { data, error } = await findUserProfileById(user.id);

        if (error) {
            console.error('Error fetching profile:', error)
            return { error: 'Failed to fetch user role' }
        }

        if (!data) {
            return { error: 'User profile not found' }
        }

        return { role: data.role }
    } catch (err) {
        console.error('Server Error:', err)
        return { error: 'Internal Server Error' }
    }
}


