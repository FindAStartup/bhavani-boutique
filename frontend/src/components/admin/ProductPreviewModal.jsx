import React from 'react';
import { X, ShoppingCart, Zap, Package } from 'lucide-react';

/**
 * ProductPreviewModal
 * Shows a preview of how the product will look on the customer-facing page
 */
const ProductPreviewModal = ({ isOpen, onClose, productData }) => {
    const [selectedSize, setSelectedSize] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [activeImage, setActiveImage] = React.useState(0);
    const [openAccordion, setOpenAccordion] = React.useState(null);

    if (!isOpen) return null;

    const { name, description, price, category, images, material_care, sustainability_impact, delivery_days, stock } = productData;

    // Convert stock array to sizes format with stock info
    const sizes = stock?.map(s => ({
        size: s.size,
        available: s.quantity > 0,
        stock: s.quantity
    })) || [];

    const maxQuantity = selectedSize
        ? (sizes.find(s => s.size === selectedSize)?.stock || 0)
        : 0;

    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full my-8 relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors"
                >
                    <X size={24} className="text-slate-600" />
                </button>

                {/* Preview Badge */}
                <div className="absolute top-4 left-4 z-10 bg-accent text-secondary px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    👁️ PREVIEW MODE
                </div>

                {/* Product Content */}
                <div className="p-8 pt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Images */}
                        <div>
                            {images && images.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Main Image */}
                                    <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden">
                                        <img
                                            src={images[activeImage]}
                                            alt={name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                            }}
                                        />
                                    </div>
                                    {/* Thumbnails */}
                                    {images.length > 1 && (
                                        <div className="grid grid-cols-5 gap-2">
                                            {images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveImage(idx)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`${name} ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
                                    <Package size={64} className="text-slate-300" />
                                </div>
                            )}
                        </div>

                        {/* Right: Product Info */}
                        <div className="space-y-6">
                            {/* Product Header - NO RATINGS */}
                            <div>
                                {category && (
                                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                        {category}
                                    </span>
                                )}
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                    {name || 'Product Name'}
                                </h1>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-primary">
                                    ₹{parseFloat(price || 0).toFixed(2)}
                                </span>
                                <span className="text-sm text-slate-500">
                                    Inclusive of all taxes
                                </span>
                            </div>

                            {/* Description */}
                            {description && (
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            )}

                            {/* Size Selector with Stock */}
                            {sizes.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-slate-900">Select Size</h3>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {sizes.map((sizeObj) => (
                                            <button
                                                key={sizeObj.size}
                                                onClick={() => sizeObj.available && setSelectedSize(sizeObj.size)}
                                                disabled={!sizeObj.available}
                                                className={`relative py-3 px-4 rounded-lg border-2 font-medium transition-all ${selectedSize === sizeObj.size
                                                    ? 'border-primary bg-primary text-white'
                                                    : sizeObj.available
                                                        ? 'border-slate-300 hover:border-primary'
                                                        : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                <div className="text-center">
                                                    <div className="font-semibold">{sizeObj.size}</div>
                                                    <div className="text-xs mt-1">
                                                        {sizeObj.available ? `${sizeObj.stock} left` : 'Out of stock'}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            {selectedSize && maxQuantity > 0 && (
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3">Quantity</h3>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg border-2 border-slate-300 hover:border-primary transition-colors flex items-center justify-center font-semibold"
                                        >
                                            −
                                        </button>
                                        <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                                            className="w-10 h-10 rounded-lg border-2 border-slate-300 hover:border-primary transition-colors flex items-center justify-center font-semibold"
                                        >
                                            +
                                        </button>
                                        <span className="text-sm text-slate-500">Max: {maxQuantity}</span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    disabled
                                    className="w-full bg-primary text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button
                                    disabled
                                    className="w-full bg-accent text-secondary font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                                >
                                    <Zap size={20} />
                                    Buy Now
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 py-4 border-y">
                                <div className="text-center">
                                    <div className="text-2xl mb-1">🚚</div>
                                    <div className="text-xs font-medium text-slate-600">Free Delivery</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl mb-1">🌱</div>
                                    <div className="text-xs font-medium text-slate-600">Eco-Friendly</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl mb-1">🔒</div>
                                    <div className="text-xs font-medium text-slate-600">Secure Pay</div>
                                </div>
                            </div>

                            {/* Accordions - NOW FUNCTIONAL */}
                            <div className="space-y-3">
                                {material_care && (
                                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleAccordion('material')}
                                            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="font-semibold text-slate-900">Material & Care</span>
                                            <span className="text-slate-400">{openAccordion === 'material' ? '−' : '+'}</span>
                                        </button>
                                        {openAccordion === 'material' && (
                                            <div className="px-4 py-3 bg-slate-50 border-t">
                                                <p className="text-slate-600 whitespace-pre-line text-sm">
                                                    {material_care}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleAccordion('shipping')}
                                        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="font-semibold text-slate-900">Shipping & Returns</span>
                                        <span className="text-slate-400">{openAccordion === 'shipping' ? '−' : '+'}</span>
                                    </button>
                                    {openAccordion === 'shipping' && (
                                        <div className="px-4 py-3 bg-slate-50 border-t">
                                            <div className="space-y-2 text-sm text-slate-600">
                                                <p><strong>Delivery:</strong> Estimated {delivery_days || 7} days</p>
                                                <p><strong>Returns:</strong> 30-day return policy. Items must be unworn and in original condition.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {sustainability_impact && (
                                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleAccordion('sustainability')}
                                            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="font-semibold text-slate-900">Sustainability Impact</span>
                                            <span className="text-slate-400">{openAccordion === 'sustainability' ? '−' : '+'}</span>
                                        </button>
                                        {openAccordion === 'sustainability' && (
                                            <div className="px-4 py-3 bg-slate-50 border-t">
                                                <p className="text-slate-600 whitespace-pre-line text-sm">
                                                    {sustainability_impact}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPreviewModal;
