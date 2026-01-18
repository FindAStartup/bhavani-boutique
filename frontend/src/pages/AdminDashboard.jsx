import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminHeader from '../components/admin/AdminHeader';
import StatsCards from '../components/admin/StatsCards';
import RecentOrders from '../components/admin/RecentOrders';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <AdminHeader
                title="Analytics Overview"
                subtitle="Welcome back. Here is what's happening today."
            />
            <StatsCards />
            <RecentOrders />
            <footer className="mt-12 text-center text-slate-400 text-sm">
                © 2026 Bhavana Boutique Admin. All rights reserved.
            </footer>
        </AdminLayout>
    );
};

export default AdminDashboard;
