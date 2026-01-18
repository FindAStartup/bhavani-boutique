import React from 'react';

const ValuesSection = () => {
    return (
        <section className="max-w-[1200px] mx-auto py-32 px-6">
            <div className="text-center mb-20 space-y-4">
                <h2 className="text-4xl font-light">Our Pillars</h2>
                <div className="w-20 h-px bg-accent-gold mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center space-y-6">
                    <div className="mx-auto size-16 flex items-center justify-center rounded-full border border-accent-gold transition-colors duration-500">
                        <span className="material-icons-outlined text-accent-gold text-3xl transition-colors duration-500">auto_awesome</span>
                    </div>
                    <h4 className="text-xl font-semibold tracking-tight">Authentic Craftsmanship</h4>
                    <p className="text-slate-600 font-light leading-relaxed">
                        Every piece is a labor of love, hand-loomed by master artisans using techniques passed down through centuries.
                    </p>
                </div>
                <div className="text-center space-y-6">
                    <div className="mx-auto size-16 flex items-center justify-center rounded-full border border-accent-gold transition-colors duration-500">
                        <span className="material-icons-outlined text-accent-gold text-3xl transition-colors duration-500">architecture</span>
                    </div>
                    <h4 className="text-xl font-semibold tracking-tight">Modern Aesthetics</h4>
                    <p className="text-slate-600 font-light leading-relaxed">
                        We blend traditional weaves with contemporary silhouettes designed for the modern, cosmopolitan lifestyle.
                    </p>
                </div>
                <div className="text-center space-y-6">
                    <div className="mx-auto size-16 flex items-center justify-center rounded-full border border-accent-gold transition-colors duration-500">
                        <span className="material-icons-outlined text-accent-gold text-3xl transition-colors duration-500">eco</span>
                    </div>
                    <h4 className="text-xl font-semibold tracking-tight">Sustainable Fashion</h4>
                    <p className="text-slate-600 font-light leading-relaxed">
                        Committed to slow fashion, we use natural dyes and ethical sourcing to ensure a positive impact on the planet.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ValuesSection;
