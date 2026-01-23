import React from 'react';
import type { Metadata } from 'next';
import FAQ from '@/components/faq/FAQ';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions | Bhavani Boutique',
    description: 'Find answers to common questions about shopping, shipping, returns, and more at Bhavani Boutique.',
};

export default function FAQPage() {
    return <FAQ />;
}
