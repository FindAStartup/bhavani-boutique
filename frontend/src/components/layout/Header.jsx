import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import bbLogo from '../../assets/BB_Black.png';
import { supabase } from '../../supabaseClient';

const getAvatarColor = (name) => {
    const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const Header = () => {
    const [user, setUser] = useState(null);

    const [wishlistCount, setWishlistCount] = useState(0);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchWishlistCount(session.access_token);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchWishlistCount(session.access_token);
                // fetchCartCount(session.access_token); // Removed
            } else {
                setWishlistCount(0);
                // setCartCount(0); // Removed
            }
        });

        // Listen for wishlist updates
        const handleWishlistUpdate = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                fetchWishlistCount(session.access_token);
            }
        };

        window.addEventListener('wishlistUpdated', handleWishlistUpdate);
        // window.addEventListener('cartUpdated', handleCartUpdate); // Removed

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
            // window.removeEventListener('cartUpdated', handleCartUpdate); // Removed
        };
    }, []);

    const fetchWishlistCount = async (token) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setWishlistCount(data.wishlist?.length || 0);
            }
        } catch (error) {
            console.error('Error fetching wishlist count:', error);
        }
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
                <div className="w-full px-6 lg:px-12 h-16 lg:h-[72px] flex items-center justify-between relative">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-3">
                            <img src={bbLogo} alt="Bhavani Boutique Logo" className="h-8 sm:h-12 w-auto object-contain" />
                            <span className="font-display text-lg sm:text-xl tracking-widest uppercase text-brand-maroon block">Bhavani Boutique</span>
                        </Link>
                    </div>

                    <nav className={`hidden md:flex items-center space-x-6 text-xs font-medium tracking-wide uppercase absolute transition-all duration-500 ease-in-out whitespace-nowrap ${isSearchFocused ? 'left-[40%] -translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`}>
                        <Link
                            to="/"
                            className={`transition-all pb-1 ${location.pathname === '/' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary border-b-2 border-transparent'}`}
                        >
                            Home
                        </Link>
                        <a href="#" className="hover:text-primary transition-colors pb-1 border-b-2 border-transparent">Orders</a>
                        <Link
                            to="/wishlist"
                            className={`transition-all pb-1 ${location.pathname === '/wishlist' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary border-b-2 border-transparent'}`}
                        >
                            Wishlist
                        </Link>
                        <Link
                            to="/about"
                            className={`transition-all pb-1 ${location.pathname === '/about' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary border-b-2 border-transparent'}`}
                        >
                            About Us
                        </Link>
                    </nav>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden sm:block">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                className="pl-10 pr-4 py-1.5 bg-stone-100 border-none focus:ring-1 focus:ring-primary rounded-full text-xs w-40 lg:w-60 transition-all duration-500 ease-in-out focus:w-56 lg:focus:w-80"
                                placeholder="Search designs..."
                                type="text"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/wishlist" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <span className={`material-icons-outlined text-[22px] ${user && wishlistCount > 0 ? 'text-red-500' : 'text-slate-700'}`}>
                                    {user && wishlistCount > 0 ? 'favorite' : 'favorite_border'}
                                </span>
                                {user && wishlistCount > 0 && (
                                    <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <span className="material-icons-outlined text-[22px] text-slate-700">shopping_bag</span>
                            </Link>

                            {user ? (
                                <div className="hidden md:flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm ${getAvatarColor(user.email || 'User')}`}>
                                        {(user.email?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await supabase.auth.signOut();
                                            for (const key of Object.keys(localStorage)) {
                                                if (key.startsWith('sb-')) {
                                                    localStorage.removeItem(key);
                                                }
                                            }
                                            setUser(null);
                                            navigate('/');
                                        }}
                                        className="px-4 py-1.5 border border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-white rounded text-xs font-bold uppercase tracking-widest transition-all"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link to="/login" className="text-slate-700 font-medium hover:text-primary transition-colors text-sm uppercase tracking-wide">Login</Link>
                                    <span className="text-slate-300">|</span>
                                    <Link to="/login?tab=signup" className="text-slate-700 font-medium hover:text-primary transition-colors text-sm uppercase tracking-wide">Sign Up</Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button - Visible only on small screens */}
                        <button
                            className="md:hidden ml-2 text-slate-700"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="material-icons-outlined text-2xl">menu</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay with Blur */}
            {
                isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsMobileMenuOpen(false)}
                        ></div>

                        {/* Sidebar Drawer */}
                        <div className="relative w-[80%] max-w-[300px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slide-in-right">
                            <div className="flex items-center justify-between p-6 border-b border-stone-100">
                                <img src={bbLogo} alt="Bhavani Boutique" className="h-10 w-auto" />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <span className="material-icons-outlined">close</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 px-6">
                                <nav className="flex flex-col space-y-6">
                                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 hover:text-primary flex items-center gap-4">
                                        <span className="material-icons-outlined text-stone-400">home</span>
                                        Home
                                    </Link>
                                    <a href="#" className="text-lg font-medium text-slate-800 hover:text-primary flex items-center gap-4">
                                        <span className="material-icons-outlined text-stone-400">shopping_bag</span>
                                        Orders
                                    </a>
                                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 hover:text-primary flex items-center gap-4">
                                        <span className={`material-icons-outlined text-stone-400 ${user && wishlistCount > 0 ? 'text-red-500' : ''}`}>
                                            {user && wishlistCount > 0 ? 'favorite' : 'favorite_border'}
                                        </span>
                                        Wishlist
                                        {user && wishlistCount > 0 && (
                                            <span className="ml-auto bg-brand-maroon text-white text-xs min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                                                {wishlistCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 hover:text-primary flex items-center gap-4">
                                        <span className="material-icons-outlined text-stone-400">storefront</span>
                                        About Us
                                    </Link>
                                </nav>
                            </div>

                            <div className="p-6 bg-stone-50 border-t border-stone-200">
                                {user ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${getAvatarColor(user.email || 'User')}`}>
                                                {(user.email?.[0] || 'U').toUpperCase()}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-slate-900 truncate">
                                                    {user.user_metadata?.first_name
                                                        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
                                                        : 'User'}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                await supabase.auth.signOut();
                                                for (const key of Object.keys(localStorage)) {
                                                    if (key.startsWith('sb-')) {
                                                        localStorage.removeItem(key);
                                                    }
                                                }
                                                setUser(null);
                                                setIsMobileMenuOpen(false);
                                                navigate('/');
                                            }}
                                            className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-bold text-brand-maroon border border-brand-maroon px-4 py-3 rounded-full hover:bg-brand-maroon hover:text-white transition-all tracking-widest uppercase"
                                        >
                                            <span className="material-icons-outlined text-lg">logout</span>
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full text-center py-3 rounded-full text-sm font-bold text-slate-600 border border-slate-300 hover:border-slate-400 uppercase tracking-widest"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/login?tab=signup"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full text-center py-3 rounded-full text-sm font-bold text-white bg-primary hover:bg-[#5d6b2e] uppercase tracking-widest shadow-md"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Header;
