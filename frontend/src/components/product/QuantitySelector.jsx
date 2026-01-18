import React from 'react';
import { Plus, Minus } from 'lucide-react';

/**
 * Quantity Selector Component
 * Allows users to select product quantity
 */
const QuantitySelector = ({ quantity, onQuantityChange, maxQuantity = 99 }) => {
    const handleDecrease = () => {
        if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (quantity < maxQuantity) {
            onQuantityChange(quantity + 1);
        }
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        onQuantityChange(Math.max(1, Math.min(maxQuantity, value)));
    };

    return (
        <div>
            <label htmlFor="quantity" className="font-semibold text-slate-800 block mb-3">
                Quantity
            </label>
            <div className="flex items-center gap-3">
                <button
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <Minus size={18} />
                </button>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={handleInputChange}
                    className="w-16 sm:w-20 text-center font-semibold text-lg border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                    max={maxQuantity}
                    aria-label="Product quantity"
                />
                <button
                    onClick={handleIncrease}
                    disabled={quantity >= maxQuantity}
                    aria-label="Increase quantity"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
};

export default QuantitySelector;
