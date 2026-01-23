import { createClient } from '@/supabase/server'

export async function insertSubscriber(email: string) {
    const supabase = await createClient()
    return await supabase
        .from('newsletter')
        .insert([{ email }]);
}
