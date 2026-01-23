import React from 'react';
import ProductCard from '../product/ProductCard';
import { getProducts } from '@/server/actions/product.actions';

const BoutiqueFavorites = async () => {
    // Fetch products on the server
    const { products, error } = await getProducts();

    if (error || !products) {
        return null; // Handle error gracefully or show error UI
    }

    // Sort by created_at descending (newest first) and take top 8
    const latestProducts = [...products]
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8);

    if (latestProducts.length === 0) {
        return null;
    }

    return (
        <div className="mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Latest Arrivals</h2>
                    <div className="h-1 w-20 bg-brand-maroon rounded-full"></div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-12">
                {latestProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default BoutiqueFavorites;

