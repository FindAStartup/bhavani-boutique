import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { categoryImage } from '@/lib/categories';
import { listCategories } from '@/server/repositories/category.repo';

const DashboardCategories = async () => {
    const categories = await listCategories();
    return (
        <section className="mb-8">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                {/* Left Side Box */}
                <div className="w-full md:w-[35%] shrink-0 p-6 bg-[#F9F8F6] rounded-3xl border border-stone-100 shadow-2xl flex flex-col items-start justify-center text-left self-stretch">
                    <span className="text-xs font-bold tracking-[0.2em] text-brand-maroon mb-2 uppercase">Collections</span>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4 leading-tight">Explore Our <br /> Categories</h2>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-sm">
                        Discover handcrafted luxury across our curated collections.
                    </p>
                    <Link href="/products" className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 group hover:gap-3 transition-all">
                        View All
                        <span className="material-icons-outlined text-sm group-hover:text-brand-maroon transition-colors">arrow_forward</span>
                    </Link>
                </div>

                <div className="flex-1 w-full overflow-hidden min-w-0">
                    <div className="flex items-center justify-between gap-4 md:gap-8 overflow-x-auto py-4 scrollbar-hide px-2 w-full">
                        {categories.map(category => {
                            const image = categoryImage(category);
                            return (
                                <Link key={category.id} href={`/category/${category.slug}`} className="flex shrink-0 flex-col items-center gap-4 group min-w-[100px] md:min-w-[120px] md:gap-5">
                                    <div className="relative size-20 overflow-hidden rounded-full border-2 border-stone-100 bg-stone-100 group-hover:border-primary md:size-24">
                                        {image && <Image alt="" src={image} fill sizes="(max-width: 768px) 80px, 96px"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                                    </div>
                                    <span className="text-base font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary">{category.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardCategories;

