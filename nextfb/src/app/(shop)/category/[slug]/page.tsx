import React from 'react';
import { getProducts } from '@/server/actions/product.actions';
import CategoryHero from '@/components/product/CategoryHero';
import ProductListing from '@/components/product/ProductListing';

// Category descriptions map
const categoryDescriptions: Record<string, string> = {
    'Cordset': '"Timeless elegance meets modern sophistication in our handcrafted cordset collection."',
    'Saree': '"Drape yourself in tradition with our exquisite collection of handwoven sarees."',
    'Kurties': '"Contemporary comfort blended with traditional charm for the modern woman."',
    'Set Mund': '"Embodying the soul of Kerala—our Set Mund collection blends centuries of tradition with contemporary elegance."',
    'Bottoms': '"Complete your ethnic ensemble with our curated collection of traditional bottoms."'
};

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const decodedCategory = decodeURIComponent(slug);

    const { products, error } = await getProducts({ category: decodedCategory });

    if (error) {
        // Handle error - could be improved with a dedicated error.tsx or error UI
        console.error("Error fetching products:", error);
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-2xl font-bold text-red-600">Failed to load products</h2>
                <p className="text-slate-600 mt-2">Please try again later.</p>
            </div>
        );
    }

    // Optional: If you want to force 404 for unknown categories or empty lists, do it here.
    // For now, valid empty lists are handled by ProductListing.

    const description = categoryDescriptions[decodedCategory] || `"Discover our exclusive ${decodedCategory} collection."`;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CategoryHero
                category={decodedCategory}
                description={description}
            />

            <ProductListing initialProducts={products || []} />
        </main>
    );
}
