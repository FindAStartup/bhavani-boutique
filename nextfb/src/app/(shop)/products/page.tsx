'use server';

import React from 'react';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/server/actions/product.actions';

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const { search } = await searchParams;
    const searchQuery = typeof search === 'string' ? search : undefined;
    const { products, error } = await getProducts({ search: searchQuery });

    if (error || !products) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-red-500">Failed to load products. please try again later.</p>
            </div>
        );
    }

    return (
        <div className="w-full px-6 lg:px-12 py-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-8 md:mb-12 text-center">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    No products found.
                </div>
            )}
        </div>
    );
}
