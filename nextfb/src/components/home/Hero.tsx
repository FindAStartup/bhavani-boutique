import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className="relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden mb-4 shadow-2xl">
            <Image
                alt="New collection featuring silk dresses"
                className="object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNH1JAMSZLWW_8WViyGwz-By_GhliuZ7_vy7QzwDdIrQeRuxHxKu2QwEM6eQXCtDkMiHvch2tgqPeO0StFIoeqHsQfbpUWUnUpaSHvTHNc3T4_NFVjGLwfOcjcvUjia9cRAUtJvj5k1_sB_x6VTdv4wpSoRgRB4qRQCVJEIRuiqbofGaHcyFpq3p2HJJQSzZacUtUXAxkCMZQRo0mXZcyUJFRh0hgv6EM2ds16o8goe8sGXS2uHpzktHNIQgrd7s3k9T1x9VYhrWrL"
                fill
                priority
                sizes="100vw"
            />

            <div
                className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 text-white"
                style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)' }}
            >
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-medium mb-4 animate-pulse">New Arrivals</span>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif mb-6 leading-tight max-w-2xl">
                    Effortless Elegance <br /> <span className="italic text-brand-gold">The Monsoon Edit</span>
                </h1>
                <p className="text-sm md:text-lg text-stone-200 mb-8 max-w-md font-light leading-relaxed">
                    Discover our handcrafted collection of luxury dresses designed for the modern woman who values tradition and style.
                </p>
                <div>
                    <Link href="/products" className="bg-primary hover:bg-[#5d6b2e] text-white px-8 py-3 md:px-10 md:py-4 text-sm md:text-base rounded-full font-semibold transition-all shadow-lg hover:shadow-primary/30 flex items-center gap-2 group w-fit">
                        Explore Collection
                        <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
