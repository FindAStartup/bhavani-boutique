import React from 'react';
import visionaryImg from '../../assets/AboutUS2.png';

const VisionarySection = () => {
    return (
        <section className="bg-primary/5 dark:bg-primary/10 py-24 overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
                <div className="w-full md:w-1/2 relative">
                    <div className="absolute -top-10 -left-10 size-64 bg-accent-gold/10 rounded-full blur-3xl"></div>
                    <div
                        className="relative z-10 aspect-[3/4] bg-center bg-cover rounded-2xl shadow-xl grayscale hover:grayscale-0 transition-all duration-700"
                        style={{ backgroundImage: `url("${visionaryImg}")` }}
                    >
                    </div>
                </div>
                <div className="w-full md:w-1/2 space-y-8">
                    <h3 className="text-primary font-bold tracking-widest uppercase text-xs">The Visionary</h3>
                    <blockquote className="relative">
                        <span className="absolute -top-8 -left-8 text-8xl text-accent-gold/20 font-serif">“</span>
                        <p className="text-3xl md:text-4xl font-light italic leading-snug text-[#161811]">
                            Fashion is not just about the garment; it’s about the soul of the craft and the story of the hand that wove it.
                        </p>
                    </blockquote>
                    <div className="space-y-1">
                        <h4 className="text-xl font-bold">Ananya Nair</h4>
                        <p className="text-primary font-medium">Founder & Creative Director</p>
                    </div>
                    <p className="text-base text-slate-600 font-light max-w-md">
                        With over two decades of experience in high fashion and a deep-rooted love for her Keralite roots, Ananya founded Bhavana to empower local artisans and redefine ethical luxury.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default VisionarySection;
