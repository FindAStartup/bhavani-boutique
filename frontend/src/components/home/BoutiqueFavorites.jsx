import React, { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';

const BoutiqueFavorites = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLatestProducts();
    }, []);

    const fetchLatestProducts = async () => {
        try {
            setLoading(true);
            // Fetch products, assuming the API returns them. 
            // We want the latest ones. If the API supports sorting, we add it here.
            // Otherwise we might need to sort client-side (though server-side is better).
            // For now, fetching all and slicing the top 8 newest.
            // Ideally: /api/products?sort=newest&limit=8
            // Based on CategoryProducts, it supports filtering, but let's try a standard fetch
            // and sort client side if needed, or check if API supports 'newest'.
            // CategoryProducts uses client-side sorting for 'newest'.

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            let allProducts = data.products || [];

            // Sort by created_at descending (newest first)
            allProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            // Take the top 8
            setProducts(allProducts.slice(0, 8));
        } catch (err) {
            console.error('Error fetching latest products:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mb-24 flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return null; // Or show an error message, but often better to hide section if it fails
    }

    if (products.length === 0) {
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
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default BoutiqueFavorites;
