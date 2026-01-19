import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ContactHero from '../components/contact/ContactHero';
import ContactMap from '../components/contact/ContactMap';
import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';

const ContactUs = () => {
    return (
        <MainLayout>
            <div className="max-w-[1200px] mx-auto px-6 py-12 font-newsreader">
                <ContactHero />
                <ContactMap />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <ContactInfo />
                    <ContactForm />
                </div>
            </div>
        </MainLayout>
    );
};

export default ContactUs;
