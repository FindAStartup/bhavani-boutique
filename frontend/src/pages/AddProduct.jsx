import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminHeader from '../components/admin/AdminHeader';
import ImageUpload from '../components/admin/ImageUpload';
import ProductPreviewModal from '../components/admin/ProductPreviewModal';
import { Save, Eye, FileText } from 'lucide-react';

const CATEGORIES = ['Corset', 'Saree', 'Kurties', 'Set Mund', 'Bottoms'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const AddProduct = () => {
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
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

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

    const validateForm = (isDraft = false) => {
        if (!formData.name.trim()) {
            alert('Product name is required');
            return false;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            alert('Valid price is required');
            return false;
        }
        if (!isDraft && images.length < 4) {
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
        if (!validateForm(isDraft)) return;

        setLoading(true);
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                delivery_days: parseInt(formData.delivery_days),
                images: images.map(img => img.url),
                stock: stock,
                is_draft: isDraft
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message with better UX
                const message = isDraft
                    ? '✅ Product saved as draft! You can edit it later.'
                    : '🎉 Product published successfully!';
                alert(message);
                navigate('/admin');
            } else {
                throw new Error(data.error || 'Failed to create product');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = () => {
        handleSubmit(true);
    };

    const handlePreview = () => {
        if (!formData.name.trim()) {
            alert('Please enter a product name to preview');
            return;
        }
        setShowPreview(true);
    };

    return (
        <AdminLayout>
            <AdminHeader
                title="Add New Product"
                subtitle="Create a stunning product listing for your boutique"
            />

            <div className="max-w-6xl mx-auto">
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
                                    <div className="mt-4 space-y-3">
                                        <p className="text-sm font-medium text-slate-700">Stock Quantity per Size:</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {stock.map(item => (
                                                <div key={item.size} className="space-y-1">
                                                    <label className="text-sm font-medium text-slate-600">
                                                        {item.size}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleStockChange(item.size, e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
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
                                onClick={() => handleSubmit(false)}
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={20} />
                                {loading ? 'Publishing...' : 'Publish Product'}
                            </button>

                            <button
                                onClick={handlePreview}
                                className="w-full bg-maroon hover:bg-maroon/90 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Eye size={20} />
                                Preview Product
                            </button>

                            <button
                                onClick={handleSaveDraft}
                                disabled={loading}
                                className="w-full bg-white border-2 border-gold hover:bg-gold/10 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FileText size={20} />
                                Save as Draft
                            </button>
                        </section>

                        {/* Publishing Tip */}
                        <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-lg">
                            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                                Publishing Tip
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Ensure your product images are high resolution (at least 1200x1200px) for the best customer experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            <ProductPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                productData={{
                    ...formData,
                    images: images.map(img => img.url),
                    stock: stock
                }}
            />
        </AdminLayout>
    );
};

export default AddProduct;

