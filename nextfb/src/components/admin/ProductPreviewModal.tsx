'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Zap, Truck, Leaf, Lock, ChevronDown, Minus, Plus } from 'lucide-react';
import Image from 'next/image';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productData: any;
}

const ProductPreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, productData }) => {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    // Reset active image when modal opens or product data changes
    React.useEffect(() => {
        if (isOpen && productData.images && productData.images.length > 0) {
            setActiveImage(productData.images[0]);
        }
    }, [isOpen, productData.images]);

    if (!isOpen) return null;

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const AccordionItem = ({ title, content }: { title: string, content: string }) => (
        <div className="border-t border-slate-100">
            <button
                onClick={() => toggleSection(title)}
                className="w-full py-4 flex items-center justify-between text-left group"
            >
                <span className="font-medium text-slate-800 group-hover:text-[#5d6b2e] transition-colors">{title}</span>
                <Plus size={16} className={`text-slate-400 transition-transform duration-300 ${openSection === title ? 'rotate-45' : ''}`} />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === title ? 'max-h-48' : 'max-h-0'}`}
            >
                <p className="pb-4 text-sm text-slate-600 leading-relaxed font-light">
                    {content || 'No details available.'}
                </p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-20">
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-2 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-[#550000] animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Preview Mode</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 relative shadow-sm group">
                                {productData.images && productData.images.length > 0 ? (
                                    <Image
                                        src={activeImage || productData.images[0]}
                                        alt="Main preview"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium bg-slate-50">No Image Uploaded</div>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {productData.images?.map((img: string, i: number) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-square rounded-lg overflow-hidden relative cursor-pointer border-2 transition-all ${(activeImage || productData.images[0]) === img
                                            ? 'border-[#5d6b2e] ring-2 ring-[#5d6b2e]/20'
                                            : 'border-transparent hover:border-slate-300'
                                            }`}
                                    >
                                        <Image src={img} alt={`Preview ${i}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-8">
                            <div>
                                <span className="inline-block px-3 py-1 bg-[#5d6b2e]/10 text-[#5d6b2e] text-xs font-bold uppercase tracking-wider rounded mb-3">
                                    {productData.category}
                                </span>
                                <h1 className="text-3xl font-serif text-slate-900 mb-2">
                                    {productData.name || 'Product Name'}
                                </h1>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-2xl font-medium text-[#5d6b2e]">
                                        ₹{parseFloat(productData.price || 0).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-sm text-slate-400 font-medium">Inclusive of all taxes</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-slate-900">Description</h3>
                                <p className="text-slate-600 leading-relaxed font-light">
                                    {productData.description || 'No description provided yet.'}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <button className="w-full bg-[#94a362] hover:bg-[#839155] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#94a362]/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
                                    <ShoppingBag size={20} />
                                    Add to Cart
                                </button>
                                <button className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
                                    Buy Now
                                </button>
                            </div>

                            {/* Trust Badge Icons */}
                            <div className="grid grid-cols-3 gap-4 py-6">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 mb-1">
                                        <Truck size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">Free Delivery</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-1">
                                        <Leaf size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">Eco-Friendly</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
                                        <Lock size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">Secure Pay</span>
                                </div>
                            </div>

                            {/* Accordions */}
                            <div className="space-y-1">
                                <AccordionItem
                                    title="Material & Care"
                                    content={productData.material_care || 'Hand wash gently. Do not bleach.'}
                                />
                                <AccordionItem
                                    title="Shipping & Returns"
                                    content={`Delivery within ${productData.delivery_days || 7} days. Easy returns within 7 days of delivery.`}
                                />
                                <AccordionItem
                                    title="Sustainability Impact"
                                    content={productData.sustainability_impact || 'This product is made using sustainable practices.'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPreviewModal;
