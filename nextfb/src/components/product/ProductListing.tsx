'use client';

import React from 'react';
import ProductCard from './ProductCard';

interface ProductListingProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialProducts: any[];
}

const ProductListing: React.FC<ProductListingProps> = ({ initialProducts }) => {

    if (initialProducts.length === 0) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="text-center">
                    <span className="material-icons-outlined text-[120px] text-slate-300 mb-6">inventory_2</span>
                    <h2 className="text-4xl font-bold text-slate-700 mb-3">No items are present</h2>
                    <p className="text-slate-500 text-lg">
                        Check back soon for new arrivals in this category.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {initialProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductListing;
