import React from 'react';

const HeritageSection = () => {
    return (
        <section className="max-w-[1200px] mx-auto py-24 px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
                <span className="text-primary font-bold tracking-widest uppercase text-xs">Legacy & Craft</span>
                <h2 className="text-4xl md:text-5xl font-light text-[#161811] leading-tight">Our Heritage</h2>
                <div className="w-12 h-1 bg-brand-gold"></div>
                <p className="text-lg text-slate-700 leading-relaxed font-light">
                    Bhavani Boutique was born from a desire to bridge the gap between ancient Kerala textile traditions and the global woman's wardrobe. We celebrate the intricate beauty of Kasavu and the timeless elegance of hand-loomed cotton.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed font-light">
                    Our journey began in the small weaving clusters of Balaramapuram, where the rhythm of the loom has echoed for generations. By reimagining these sacred weaves for a modern, sophisticated audience, we preserve a dying art form while offering unparalleled luxury.
                </p>
            </div>
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("/AboutUs1.png")` }}
                >
                </div>
            </div>
        </section>
    );
};

export default HeritageSection;
