import { Metadata } from 'next';
import TermsOfService from '@/components/legal/TermsOfService';

export const metadata: Metadata = {
    title: 'Terms of Service | Bhavani Boutique',
    description: 'Read our Terms of Service.',
};

export default function TermsPage() {
    return (
        <main className="pt-24 pb-16 min-h-screen bg-stone-50 font-sans text-slate-800">
            <TermsOfService />
        </main>
    );
}
