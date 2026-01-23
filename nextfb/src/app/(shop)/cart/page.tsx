'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

const CartPage = () => {
    const { cartItems, loading, updateItem, removeItem, cartCount } = useCart();

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            // Handle case where products might be null if deleted (though db logic should prevent or cascade, but safely)
            if (!item.products) return total;
            return total + (parseFloat(item.products.price) * item.quantity);
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h1>
                <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Shopping Cart ({cartCount})</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 sm:gap-6 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow">
                            {/* Product Image */}
                            <div className="relative w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                                {item.products?.images && item.products.images[0] ? (
                                    <Image
                                        src={item.products.images[0]}
                                        alt={item.products.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-lg text-slate-900 line-clamp-2">
                                            <Link href={`/product/${item.product_id}`} className="hover:text-primary transition-colors">
                                                {item.products?.name || 'Product Details Unavailable'}
                                            </Link>
                                        </h3>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Size: {item.size}</p>
                                    <p className="text-lg font-medium text-slate-900 mt-2">
                                        ₹{parseFloat(item.products?.price || '0').toLocaleString('en-IN')}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center border border-slate-200 rounded-lg">
                                        <button
                                            onClick={() => updateItem(item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-slate-50 text-slate-600 transition-colors"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateItem(item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-slate-50 text-slate-600 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-50 rounded-xl p-6 lg:sticky lg:top-24 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-lg text-slate-900">
                                <span>Total</span>
                                <span>₹{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all">
                            Proceed to Checkout
                        </button>

                        <p className="text-xs text-slate-500 text-center mt-4">
                            Secure Checkout - SSL Encrypted
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CartPage;
