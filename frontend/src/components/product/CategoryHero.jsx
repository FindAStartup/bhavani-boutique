import React from 'react';

const CategoryHero = ({ category, description }) => {
    return (
        <div className="flex flex-col items-center text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white tracking-tight mb-3" style={{ color: '#550000' }}>
                {category} Collection
            </h2>
            <div className="w-20 h-1 bg-brand-maroon mb-4"></div>
            <p className="max-w-2xl text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed italic">
                {description}
            </p>
        </div>
    );
};

export default CategoryHero;




