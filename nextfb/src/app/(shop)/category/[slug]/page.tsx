import { notFound } from 'next/navigation';
import { categorySlug } from '@/lib/categories';
import { listCategories } from '@/server/repositories/category.repo';
import { getProducts } from '@/server/actions/product.actions';
import CategoryHero from '@/components/product/CategoryHero';
import ProductListing from '@/components/product/ProductListing';

// Category descriptions map
const categoryDescriptions: Record<string, string> = {
    cordset: '"Timeless elegance meets modern sophistication in our handcrafted cordset collection."',
    saree: '"Drape yourself in tradition with our exquisite collection of handwoven sarees."',
    kurties: '"Contemporary comfort blended with traditional charm for the modern woman."',
    'set-mund': '"Embodying the soul of Kerala—our Set Mund collection blends centuries of tradition with contemporary elegance."',
    bottoms: '"Complete your ethnic ensemble with our curated collection of traditional bottoms."'
};

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const categories = await listCategories();
    const category = categories.find(item => item.slug === categorySlug(slug));
    if (!category) notFound();

    const { products, error } = await getProducts({ categoryId: category.id });

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

    const description = categoryDescriptions[category.slug] || `"Discover our exclusive ${category.name} collection."`;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CategoryHero
                category={category.name}
                description={description}
            />

            <ProductListing initialProducts={products || []} />
        </main>
    );
}

