import { Metadata } from 'next';
import HeroSection from '@/components/about/HeroSection';
import HeritageSection from '@/components/about/HeritageSection';
import VisionarySection from '@/components/about/VisionarySection';
import ValuesSection from '@/components/about/ValuesSection';
import VisualMosaic from '@/components/about/VisualMosaic';
import NewsletterCTA from '@/components/about/NewsletterCTA';

export const metadata: Metadata = {
    title: 'About Us | Bhavani Boutique',
    description: 'Learn about our heritage, vision, and the values that drive Bhavani Boutique.',
};

export default function AboutUs() {
    return (
        <main className="w-full bg-[#f7f7f6] text-[#161811]">
            <HeroSection />
            <HeritageSection />
            <VisionarySection />
            <ValuesSection />
            <VisualMosaic />
            <NewsletterCTA />
        </main>
    );
}
