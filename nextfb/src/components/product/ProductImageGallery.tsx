'use client';

import React from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
    selectedImage: number;
    onImageSelect: (index: number) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName, selectedImage, onImageSelect }) => {
    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
                <p className="text-slate-400">No images available</p>
            </div>
        );
    }

    return (
        <section className="order-1" aria-label="Product images">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                {/* Thumbnail Navigation */}
                <div className="flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 sm:w-20 lg:w-24">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => onImageSelect(index)}
                            className={`flex-shrink-0 aspect-square w-16 sm:w-full rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${selectedImage === index
                                ? 'border-primary shadow-md'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                            aria-label={`View image ${index + 1}`}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={img}
                                    alt={`${productName} view ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Main Image Display */}
                <div className="flex-1 aspect-square sm:aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative">
                    <Image
                        src={images[selectedImage]}
                        alt={productName}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </section>
    );
};

export default ProductImageGallery;
