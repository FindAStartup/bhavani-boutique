'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotForm from './ForgotForm';
import { useAuth } from '@/lib/context/AuthContext';
import { getUserRole } from '@/server/actions/auth.actions';

const AuthPageClient = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading } = useAuth();

    // Default to 'login' unless 'signup' is specified
    const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
    const [activeTab, setActiveTab] = useState<string>(initialTab);

    // Sync state with URL params if they change
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'signup' || tab === 'login') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Redirect if already logged in
    // Redirect if already logged in
    useEffect(() => {
        const checkRoleAndRedirect = async () => {
            if (!loading && user) {
                // We need to fetch the role to decide where to redirect
                // Since user is already logged in securely, we can check the server
                const { role } = await getUserRole();
                if (role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            }
        };

        checkRoleAndRedirect();
    }, [user, loading, router]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        // Optional: Update URL without full reload, but only for login/signup
        if (tab === 'login' || tab === 'signup') {
            router.replace(`/login?tab=${tab}`, { scroll: false });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Don't render auth page content if user is logged in (redirecting)
    if (user) return null;

    return (
        <main className="flex min-h-screen lg:h-screen w-full lg:overflow-hidden bg-[#f7f7f6] relative">

            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#550000]">
                <div className="absolute inset-0 z-10 bg-black/20"></div>
                {/* Ensure Login.png is in public folder. If not, this might be broken. */}
                <div className="absolute inset-0">
                    <Image
                        src="/Login.png"
                        alt="Elegant fashion model"
                        fill
                        className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                        priority
                    />
                </div>

                <div className="relative z-20 flex flex-col justify-between p-8 pr-32 text-white h-full w-full">
                    <div className="flex items-center ">
                        {/* Logo Placeholder - assuming simple text or image */}
                        <div className="relative w-14 h-14">
                            <Image
                                src="/BB_white.png"
                                alt="Bhavani Boutique"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-display text-xl tracking-widest uppercase">Bhavani Boutique</span>
                    </div>
                    <div>
                        <h1 className="font-display text-6xl leading-tight mb-6">Redefining <br /><span className="italic text-[#FFD700]">Timeless</span> Style.</h1>
                        <p className="text-lg opacity-90 max-w-md font-light leading-relaxed">
                            Join our exclusive community of fashion enthusiasts and discover a curated collection of artisan-crafted dresses.
                        </p>
                    </div>
                    <div className="flex space-x-6 text-sm font-medium tracking-widest">
                        <a href="https://www.instagram.com/bhavaniboutique_?igsh=c3VteGNiZ2ZzZGEx" className="hover:text-[#FFD700] transition-colors">INSTAGRAM</a>
                        <a href="https://www.facebook.com/share/16mvyfJibH/" className="hover:text-[#FFD700] transition-colors">FACEBOOK</a>
                    </div>
                </div>
            </div>

            {/* Mobile Background Image (Visible only on small screens) */}
            <div className="lg:hidden absolute inset-0 z-0 opacity-10 pointer-events-none">
                <Image
                    src="/Login.png"
                    alt="Background"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Right Side - Forms */}
            <div className="w-full lg:w-1/2 flex flex-col bg-[#f7f7f6]/95 lg:bg-[#f7f7f6] relative z-10 h-full lg:overflow-y-auto">
                <header className="flex justify-between items-center p-6 lg:p-8 shrink-0">
                    <div className="lg:hidden flex items-center ">
                        <div className="relative w-14 h-14">
                            <Image
                                src="/BB_Black.png"
                                alt="Bhavani Boutique"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-display text-base tracking-widest uppercase text-[#161811]">Bhavani Boutique</span>
                    </div>
                </header>

                <div className="mb-20 lg:flex-1 flex flex-col justify-start pt-10 lg:justify-center lg:pt-0 px-6 sm:px-12 lg:px-16 pb-4 lg:pb-8 max-w-lg mx-auto w-full">

                    {/* Tabs */}
                    {activeTab !== 'forgot-password' && (
                        <div className="flex space-x-8 mb-10 border-b border-slate-200">
                            <button
                                onClick={() => handleTabChange('login')}
                                className={`pb-4 text-xs font-bold tracking-widest uppercase border-b-2 transition-all ${activeTab === 'login'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => handleTabChange('signup')}
                                className={`pb-4 text-xs font-bold tracking-widest uppercase border-b-2 transition-all ${activeTab === 'signup'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    {activeTab === 'login' && <LoginForm onForgotPassword={() => handleTabChange('forgot-password')} />}
                    {activeTab === 'signup' && <SignupForm />}
                    {activeTab === 'forgot-password' && <ForgotForm onBackToLogin={() => handleTabChange('login')} />}

                </div>

                <footer className="mt-4 lg:mt-12 text-center pb-6">
                    <p className="text-xs text-slate-400 tracking-wide mb-2">
                        © 2026 Bhavani Boutique. HANDCRAFTED BOUTIQUE EXPERIENCE.
                    </p>
                </footer>
            </div>
        </main >
    );
};

export default AuthPageClient;
