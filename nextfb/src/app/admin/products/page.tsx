'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Edit, Trash2, FileText, Loader2, Plus, Package } from 'lucide-react';
import { getPublishedProducts, deleteProduct } from '@/server/actions/admin.actions';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchProducts = React.useCallback(async () => {
        setLoading(true);
        const result = await getPublishedProducts();
        if (result.products) {
            setProducts(result.products);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        setActionLoading(productId);
        const result = await deleteProduct(productId);
        if (result.success) {
            alert('✅ Product deleted successfully!');
            fetchProducts();
        } else {
            alert(`❌ Error: ${result.error}`);
        }
        setActionLoading(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-12 h-12 animate-spin text-[#550000] mb-4" />
                <p className="text-slate-500 font-medium">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <AdminHeader
                title="Products"
                subtitle="Manage your active products inventory"
            >
                <Link
                    href="/admin/add-product"
                    className="bg-[#550000] hover:bg-[#440000] text-white px-6 py-2 rounded-full flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-md w-fit self-center md:self-auto"
                >
                    <Plus size={18} />
                    New Product
                </Link>
            </AdminHeader>

            {products.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Products Found</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">You haven&apos;t added any products yet. Create your first product to see it here.</p>
                    <Link
                        href="/admin/add-product"
                        className="bg-[#550000] hover:bg-[#440000] text-white font-semibold py-3 px-8 rounded-lg transition-all inline-block shadow-lg shadow-[#550000]/20"
                    >
                        Create New Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group"
                        >
                            {/* Product Image */}
                            <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <FileText size={32} className="opacity-20" />
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-3 md:p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-900 mb-0.5 truncate text-sm md:text-base">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-slate-500 mb-2 font-medium">
                                    {product.category}
                                </p>
                                <p className="text-sm md:text-base font-black text-[#550000] mb-3">
                                    ₹{parseFloat(product.price).toLocaleString('en-IN')}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-1.5 md:gap-2 mt-auto">
                                    <Link
                                        href={`/admin/add-product?id=${product.id}`}
                                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-1.5 md:py-2 rounded-md md:rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs border border-slate-200"
                                        title="Edit Product"
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={actionLoading === product.id}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-1.5 md:py-2 px-2 md:px-3 rounded-md md:rounded-lg transition-all border border-red-100 disabled:opacity-50"
                                        title="Delete Product"
                                    >
                                        {actionLoading === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
