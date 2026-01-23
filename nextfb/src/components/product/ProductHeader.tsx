import React from 'react';

interface ProductHeaderProps {
    name: string;
    category?: string;
    createdAt?: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ name, createdAt }) => {
    const isNew = createdAt && (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24) <= 7;

    return (
        <header>
            {isNew && (
                <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-3">
                    NEW ARRIVAL
                </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-3 leading-tight">
                {name}
            </h1>
        </header>
    );
};

export default ProductHeader;
