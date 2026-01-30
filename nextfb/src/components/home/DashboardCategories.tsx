import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const DashboardCategories = () => {
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
                        <Link href="/category/Cordset" className="flex flex-col items-center gap-4 md:gap-5 group shrink-0 min-w-[100px] md:min-w-[120px]">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-stone-100 group-hover:border-primary group-hover:shadow-lg transition-all duration-300 p-1 bg-white relative">
                                <Image
                                    alt="Cordset"
                                    className="object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                                    src="/Cordset.jpeg"
                                    fill
                                    sizes="(max-width: 768px) 80px, 96px"
                                />
                            </div>
                            <span className="text-base font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">Cordset</span>
                        </Link>
                        <Link href="/category/Saree" className="flex flex-col items-center gap-4 md:gap-5 group shrink-0 min-w-[100px] md:min-w-[120px]">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-stone-100 group-hover:border-primary group-hover:shadow-lg transition-all duration-300 p-1 bg-white relative">
                                <Image
                                    alt="Saree"
                                    className="object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                                    src="/Saree.jpeg"
                                    fill
                                    sizes="(max-width: 768px) 80px, 96px"
                                />
                            </div>
                            <span className="text-base font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">Saree</span>
                        </Link>
                        <Link href="/category/Kurties" className="flex flex-col items-center gap-4 md:gap-5 group shrink-0 min-w-[100px] md:min-w-[120px]">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-stone-100 group-hover:border-primary group-hover:shadow-lg transition-all duration-300 p-1 bg-white relative">
                                <Image
                                    alt="Kurties"
                                    className="object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                                    src="/Kurties.jpeg"
                                    fill
                                    sizes="(max-width: 768px) 80px, 96px"
                                />
                            </div>
                            <span className="text-base font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">Kurties</span>
                        </Link>
                        <Link href="/category/Set Mund" className="flex flex-col items-center gap-4 md:gap-5 group shrink-0 min-w-[100px] md:min-w-[120px]">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-stone-100 group-hover:border-primary group-hover:shadow-lg transition-all duration-300 p-1 bg-white relative">
                                <Image
                                    alt="Set Mund"
                                    className="object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                                    src="/SetMundu.jpeg"
                                    fill
                                    sizes="(max-width: 768px) 80px, 96px"
                                />
                            </div>
                            <span className="text-base font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">Set Mund</span>
                        </Link>
                        <Link href="/category/Bottoms" className="flex flex-col items-center gap-4 md:gap-5 group shrink-0 min-w-[100px] md:min-w-[120px]">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-stone-100 group-hover:border-primary group-hover:shadow-lg transition-all duration-300 p-1 bg-white relative">
                                <Image
                                    alt="Bottoms"
                                    className="object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                                    src="/Bottoms.jpeg"
                                    fill
                                    sizes="(max-width: 768px) 80px, 96px"
                                />
                            </div>
                            <span className="text-base font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">Bottoms</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardCategories;
