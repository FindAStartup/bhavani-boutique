import { Metadata } from 'next';
import PrivacyPolicy from '@/components/legal/PrivacyPolicy';

export const metadata: Metadata = {
    title: 'Privacy Policy | Bhavani Boutique',
    description: 'Read our Privacy Policy.',
};

export default function PrivacyPage() {
    return (
        <main className="pt-24 pb-16 min-h-screen bg-stone-50 font-sans text-slate-800">
            <PrivacyPolicy />
        </main>
    );
}
