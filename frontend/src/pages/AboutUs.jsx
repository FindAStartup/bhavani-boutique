import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/about/HeroSection';
import HeritageSection from '../components/about/HeritageSection';
import VisionarySection from '../components/about/VisionarySection';
import ValuesSection from '../components/about/ValuesSection';
import VisualMosaic from '../components/about/VisualMosaic';
import NewsletterCTA from '../components/about/NewsletterCTA';

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="w-full bg-[#f7f7f6] text-[#161811]">
            <Header />
            <HeroSection />
            <HeritageSection />
            <VisionarySection />
            <ValuesSection />
            <VisualMosaic />
            <NewsletterCTA />
            <Footer />
        </main>
    );
};

export default AboutUs;
