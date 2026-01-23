import { createClient } from '@/supabase/server'

export async function findCartByUserId(userId: string) {
    const supabase = await createClient()
    return await supabase
        .from('cart_items')
        .select(`
            *,
            products (
                name,
                price,
                images,
                category
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
}

export async function findCartItem(userId: string, productId: string, size: string) {
    const supabase = await createClient()
    return await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('size', size)
        .single();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertCartItem(item: any) {
    const supabase = await createClient()
    return await supabase
        .from('cart_items')
        .insert(item);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateCartItemById(id: string, updates: any) {
    const supabase = await createClient()
    return await supabase
        .from('cart_items')
        .update(updates)
        .eq('id', id);
}

export async function deleteCartItemById(id: string) {
    const supabase = await createClient()
    return await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);
}
