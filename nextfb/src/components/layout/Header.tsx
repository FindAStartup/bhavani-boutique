'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { User } from '@supabase/supabase-js';
import { useCart } from '@/lib/context/CartContext';
import { searchProducts } from '@/server/actions/product.actions';

const getAvatarColor = (name: string) => {
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
    const [user, setUser] = useState<User | null>(null);
    const [wishlistCount, setWishlistCount] = useState(0);
    const { cartCount } = useCart();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setIsSearchFocused(false);
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Debounce search suggestions
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            const { products } = await searchProducts(searchQuery);
            if (products) {
                setSuggestions(products);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchWishlistCount();
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchWishlistCount();
            } else {
                setWishlistCount(0);
            }
        });

        // Listen for wishlist updates (custom event)
        const handleWishlistUpdate = async () => {
            fetchWishlistCount();
        };

        window.addEventListener('wishlistUpdated', handleWishlistUpdate);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
        };
    }, [supabase]);

    const fetchWishlistCount = async () => {
        // We'll use a direct Supabase query here instead of a fetch to an API route for efficiency in client component
        // or we could call the server action if we were passing it down.
        // For now, let's keep it consistent with the Supabase client availability
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { count, error } = await supabase
                .from('wishlists')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            if (!error && count !== null) {
                setWishlistCount(count);
            }
        } catch (error) {
            console.error('Error fetching wishlist count:', error);
        }
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh(); // Refresh server components
        setUser(null);
        router.push('/');
    };

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
                <div className="w-full px-6 lg:px-12 h-16 lg:h-[72px] flex items-center justify-between relative">
                    <div className="flex items-center gap-1">
                        <Link href="/" className="flex items-center gap-1">
                            <Image
                                src="/BB_Black.png"
                                alt="Bhavani Boutique Logo"
                                width={48}
                                height={48}
                                className="h-8 sm:h-12 w-auto object-contain"
                                priority
                            />
                            <span className="font-display text-lg sm:text-xl tracking-widest uppercase text-brand-maroon block">Bhavani Boutique</span>
                        </Link>
                    </div>

                    <nav className={`hidden md:flex items-center space-x-6 text-xs font-medium tracking-wide uppercase absolute transition-all duration-500 ease-in-out whitespace-nowrap ${isSearchFocused ? 'left-[40%] -translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`}>
                        <Link
                            href="/"
                            className={`transition-all pb-1 ${isActive('/') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary border-b-2 border-transparent'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/orders"
                            className={`transition-all pb-1 ${isActive('/orders') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary border-b-2 border-transparent'}`}
                        >
                            Orders
                        </Link>
                        <Link
                            href="/wishlist"
                            className={`transition-all pb-1 ${isActive('/wishlist') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary border-b-2 border-transparent'}`}
                        >
                            Wishlist
                        </Link>
                        <Link
                            href="/about"
                            className={`transition-all pb-1 ${isActive('/about') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary border-b-2 border-transparent'}`}
                        >
                            About Us
                        </Link>
                        <Link
                            href="/contact"
                            className={`transition-all pb-1 ${isActive('/contact') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary border-b-2 border-transparent'}`}
                        >
                            Contact Us
                        </Link>
                    </nav>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden sm:block">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                className="pl-10 pr-4 py-1.5 bg-stone-100 border-none focus:ring-1 focus:ring-primary rounded-full text-xs w-40 lg:w-60 transition-all duration-500 ease-in-out focus:w-56 lg:focus:w-80 outline-none"
                                placeholder="Search designs..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => {
                                    // Delay hiding to allow clicking on suggestions
                                    setTimeout(() => setIsSearchFocused(false), 200);
                                }}
                            />

                            {/* Search Suggestions Dropdown */}
                            {isSearchFocused && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden py-2 z-50">
                                    <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Suggestions
                                    </div>
                                    {suggestions.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products?search=${encodeURIComponent(product.name)}`}
                                            className="block px-4 py-3 hover:bg-stone-50 transition-colors flex items-center gap-3"
                                            onClick={() => {
                                                setSearchQuery(product.name);
                                                setIsSearchFocused(false);
                                            }}
                                        >
                                            <div className="relative w-8 h-8 rounded bg-stone-100 overflow-hidden flex-shrink-0">
                                                {product.images && product.images[0] && (
                                                    <Image
                                                        src={product.images[0]}
                                                        fill
                                                        className="object-cover"
                                                        alt={product.name}
                                                    />
                                                )}
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{product.category}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/wishlist" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <span className={`material-icons-outlined text-[22px] ${user && wishlistCount > 0 ? 'text-red-500' : 'text-slate-700'}`}>
                                    {user && wishlistCount > 0 ? 'favorite' : 'favorite_border'}
                                </span>
                                {user && wishlistCount > 0 && (
                                    <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <Link href="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <span className={`material-icons-outlined text-[22px] ${cartCount > 0 ? 'text-primary' : 'text-slate-700'}`}>shopping_bag</span>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="hidden md:flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm ${getAvatarColor(user.email || 'User')}`}>
                                        {(user.email?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-1.5 border border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-white rounded text-xs font-bold uppercase tracking-widest transition-all"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link href="/login" className="text-slate-700 font-medium hover:text-primary transition-colors text-sm uppercase tracking-wide">Login</Link>
                                    <span className="text-slate-300">|</span>
                                    <Link href="/login?tab=signup" className="text-slate-700 font-medium hover:text-primary transition-colors text-sm uppercase tracking-wide">Sign Up</Link>
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
                                <Image src="/BB_Black.png" alt="Bhavani Boutique" width={40} height={40} className="h-10 w-auto" />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <span className="material-icons-outlined">close</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 px-6">
                                <nav className="flex flex-col space-y-6">
                                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 hover:text-primary flex items-center gap-4">
                                        <span className="material-icons-outlined text-stone-400">home</span>
                                        Home
                                    </Link>
                                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 hover:text-primary flex items-center gap-4">
                                        <span className="material-icons-outlined text-stone-400">shopping_bag</span>
                                        Orders
                                    </Link>
                                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 hover:text-primary flex items-center gap-4">
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
                                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 hover:text-primary flex items-center gap-4">
                                        <span className="material-icons-outlined text-stone-400">storefront</span>
                                        About Us
                                    </Link>
                                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-800 hover:text-primary flex items-center gap-4">
                                        <span className="material-icons-outlined text-stone-400">phone</span>
                                        Contact Us
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
                                                await handleLogout();
                                                setIsMobileMenuOpen(false);
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
                                            href="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full text-center py-3 rounded-full text-sm font-bold text-slate-600 border border-slate-300 hover:border-slate-400 uppercase tracking-widest"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/login?tab=signup"
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

