import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import LoginImage from '../assets/Login.png';
import LogoWhite from '../assets/BB_white.png';
import bbLogo from '../assets/BB_Black.png';

const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
    const [activeTab, setActiveTab] = useState(initialTab);
    const navigate = useNavigate();

    // Update activeTab if query param changes (optional, but good for direct navigation)
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'signup' || tab === 'login') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Auto-redirect if user is already logged in (e.g., after email verification)
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/get-user-role`, {
                        userId: session.user.id
                    });
                    const role = response.data.role;
                    if (role === 'admin') navigate('/admin');
                    else navigate('/');
                } catch (err) {
                    console.error("Error fetching role:", err);
                }
            }
        };
        checkSession();

        // Listen for auth state changes (like email link click)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) checkSession();
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return (
        <main className="flex min-h-screen lg:h-screen w-screen lg:overflow-hidden bg-background-light relative">

            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
                <div className="absolute inset-0 z-10 bg-black/20"></div>
                <img
                    src={LoginImage}
                    alt="Elegant fashion model in a boutique setting"
                    className="absolute inset-0 object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-1000"
                />
                <div className="relative z-20 flex flex-col justify-between p-12 pr-32 text-white h-full w-full">
                    <div className="flex items-center space-x-0 gap-1 -ml-6">
                        <img src={LogoWhite} alt="Bhavani Boutique Logo" className="h-12 w-auto" />
                        <span className="font-display text-xl tracking-widest uppercase">Bhavani Boutique</span>
                    </div>
                    <div>
                        <h1 className="font-display text-6xl leading-tight mb-6">Redefining <br /><span className="italic text-[gold]">Timeless</span> Style.</h1>
                        <p className="text-lg opacity-90 max-w-md font-light leading-relaxed">
                            Join our exclusive community of fashion enthusiasts and discover a curated collection of artisan-crafted dresses.
                        </p>
                    </div>
                    <div className="flex space-x-6 text-sm font-medium tracking-widest">
                        <a href="#" className="hover:text-gold transition-colors">INSTAGRAM</a>
                        <a href="#" className="hover:text-gold transition-colors">FACEBOOK</a>
                        <a href="#" className="hover:text-gold transition-colors">X</a>
                    </div>
                </div>
            </div>

            {/* Mobile Background Image (Visible only on small screens) */}
            <div className="lg:hidden absolute inset-0 z-0 opacity-10">
                <img
                    src={LoginImage}
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right Side - Forms */}
            <div className="w-full lg:w-1/2 flex flex-col bg-background-light/90 lg:bg-background-light relative z-10 h-full lg:overflow-y-auto">
                <header className="flex justify-between items-center p-6 lg:p-8 shrink-0">
                    <div className="lg:hidden flex items-center space-x-1">
                        <img src={bbLogo} alt="Logo" className="h-10 w-auto" />
                        <span className="font-display text-base tracking-widest uppercase">Bhavani Boutique</span>
                    </div>
                </header>

                <div className=" mb-20 lg:flex-1 flex flex-col justify-start pt-10 lg:justify-center lg:pt-0 px-6 sm:px-12 lg:px-16 pb-4 lg:pb-8 max-w-lg mx-auto w-full origin-center transition-transform">
                    <div className="flex space-x-8 mb-10 border-b border-slate-100">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`pb-4 text-xs font-semibold tracking-widest uppercase border-b-2 transition-all ${activeTab === 'login'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`pb-4 text-xs font-semibold tracking-widest uppercase border-b-2 transition-all ${activeTab === 'signup'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {activeTab === 'login' ? (
                        <>
                            <LoginForm />
                        </>
                    ) : (
                        <>
                            <SignupForm />
                        </>
                    )}
                </div>

                <footer className="mt-4 lg:mt-12 text-center pb-6">
                    <p className="text-xs text-slate-400 tracking-wide">
                        © 2026 Bhavani Boutique. HANDCRAFTED BOUTIQUE EXPERIENCE.
                    </p>
                </footer>
            </div>
        </main>
    );
};

export default AuthPage;
