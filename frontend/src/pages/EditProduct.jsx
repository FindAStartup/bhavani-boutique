import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminHeader from '../components/admin/AdminHeader';
import ImageUpload from '../components/admin/ImageUpload';
import { Save, ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Corset', 'Saree', 'Kurties', 'Set Mund', 'Bottoms'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

/**
 * EditProduct Page
 * Allows editing existing products (including drafts)
 */
const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: CATEGORIES[0],
        material_care: '',
        sustainability_impact: '',
        delivery_days: 7,
    });
    const [stock, setStock] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
            const data = await response.json();

            if (response.ok) {
                const product = data.product;
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    category: product.category || CATEGORIES[0],
                    material_care: product.material_care || '',
                    sustainability_impact: product.sustainability_impact || '',
                    delivery_days: product.delivery_days || 7,
                });

                // Set images
                if (product.images) {
                    setImages(product.images.map((url, index) => ({ url, id: index })));
                }

                // Set stock and selected sizes
                if (product.product_stock) {
                    const sizes = product.product_stock.map(s => s.size);
                    setSelectedSizes(sizes);
                    setStock(product.product_stock.map(s => ({
                        size: s.size,
                        quantity: s.stock_quantity
                    })));
                }
            } else {
                alert('Product not found');
                navigate('/admin/drafts');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Error loading product');
            navigate('/admin/drafts');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSizeToggle = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(prev => prev.filter(s => s !== size));
            setStock(prev => prev.filter(item => item.size !== size));
        } else {
            setSelectedSizes(prev => [...prev, size]);
            setStock(prev => [...prev, { size, quantity: 0 }]);
        }
    };

    const handleStockChange = (size, quantity) => {
        setStock(prev => prev.map(item =>
            item.size === size ? { ...item, quantity: parseInt(quantity) || 0 } : item
        ));
    };

    const handleUpdate = async (publishNow = false) => {
        if (!formData.name.trim()) {
            alert('Product name is required');
            return;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            alert('Valid price is required');
            return;
        }

        setSaving(true);
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                delivery_days: parseInt(formData.delivery_days),
                images: images.map(img => img.url),
                stock: stock,
                is_draft: !publishNow
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(publishNow ? '🎉 Product published successfully!' : '✅ Product updated successfully!');
                navigate('/admin/drafts');
            } else {
                throw new Error(data.error || 'Failed to update product');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <AdminHeader title="Edit Product" subtitle="Update product information" />
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <AdminHeader
                title="Edit Product"
                subtitle="Update product information"
            />

            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/admin/drafts')}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Drafts</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* General Information */}
                        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold mb-6 text-slate-800">General Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="e.g. Silk Evening Gown"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Price (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Delivery Days
                                    </label>
                                    <input
                                        type="number"
                                        name="delivery_days"
                                        value={formData.delivery_days}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="7"
                                        min="1"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Estimated delivery time in days
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="Enter product description..."
                                        rows="5"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Available Sizes & Stock */}
                        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4 text-slate-800">Available Sizes & Stock</h3>
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-3">
                                    {SIZES.map(size => (
                                        <label
                                            key={size}
                                            className="inline-flex items-center cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedSizes.includes(size)}
                                                onChange={() => handleSizeToggle(size)}
                                                className="rounded border-slate-300 text-primary focus:ring-primary h-5 w-5"
                                            />
                                            <span className="ml-2 text-slate-700 font-medium">{size}</span>
                                        </label>
                                    ))}
                                </div>

                                {selectedSizes.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium text-slate-700">Stock Quantity per Size:</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {stock.map(item => (
                                                <div key={item.size} className="flex items-center gap-2">
                                                    <label className="text-sm font-medium text-slate-600 w-10">
                                                        {item.size}:
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleStockChange(item.size, e.target.value)}
                                                        className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                        placeholder="0"
                                                        min="0"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Material Care & Sustainability */}
                        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4 text-slate-800">Additional Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Material & Care
                                    </label>
                                    <textarea
                                        name="material_care"
                                        value={formData.material_care}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="e.g. Hand wash only, Do not bleach, Dry flat..."
                                        rows="3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Sustainability & Impact
                                    </label>
                                    <textarea
                                        name="sustainability_impact"
                                        value={formData.sustainability_impact}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="e.g. Made from organic materials, Eco-friendly packaging..."
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Images & Actions */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <ImageUpload images={images} setImages={setImages} />
                        </section>

                        {/* Action Buttons */}
                        <section className="space-y-3">
                            <button
                                onClick={() => handleUpdate(false)}
                                disabled={saving}
                                className="w-full bg-primary hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Save size={20} />
                                {saving ? 'Saving...' : 'Update Draft'}
                            </button>

                            <button
                                onClick={() => handleUpdate(true)}
                                disabled={saving}
                                className="w-full bg-accent hover:opacity-90 text-secondary font-semibold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Save size={20} />
                                Publish Now
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditProduct;
