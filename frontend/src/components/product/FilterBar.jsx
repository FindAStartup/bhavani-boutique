import React, { useState } from 'react';

const FilterBar = ({ totalItems, sortBy, onSortChange, priceRange, onPriceRangeChange }) => {
    const [showPriceMenu, setShowPriceMenu] = useState(false);

    const priceRanges = [
        { value: 'all', label: 'All Prices' },
        { value: 'under1000', label: 'Under ₹1,000' },
        { value: '1000-2000', label: '₹1,000 - ₹2,000' },
        { value: '2000-5000', label: '₹2,000 - ₹5,000' },
        { value: 'above5000', label: 'Above ₹5,000' }
    ];

    const getCurrentPriceLabel = () => {
        const range = priceRanges.find(r => r.value === priceRange);
        return range ? range.label : 'Price';
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 mb-6 border-t border-b border-primary/30">
            {/* Left Side - Item Count */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                    Showing <span className="font-semibold text-primary">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'}
                </span>
            </div>

            {/* Right Side - Price and Sort By */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Price Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowPriceMenu(!showPriceMenu)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white font-medium text-sm rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <span>{getCurrentPriceLabel()}</span>
                        <span className="text-xs">▼</span>
                    </button>

                    {showPriceMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-10 min-w-[180px]">
                            {priceRanges.map(range => (
                                <button
                                    key={range.value}
                                    onClick={() => {
                                        onPriceRangeChange(range.value);
                                        setShowPriceMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 transition-colors ${priceRange === range.value ? 'bg-primary text-white hover:bg-primary' : 'text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-primary/30 rounded-md px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer hover:border-primary transition-colors"
                    >
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name: A-Z</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
