import React from 'react';
import ProductCard from '@/components/product/ProductCard';
import { getRelatedProducts } from '@/server/actions/product.actions';

interface RelatedProductsProps {
    category: string;
    currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = async ({ category, currentProductId }) => {
    const { products, error } = await getRelatedProducts(category, currentProductId);

    if (error || !products || products.length === 0) {
        return null; // Don't show anything if no related products or error
    }

    return (
        <section className="mt-12 sm:mt-16" aria-labelledby="related-products-heading">
            <h2 id="related-products-heading" className="text-xl sm:text-2xl font-display font-bold text-slate-900 mb-6">
                You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;
