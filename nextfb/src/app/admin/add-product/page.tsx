'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ImageUpload from '@/components/admin/ImageUpload';
import type { Category } from '@/lib/categories';
import type { EditableImage, SavedImageCrop } from '@/lib/image-crop';
import ProductPreviewModal from '@/components/admin/ProductPreviewModal';
import { Save, Eye, FileText, Loader2 } from 'lucide-react';
import { upsertProduct } from '@/server/actions/admin.actions';
import { createClient } from '@/supabase/client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AddProductPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddProduct />
        </Suspense>
    );
}

function AddProduct() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const supabase = createClient();

    const [categories, setCategories] = useState<Pick<Category, 'id' | 'name'>[]>([]);
    const [categoryError, setCategoryError] = useState('');
    const [images, setImages] = useState<EditableImage[]>([]);
    const [imagesUploading, setImagesUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        material_care: '',
        sustainability_impact: '',
        delivery_days: '7',
    });
    const [stock, setStock] = useState<{ size: string; quantity: number }[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productId) return;
            try {
                const { data: product, error } = await supabase
                    .from('products')
                    .select(`*, product_stock(*)`)
                    .eq('id', productId)
                    .single();

                if (error) throw error;

                if (product) {
                    setFormData({
                        name: product.name,
                        description: product.description || '',
                        price: product.price.toString(),
                        category_id: product.category_id ?? '',
                        material_care: product.material_care || '',
                        sustainability_impact: product.sustainability_impact || '',
                        delivery_days: (product.delivery_days || 7).toString(), // Default to 7 if null
                    });
                    const crops: Record<string, SavedImageCrop> = product.image_crops ?? {};
                    setImages((product.images ?? []).map((url: string) => ({ url, crop: crops[url] })));

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const sizes = product.product_stock.map((s: any) => s.size);
                    setSelectedSizes(sizes);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setStock(product.product_stock.map((s: any) => ({ size: s.size, quantity: s.stock_quantity })));
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
                alert('Failed to load product details for editing.');
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId, supabase]);

    useEffect(() => {
        let active = true;
        async function loadCategories() {
            const { data, error } = await supabase.from('categories').select('id, name')
                .order('display_order').order('slug');
            if (!active) return;
            if (error) setCategoryError('Could not load categories.');
            else setCategories(data);
        }
        void loadCategories();
        return () => { active = false; };
    }, [supabase]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSizeToggle = (size: string) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(prev => prev.filter(s => s !== size));
            setStock(prev => prev.filter(item => item.size !== size));
        } else {
            setSelectedSizes(prev => [...prev, size]);
            setStock(prev => [...prev, { size, quantity: 0 }]);
        }
    };

    const handleStockChange = (size: string, quantity: string) => {
        setStock(prev => prev.map(item =>
            item.size === size ? { ...item, quantity: parseInt(quantity) || 0 } : item
        ));
    };

    const validateForm = (isDraft = false) => {
        if (!formData.name.trim()) {
            alert('Product name is required');
            return false;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            alert('Valid price is required');
            return false;
        }
        if (!categories.some(category => category.id === formData.category_id)) {
            alert('Choose a category before saving.');
            return false;
        }
        if (!isDraft && images.length < 4) {
            // In legacy it was 4, let's keep it or make it 1 for easier testing
            alert('Please upload at least 4 images');
            return false;
        }
        if (!isDraft && selectedSizes.length === 0) {
            alert('Please select at least one size');
            return false;
        }
        return true;
    };

    const handleSubmit = async (isDraft = false) => {
        if (loading || imagesUploading || !validateForm(isDraft)) return;

        setLoading(true);
        try {
            const productData = {
                id: productId, // Include ID if editing
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category_id: formData.category_id,
                material_care: formData.material_care,
                sustainability_impact: formData.sustainability_impact,
                delivery_days: parseInt(formData.delivery_days),
                images: images.map(img => img.url),
                image_crops: Object.fromEntries(images.flatMap(image => image.crop ? [[image.url, image.crop]] : [])),
                stock: stock,
                is_draft: isDraft
            };

            const result = await upsertProduct(productData);

            if (result.success) {
                const message = isDraft
                    ? '✅ Product saved as draft!'
                    : '🎉 Product published successfully!';
                alert(message);
                router.push('/admin');
            } else {
                throw new Error(result.error || 'Failed to create product');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Submit error:', error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <AdminHeader
                title="Add New Product"
                subtitle="Create a stunning product listing for your boutique"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Information */}
                    <section className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <h3 className="text-lg font-serif font-semibold mb-6 text-stone-800">General Information</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#5d6b2e] focus:ring-1 focus:ring-[#5d6b2e] transition-all outline-none text-stone-800 placeholder:text-stone-400"
                                    placeholder="e.g. Silk Evening Gown"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                                        Category *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#5d6b2e] focus:ring-1 focus:ring-[#5d6b2e] transition-all outline-none text-stone-800 appearance-none bg-white"
                                        >
                                            <option value="" disabled>Choose a category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        {categoryError && <p role="alert" className="mt-1 text-sm text-red-700">{categoryError}</p>}
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#5d6b2e] focus:ring-1 focus:ring-[#5d6b2e] transition-all outline-none text-stone-800 placeholder:text-stone-400"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                                        Delivery Days
                                    </label>
                                    <input
                                        type="number"
                                        name="delivery_days"
                                        value={formData.delivery_days}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#5d6b2e] focus:ring-1 focus:ring-[#5d6b2e] transition-all outline-none text-stone-800 placeholder:text-stone-400"
                                        placeholder="7"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#5d6b2e] focus:ring-1 focus:ring-[#5d6b2e] transition-all outline-none text-stone-800 placeholder:text-stone-400 resize-none"
                                    placeholder="Describe the product details, material, and fit..."
                                    rows={6}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                                        Material & Care
                                    </label>
                                    <textarea
                                        name="material_care"
                                        value={formData.material_care}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#5d6b2e] focus:ring-1 focus:ring-[#5d6b2e] transition-all outline-none text-stone-800 placeholder:text-stone-400 resize-none"
                                        placeholder="e.g. 100% Cotton, Hand wash..."
                                        rows={4}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                                        Sustainability & Impact
                                    </label>
                                    <textarea
                                        name="sustainability_impact"
                                        value={formData.sustainability_impact}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#5d6b2e] focus:ring-1 focus:ring-[#5d6b2e] transition-all outline-none text-stone-800 placeholder:text-stone-400 resize-none"
                                        placeholder="e.g. Eco-friendly dye..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Available Sizes & Stock */}
                    <section className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <h3 className="text-lg font-serif font-semibold mb-6 text-stone-800">Available Sizes & Stock</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                                    Select Sizes
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {SIZES.map(size => {
                                        const isSelected = selectedSizes.includes(size);
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => handleSizeToggle(size)}
                                                className={`
                                                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all
                                                    ${isSelected
                                                        ? 'bg-[#5d6b2e] text-white shadow-md shadow-[#5d6b2e]/20 scale-105'
                                                        : 'bg-white border border-stone-200 text-stone-600 hover:border-[#5d6b2e] hover:text-[#5d6b2e]'
                                                    }
                                                `}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedSizes.length > 0 && (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                                        <h4 className="text-sm font-medium text-stone-800 mb-4">Stock Quantity per Size</h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {stock.map(item => (
                                                <div key={item.size} className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold text-stone-500 uppercase">Size {item.size}</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleStockChange(item.size, e.target.value)}
                                                        className="w-full px-3 py-1.5 rounded border border-stone-200 focus:border-[#5d6b2e] focus:ring-1 focus:ring-[#5d6b2e] outline-none text-stone-800 text-sm font-medium"
                                                        placeholder="0"
                                                        min="0"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column - Images & Actions */}
                <div className="space-y-6">
                    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <ImageUpload images={images} setImages={setImages} onUploadingChange={setImagesUploading} disabled={loading} />
                    </section>

                    {/* Action Buttons */}
                    <section className="space-y-3">
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={loading || imagesUploading}
                            className="w-full bg-[#550000] hover:bg-[#440000] text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                            {loading ? 'Publishing...' : 'Publish Product'}
                        </button>

                        <button
                            onClick={() => setShowPreview(true)}
                            className="w-full bg-[#FFD700] hover:bg-[#e6c200] text-[#550000] font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Eye size={20} />
                            Preview Product
                        </button>

                        <button
                            onClick={() => handleSubmit(true)}
                            disabled={loading || imagesUploading}
                            className="w-full bg-white border-2 border-[#FFD700] hover:bg-[#FFD700]/10 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileText size={20} />
                            Save as Draft
                        </button>
                    </section>
                </div>
            </div>

            {/* Preview Modal */}
            <ProductPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                productData={{
                    ...formData,
                    category: categories.find(category => category.id === formData.category_id)?.name,
                    images: images.map(img => img.url),
                    stock: stock
                }}
            />
        </div >
    );
}



