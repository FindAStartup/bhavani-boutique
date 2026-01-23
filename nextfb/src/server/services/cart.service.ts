import * as cartRepo from '../repositories/cart.repo'
import { createClient } from '@/supabase/server'

export async function getCartService() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { cartItems: [] };

    const { data: cartItems, error } = await cartRepo.findCartByUserId(user.id);
    if (error) throw error;
    return { cartItems };
}

export async function addToCartService(productId: string, quantity: number, size: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data: existingItem } = await cartRepo.findCartItem(user.id, productId, size);

    if (existingItem) {
        const { error } = await cartRepo.updateCartItemById(existingItem.id, {
            quantity: existingItem.quantity + quantity
        });
        if (error) throw error;
    } else {
        const { error } = await cartRepo.insertCartItem({
            user_id: user.id,
            product_id: productId,
            quantity,
            size
        });
        if (error) throw error;
    }

    return true;
}

export async function updateCartItemQuantityService(cartId: string, quantity: number) {
    if (quantity <= 0) {
        return deleteCartItemService(cartId);
    }

    const { error } = await cartRepo.updateCartItemById(cartId, { quantity });
    if (error) throw error;
    return true;
}

export async function deleteCartItemService(cartId: string) {
    const { error } = await cartRepo.deleteCartItemById(cartId);
    if (error) throw error;
    return true;
}
