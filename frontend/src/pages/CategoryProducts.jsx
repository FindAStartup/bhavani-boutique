import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import CategoryHero from '../components/product/CategoryHero';
import FilterBar from '../components/product/FilterBar';
import ProductCard from '../components/product/ProductCard';

const CategoryProducts = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState('all');

    // Category descriptions
    const categoryDescriptions = {
        'Cordset': '"Timeless elegance meets modern sophistication in our handcrafted cordset collection."',
        'Saree': '"Drape yourself in tradition with our exquisite collection of handwoven sarees."',
        'Kurties': '"Contemporary comfort blended with traditional charm for the modern woman."',
        'Set Mund': '"Embodying the soul of Kerala—our Set Mund collection blends centuries of tradition with contemporary elegance."',
        'Bottoms': '"Complete your ethnic ensemble with our curated collection of traditional bottoms."'
    };

    useEffect(() => {
        fetchProducts();
    }, [category]);

    useEffect(() => {
        applyFiltersAndSort();
    }, [products, sortBy, priceRange]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/products?category=${encodeURIComponent(category)}&is_draft=false`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data.products || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...products];

        // Apply price filter
        if (priceRange !== 'all') {
            filtered = filtered.filter(product => {
                const price = parseFloat(product.price);
                switch (priceRange) {
                    case 'under1000':
                        return price < 1000;
                    case '1000-2000':
                        return price >= 1000 && price <= 2000;
                    case '2000-5000':
                        return price >= 2000 && price <= 5000;
                    case 'above5000':
                        return price > 5000;
                    default:
                        return true;
                }
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseFloat(a.price) - parseFloat(b.price);
                case 'price-high':
                    return parseFloat(b.price) - parseFloat(a.price);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'newest':
                default:
                    return new Date(b.created_at) - new Date(a.created_at);
            }
        });

        setFilteredProducts(filtered);
    };

    return (
        <MainLayout>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Category Hero Section */}
                <CategoryHero
                    category={category}
                    description={categoryDescriptions[category] || `"Discover our exclusive ${category} collection."`}
                />

                {/* Filter & Sort Bar */}
                <FilterBar
                    totalItems={filteredProducts.length}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                />

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                            <p className="text-xl text-slate-600 dark:text-slate-400">
                                Failed to load products. Please try again later.
                            </p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="flex justify-center items-center py-32">
                        <div className="text-center">
                            <span className="material-icons-outlined text-[120px] text-slate-300 mb-6">inventory_2</span>
                            <h2 className="text-4xl font-bold text-slate-700 mb-3">No items are present</h2>
                            <p className="text-slate-500 text-lg">
                                Check back soon for new arrivals in this category.
                            </p>
                        </div>
                    </div>
                )}

                {/* Product Grid - Filtered and Sorted */}
                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </MainLayout>
    );
};

export default CategoryProducts;
