'use server';

import { revalidatePath } from 'next/cache';
import * as cartService from '../services/cart.service'

export async function getCart() {
    try {
        const { cartItems } = await cartService.getCartService();
        return { cartItems, error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error fetching cart:', error);
        return { cartItems: null, error: error.message };
    }
}

export async function addToCart(productId: string, quantity: number, size: string) {
    try {
        await cartService.addToCartService(productId, quantity, size);
        revalidatePath('/cart');
        return { success: true };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error adding to cart:', error);
        return { error: error.message };
    }
}

export async function updateCartItem(cartId: string, quantity: number) {
    try {
        await cartService.updateCartItemQuantityService(cartId, quantity);
        revalidatePath('/cart');
        return { success: true };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error updating cart item:', error);
        return { error: error.message };
    }
}

export async function removeCartItem(cartId: string) {
    try {
        await cartService.deleteCartItemService(cartId);
        revalidatePath('/cart');
        return { success: true };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error removing cart item:', error);
        return { error: error.message };
    }
}


