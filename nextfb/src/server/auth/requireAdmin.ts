import { createClient } from '@/supabase/server'
import { redirect } from 'next/navigation'
import { findUserProfileById } from '../repositories/user.repo'

export async function requireAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await findUserProfileById(user.id)

    if (profile?.role !== 'admin') {
        redirect('/admin')
    }

    return user
}
