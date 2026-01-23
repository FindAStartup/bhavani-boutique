import { Suspense } from 'react';
import { Metadata } from 'next';
import AuthPageClient from '@/components/auth/AuthPageClient';

export const metadata: Metadata = {
    title: 'Login / Sign Up | Bhavani Boutique',
    description: 'Access your account, track orders, and explore exclusive collections.',
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <AuthPageClient />
        </Suspense>
    );
}
