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
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbj-R4GVi2Ix5-byCkFHeV4gH0LIWL9WlZVuN2q4fgDc_daF4IM9Ks_23z5QGFF8onc8nxLie6rTln-CNSxLPAn_DhTruYpQZ2b3t-BQfhXDvXqFRpesUa_a8PfEpcxzKQb8i_L6y5H6B8j9bFxML7lIBFKMyqF7tkaImObfsPmzluEPB2XnNaApxg-mID_5SOdlI_zZqvYCs6QkpF-pcYwVN2zR99-_plyR_xW2j1v1P6JkHXKk_ircAGcruzFWMvgLmMyd4mPWIb"
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
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn2LwJwUA6IltadXBA3cOpxQL-E78tatSmhgU8XolUfx0NF5VTfPOecpuQzMFUsTq4MfzbKcFTbJlE5MqqGcBn-dCheDEOpQVLD8MLDZ5YNq0nDjFHPupir6gE9Q5_hc0sPbwnySfs2I44oL0s8YG_WZNLfu0Uf8XJZBwocTMrzKL4ekE6efKM1NkOkbX3mR32ArRJXU_7UIjCRbLeHvp_uHHcHOzRp1zmKTjzeSGrPDC_0GUvITKLstd9bEn0zM8M5WKIvjkPQ0i6"
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
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5enm3e40HMbFdXqFZsTtO8B3ogWTuiadBwW4EKN36ui0YKrwAudiqC53kXy0dW_iM4Q55BO0UoKAy3r6ui_j9oDbdmXmu-KVcBGkQnCAQB8cay-sgZNJ--GbpcUlUpJzdtv90SoIVJDq94Mcxf6HQMMxa9ECd9azCu9faNjgqnRhTTixVEeD_HC4XGYh5Q-JOowEw02acpAJeREMdoIM6ASExeT9Y7KCICQIWZEmG7TJROPDJF2tcp5RypdlSE8MeJFjBmdSuA8ot"
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
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCujVkaU5VBNIfWP7W-FJTKV5pJuXC6XlC0qSwAPw-wuN0BEiMGCJl96XccnTEeWN9UZg1JO-CTGdBgZg_48kvH6uI2Cj_nNgaQ4Vv_O-s5H7u0g9z1pzDqimmFHalMjz3jL7BFZLLz782_pw-IQe4kanfG9B4M7gO5czIW60ebaQqCmWW15j3RD0rPpheEVo1uhbjKu_bbQ-z9BllbFQKy99AfYkYu-8X6KAVXzoGJSkb7VFBTMpgw_Gao1otFcUvrstIcCT2vrt-S"
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
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNH1JAMSZLWW_8WViyGwz-By_GhliuZ7_vy7QzwDdIrQeRuxHxKu2QwEM6eQXCtDkMiHvch2tgqPeO0StFIoeqHsQfbpUWUnUpaSHvTHNc3T4_NFVjGLwfOcjcvUjia9cRAUtJvj5k1_sB_x6VTdv4wpSoRgRB4qRQCVJEIRuiqbofGaHcyFpq3p2HJJQSzZacUtUXAxkCMZQRo0mXZcyUJFRh0hgv6EM2ds16o8goe8sGXS2uHpzktHNIQgrd7s3k9T1x9VYhrWrL"
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
