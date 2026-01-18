import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-white text-slate-900">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
                {/* Mobile Header for Menu Toggle */}
                <div className="md:hidden bg-white border-b border-slate-100 p-4 flex items-center">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-slate-600 hover:text-primary transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-display text-lg font-bold text-slate-800">Admin Panel</span>
                </div>

                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
