'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    PlusCircle,
    FileText,
    LogOut,
    X,
    User,
    Package
} from 'lucide-react';
import { createClient } from '@/supabase/client';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const supabase = createClient();

    useEffect(() => {
        // Initial fetch
        supabase.auth.getSession().then(({ data: { session } }) => {
            setEmail(session?.user?.email ?? '');
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setEmail(session?.user?.email ?? '');
            if (_event === 'SIGNED_OUT') {
                router.push('/');
            }
        });

        return () => subscription.unsubscribe();
    }, [router, supabase]);

    const isActive = (path: string) => {
        return pathname === path ? 'bg-white/10' : 'hover:bg-white/5';
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            try {
                await supabase.auth.signOut();
                router.push('/');
            } catch (error) {
                console.error('Error logging out:', error);
                alert('Error logging out. Please try again.');
            }
        }
    };

    const navItems = [
        { name: 'Home', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Add Product', path: '/admin/add-product', icon: <PlusCircle size={20} /> },
        { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
        { name: 'Drafts', path: '/admin/drafts', icon: <FileText size={20} /> },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-[#5d6b2e] text-white flex flex-col z-30 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:fixed md:inset-y-0
            `}>
                <div className="p-8 relative">
                    {/* Close Button for Mobile */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 md:hidden text-white/70 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex items-center space-x-3 border-b border-white/20 pb-4">
                        {/* Placeholder Logo */}
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#550000] font-serif font-bold">B</div>
                        <h1 className="font-display text-lg tracking-wide whitespace-nowrap">Bhavani Boutique</h1>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${isActive(item.path)}`}
                        >
                            <span className="text-white/70 group-hover:text-white">
                                {item.icon}
                            </span>
                            <span className={`font-medium ${pathname === item.path ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 mt-auto">
                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center border border-[#FFD700]/30 text-[#FFD700]">
                                <User size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold truncate">Admin</p>
                                <p className="text-xs text-white/60 truncate">{email || 'Loading...'}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-semibold bg-white/5 hover:bg-maroon/40 rounded-lg transition-all"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;

