import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCards from '@/components/admin/StatsCards';
import RecentOrders from '@/components/admin/RecentOrders';
import DashboardCalendar from '@/components/admin/DashboardCalendar';

export default function AdminDashboard() {
    return (
        <>
            <AdminHeader
                title="Analytics Overview"
                subtitle="Welcome back. Here is what's happening today."
            />

            <div className="space-y-6">
                <StatsCards />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RecentOrders />
                    </div>
                    <div>
                        <DashboardCalendar />
                    </div>
                </div>
            </div>

            <footer className="mt-12 text-center text-slate-400 text-sm">
                © 2026 Bhavani Boutique Admin. All rights reserved.
            </footer>
        </>
    );
}
