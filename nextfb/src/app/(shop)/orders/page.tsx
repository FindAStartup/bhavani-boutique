import React from 'react';
import Link from 'next/link';
import { createClient } from '@/supabase/server';

export default async function OrdersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                <div className="bg-stone-50 rounded-2xl p-12 border border-stone-100 max-w-2xl mx-auto shadow-sm">
                    <span className="material-icons-outlined text-stone-300 text-6xl mb-6">shopping_bag</span>
                    <h2 className="text-3xl font-display text-brand-maroon uppercase tracking-widest mb-4">Orders Restricted</h2>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        Login to view your purchase history and track your active orders.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="bg-brand-maroon text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md"
                        >
                            Login
                        </Link>
                        <Link
                            href="/"
                            className="bg-white text-stone-600 border border-stone-200 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-stone-50 transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Logic for fetching orders would go here
    // const { orders, error } = await getOrders();

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-display text-brand-maroon uppercase tracking-[0.2em] mb-4">My Orders</h1>
                <div className="w-24 h-1 bg-brand-maroon mx-auto"></div>
            </div>

            <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <span className="material-icons-outlined text-stone-300 text-5xl mb-4">history</span>
                <p className="text-slate-500 text-lg mb-4 italic">No orders found.</p>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    Once you make a purchase, your orders will appear here for you to track and manage.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#5d6b2e] transition-all"
                >
                    Start Shopping
                </Link>
            </div>
        </main>
    );
}
