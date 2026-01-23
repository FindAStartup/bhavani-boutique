'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                {/* Mobile Header for Sidebar Toggle */}
                <div className="md:hidden bg-white p-4 flex items-center shadow-sm sticky top-0 z-20">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-600 p-1">
                        <Menu size={24} />
                    </button>
                    <span className="ml-3 font-semibold text-lg">Admin Dashboard</span>
                </div>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
