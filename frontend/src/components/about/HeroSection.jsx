import React from 'react';
import keralaBackwaters from '../../assets/Kerala_Backwaters.png';

const HeroSection = () => {
    return (
        <section className="relative w-full h-[85vh] overflow-hidden flex items-center justify-center">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(${keralaBackwaters})`
                }}
            >
            </div>
            <div className="relative z-10 text-center px-6 max-w-4xl">
                <h1 className="text-white text-5xl md:text-7xl font-light tracking-tighter mb-4">Our Story</h1>
                <p className="text-white/90 text-lg md:text-xl font-light tracking-wide uppercase">Rooted in Tradition, Tailored for Today</p>
                <div className="mt-8 w-px h-24 bg-white/40 mx-auto"></div>
            </div>
        </section>
    );
};

export default HeroSection;
