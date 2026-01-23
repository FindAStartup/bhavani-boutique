import { createClient } from '@/supabase/server'

export async function findUserProfileById(userId: string) {
    const supabase = await createClient()
    return await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
}
