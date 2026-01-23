'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { getCart, addToCart as addToCartAction, updateCartItem as updateCartItemAction, removeCartItem as removeCartItemAction } from '@/server/actions/cart.actions';

interface CartContextType {
    cartItems: any[];
    cartCount: number;
    loading: boolean;
    addItem: (productId: string, quantity: number, size: string) => Promise<void>;
    updateItem: (cartId: string, quantity: number) => Promise<void>;
    removeItem: (cartId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchCart = async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        setLoading(true);
        const { cartItems: items, error } = await getCart();
        if (!error && items) {
            setCartItems(items);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!authLoading) {
            fetchCart();
        }
    }, [user, authLoading]);

    const addItem = async (productId: string, quantity: number, size: string) => {
        if (!user) {
            router.push('/login'); // We need to create this route or auth flow
            return;
        }

        // Optimistic UI update could happen here, but for now we'll wait for server
        const { success, error } = await addToCartAction(productId, quantity, size);
        if (success) {
            await fetchCart();
            alert("Added to cart!"); // Temporary feedback
        } else {
            alert("Failed to add to cart");
            console.error(error);
        }
    };

    const updateItem = async (cartId: string, quantity: number) => {
        if (!user) return;

        await updateCartItemAction(cartId, quantity);
        await fetchCart();
    };

    const removeItem = async (cartId: string) => {
        if (!user) return;

        await removeCartItemAction(cartId);
        await fetchCart();
    };

    const refreshCart = async () => {
        await fetchCart();
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, loading, addItem, updateItem, removeItem, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};



