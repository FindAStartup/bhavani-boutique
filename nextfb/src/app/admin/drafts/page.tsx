'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import { Edit, Trash2, CheckCircle, FileText, Loader2, Plus } from 'lucide-react';
import { getDrafts, publishProduct, deleteProduct } from '@/server/actions/admin.actions';
import Image from 'next/image';
import Link from 'next/link';

export default function DraftsPage() {
    const router = useRouter();
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchDrafts = async () => {
        setLoading(true);
        const result = await getDrafts();
        if (result.products) {
            setDrafts(result.products);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    const handlePublish = async (productId: string) => {
        if (!confirm('Are you sure you want to publish this draft?')) return;

        setActionLoading(productId);
        const result = await publishProduct(productId);
        if (result.success) {
            alert('✅ Product published successfully!');
            fetchDrafts();
        } else {
            alert(`❌ Error: ${result.error}`);
        }
        setActionLoading(null);
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) return;

        setActionLoading(productId);
        const result = await deleteProduct(productId);
        if (result.success) {
            alert('✅ Draft deleted successfully!');
            fetchDrafts();
        } else {
            alert(`❌ Error: ${result.error}`);
        }
        setActionLoading(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-12 h-12 animate-spin text-[#550000] mb-4" />
                <p className="text-slate-500 font-medium">Loading drafts...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <AdminHeader
                title="Draft Products"
                subtitle="Manage your unpublished products and refine them before launch"
            >
                <Link
                    href="/admin/add-product"
                    className="bg-[#550000] hover:bg-[#440000] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-md"
                >
                    <Plus size={18} />
                    New Product
                </Link>
            </AdminHeader>

            {drafts.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Drafts Found</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">You haven't saved any products as drafts yet. Create your first draft to see it here.</p>
                    <Link
                        href="/admin/add-product"
                        className="bg-[#550000] hover:bg-[#440000] text-white font-semibold py-3 px-8 rounded-lg transition-all inline-block shadow-lg shadow-[#550000]/20"
                    >
                        Create New Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {drafts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group"
                        >
                            {/* Product Image */}
                            <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <FileText size={40} className="opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-[#FFD700] text-[#550000] text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                                    DRAFT
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-900 mb-1 truncate text-lg">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-slate-500 mb-3 font-medium">
                                    {product.category}
                                </p>
                                <p className="text-xl font-black text-[#550000] mb-6">
                                    ₹{parseFloat(product.price).toLocaleString('en-IN')}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-auto">
                                    <Link
                                        href={`/admin/add-product?id=${product.id}`} // We'll handle editing by passing ID to add-product or making edit-product
                                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm border border-slate-200"
                                        title="Edit Draft"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handlePublish(product.id)}
                                        disabled={actionLoading === product.id}
                                        className="flex-1 bg-[#550000] hover:bg-[#440000] text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-50"
                                        title="Publish Product"
                                    >
                                        {actionLoading === product.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                        Publish
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={actionLoading === product.id}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-3 rounded-lg transition-all border border-red-100 disabled:opacity-50"
                                        title="Delete Draft"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

