import { Metadata } from 'next';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { requireAdmin } from '@/server/auth/requireAdmin';

export const metadata: Metadata = {
    title: 'Admin Dashboard | Bhavani Boutique',
    description: 'Manage products, orders, and analytics.',
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}

