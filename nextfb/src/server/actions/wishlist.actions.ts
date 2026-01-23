'use server'

import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserWishlist() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Authentication required' }
    }

    try {
        // Fetch wishlist items with full product details
        const { data: wishlistItems, error } = await supabase
            .from('wishlists')
            .select(`
                id,
                created_at,
                product_id,
                products (
                    id,
                    name,
                    description,
                    price,
                    category,
                    images,
                    material_care,
                    sustainability_impact,
                    delivery_days,
                    created_at,
                    product_stock (
                        size,
                        stock_quantity
                    )
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get wishlist error:', error);
            return { error: error.message };
        }

        // Transform the data to flatten product details
        // Note: Typescript might complain about the shape here without proper types, 
        // but logic mimics the original controller
        const formattedWishlist = wishlistItems.map((item: any) => ({
            wishlist_id: item.id,
            added_at: item.created_at,
            ...item.products
        }));

        return { wishlist: formattedWishlist, count: formattedWishlist.length };
    } catch (error) {
        console.error('Get user wishlist error:', error);
        return { error: 'Internal server error' };
    }
}

export async function addToWishlist(product_id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Authentication required' }
    }

    if (!product_id) {
        return { error: 'Product ID is required' };
    }

    try {
        // Check if product exists
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('id')
            .eq('id', product_id)
            .single();

        if (productError || !product) {
            return { error: 'Product not found' };
        }

        // Add to wishlist (unique constraint will prevent duplicates)
        const { data: wishlistItem, error } = await supabase
            .from('wishlists')
            .insert([{
                user_id: user.id,
                product_id: product_id
            }])
            .select()
            .single();

        if (error) {
            // Check if it's a duplicate entry error
            if (error.code === '23505') {
                return { error: 'Product already in wishlist' };
            }
            console.error('Add to wishlist error:', error);
            return { error: error.message };
        }

        revalidatePath('/wishlist')
        return { success: true, message: 'Product added to wishlist', wishlist_item: wishlistItem };
    } catch (error) {
        console.error('Add to wishlist error:', error);
        return { error: 'Internal server error' };
    }
}

export async function removeFromWishlist(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Authentication required' }
    }

    try {
        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);

        if (error) {
            console.error('Remove from wishlist error:', error);
            return { error: error.message };
        }

        revalidatePath('/wishlist')
        return { success: true, message: 'Product removed from wishlist' };
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        return { error: 'Internal server error' };
    }
}

export async function checkWishlistStatus(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { in_wishlist: false }
    }

    try {
        const { data, error } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Check wishlist status error:', error);
            return { error: error.message };
        }

        return { in_wishlist: !!data };
    } catch (error) {
        console.error('Check wishlist status error:', error);
        return { error: 'Internal server error' };
    }
}

