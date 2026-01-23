'use client';

import React from 'react';

interface SizeSelectorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sizes: any[]; // Replace with proper type if available
    selectedSize: string;
    onSizeSelect: (size: string) => void;
    getStockForSize: (size: string) => number;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ sizes, selectedSize, onSizeSelect, getStockForSize }) => {
    if (!sizes || sizes.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label htmlFor="size-select" className="font-semibold text-slate-800">
                    Select Size
                </label>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3" role="radiogroup" aria-label="Size selection">
                {sizes.map((item) => {
                    const isAvailable = item.stock_quantity > 0;
                    const isSelected = selectedSize === item.size;
                    return (
                        <button
                            key={item.size}
                            onClick={() => isAvailable && onSizeSelect(item.size)}
                            disabled={!isAvailable}
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={`Size ${item.size}${!isAvailable ? ' - Out of stock' : ''}`}
                            className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isSelected
                                ? 'bg-primary text-white shadow-md'
                                : isAvailable
                                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                                    : 'bg-slate-50 text-slate-400 cursor-not-allowed line-through'
                                }`}
                        >
                            {item.size}
                        </button>
                    );
                })}
            </div>
            {selectedSize && (
                <p className="text-sm text-slate-600 mt-2">
                    {getStockForSize(selectedSize) > 10
                        ? 'In Stock'
                        : `Only ${getStockForSize(selectedSize)} left in stock`}
                </p>
            )}
        </div>
    );
};

export default SizeSelector;
