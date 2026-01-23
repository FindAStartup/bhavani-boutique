'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingCart, Truck } from 'lucide-react';

import ProductImageGallery from './ProductImageGallery';
import ProductHeader from './ProductHeader';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import AccordionItem from './AccordionItem';
import TrustBadges from './TrustBadges';

import { useCart } from '@/lib/context/CartContext';

interface ProductDetailsClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: any;
}

const ProductDetailsClient: React.FC<ProductDetailsClientProps> = ({ product }) => {
    const router = useRouter();
    const { addItem } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    // Auto-select first available size on mount
    useEffect(() => {
        if (product.product_stock?.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const firstAvailable = product.product_stock.find((s: any) => s.stock_quantity > 0);
            if (firstAvailable) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSelectedSize(firstAvailable.size);
            } else if (product.product_stock[0]) {
                setSelectedSize(product.product_stock[0].size);
            }
        }
    }, [product]);

    const getStockForSize = (size: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stockItem = product.product_stock?.find((s: any) => s.size === size);
        return stockItem?.stock_quantity || 0;
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        await addItem(product.id, quantity, selectedSize);
    };

    const handleBuyNow = async () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        await addItem(product.id, quantity, selectedSize);
        router.push('/cart');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary mb-4 sm:mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-2 py-1"
                    aria-label="Back to previous page"
                >
                    <ChevronLeft size={20} />
                    <span className="font-medium text-sm sm:text-base">Back to Shop</span>
                </button>

                {/* Breadcrumb */}
                <nav className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center flex-wrap gap-2">
                        <li>
                            <button onClick={() => router.push('/')} className="hover:text-primary transition-colors">
                                Home
                            </button>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li>
                            <span className="hover:text-primary cursor-pointer transition-colors">
                                {product.category}
                            </span>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li className="text-slate-800 font-medium truncate max-w-[200px]" aria-current="page">
                            {product.name}
                        </li>
                    </ol>
                </nav>

                {/* Product Grid */}
                <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <ProductImageGallery
                        images={product.images}
                        productName={product.name}
                        selectedImage={selectedImage}
                        onImageSelect={setSelectedImage}
                    />

                    {/* Product Information */}
                    <section className="order-2 space-y-5 sm:space-y-6">
                        <ProductHeader
                            name={product.name}
                            category={product.category}
                            createdAt={product.created_at}
                        />

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <p className="text-3xl sm:text-4xl font-bold text-primary">
                                ₹{parseFloat(product.price).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>
                            <span className="text-sm text-slate-500">Inclusive of all taxes</span>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            {product.description || 'Exquisitely crafted with attention to detail and premium materials.'}
                        </p>

                        {/* Size Selection */}
                        <SizeSelector
                            sizes={product.product_stock}
                            selectedSize={selectedSize}
                            onSizeSelect={setSelectedSize}
                            getStockForSize={getStockForSize}
                        />

                        {/* Quantity Selector */}
                        <QuantitySelector
                            quantity={quantity}
                            onQuantityChange={setQuantity}
                            maxQuantity={getStockForSize(selectedSize)}
                        />

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedSize || getStockForSize(selectedSize) === 0}
                                className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 sm:py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                <ShoppingCart size={20} />
                                <span>Add to Cart</span>
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={!selectedSize || getStockForSize(selectedSize) === 0}
                                className="w-full bg-white border-2 border-slate-300 hover:bg-slate-50 disabled:bg-slate-50 disabled:cursor-not-allowed text-slate-800 font-semibold py-3.5 sm:py-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Delivery Info */}
                        {product.delivery_days && (
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <Truck size={22} className="text-primary flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base">
                                            Estimated delivery in {product.delivery_days} days
                                        </p>
                                        <p className="text-xs text-slate-600 mt-0.5">
                                            Free shipping on orders above ₹2000
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Accordion Sections */}
                        <div className="border-t border-slate-200 pt-6">
                            {product.material_care && (
                                <AccordionItem
                                    title="Material & Care"
                                    content={product.material_care}
                                    section="care"
                                    isExpanded={expandedSection === 'care'}
                                    onToggle={setExpandedSection}
                                />
                            )}
                            <AccordionItem
                                title="Shipping & Returns"
                                content="Free shipping on orders over ₹2000. Returns accepted within 30 days of purchase. Items must be unworn and in original condition with tags attached."
                                section="shipping"
                                isExpanded={expandedSection === 'shipping'}
                                onToggle={setExpandedSection}
                            />
                            {product.sustainability_impact && (
                                <AccordionItem
                                    title="Sustainability Impact"
                                    content={product.sustainability_impact}
                                    section="sustainability"
                                    isExpanded={expandedSection === 'sustainability'}
                                    onToggle={setExpandedSection}
                                />
                            )}
                        </div>

                        {/* Trust Badges */}
                        <TrustBadges />
                    </section>
                </article>

                {/* Related Products Placeholder - Can be enhanced later */}
                <section className="mt-12 sm:mt-16" aria-labelledby="related-products-heading">
                    <h2 id="related-products-heading" className="text-xl sm:text-2xl font-display font-bold text-slate-900 mb-6">
                        You May Also Like
                    </h2>
                    <div className="text-center text-slate-500 py-12 border border-dashed border-slate-300 rounded-lg">
                        <p className="text-sm sm:text-base">Related products will appear here</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProductDetailsClient;
