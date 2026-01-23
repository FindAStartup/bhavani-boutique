import { Metadata } from 'next';
import ContactHero from '@/components/contact/ContactHero';
import ContactMap from '@/components/contact/ContactMap';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
    title: 'Contact Us | Bhavani Boutique',
    description: 'Get in touch with Bhavani Boutique. Visit us in Mavelikara or send us a message.',
};

export default function ContactUs() {
    return (
        <main className="w-full bg-white">
            <div className="max-w-[1200px] mx-auto px-6 py-12 font-newsreader">
                <ContactHero />
                <ContactMap />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <ContactInfo />
                    <ContactForm />
                </div>
            </div>
        </main>
    );
}
