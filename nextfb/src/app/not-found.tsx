'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-[#5d6b2e]/10 rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 bg-[#5d6b2e]/20 rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#550000] font-black text-5xl">
                        404
                    </div>
                </div>

                <h1 className="text-3xl font-serif font-bold text-stone-800">Page Not Found</h1>
                <p className="text-stone-600">
                    Oops! The page you are looking for seems to have wandered off. It might have been moved or deleted.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#550000] text-white rounded-lg hover:bg-[#440000] transition-colors font-medium shadow-md"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-stone-700 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors font-medium"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
