import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminHeader from '../components/admin/AdminHeader';
import { Edit, Trash2, Eye, CheckCircle, FileText } from 'lucide-react';

/**
 * Drafts Page
 * Displays all draft products and allows editing, publishing, or deleting them
 */
const Drafts = () => {
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?is_draft=true`);
            const data = await response.json();

            if (response.ok) {
                setDrafts(data.products || []);
            } else {
                console.error('Error fetching drafts:', data.error);
            }
        } catch (error) {
            console.error('Error fetching drafts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (productId) => {
        if (!confirm('Are you sure you want to publish this draft?')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_draft: false }),
            });

            if (response.ok) {
                alert('✅ Product published successfully!');
                fetchDrafts(); // Refresh the list
            } else {
                const data = await response.json();
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error publishing draft:', error);
            alert('❌ Error publishing draft');
        }
    };

    const handleDelete = async (productId) => {
        if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('✅ Draft deleted successfully!');
                fetchDrafts(); // Refresh the list
            } else {
                const data = await response.json();
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error deleting draft:', error);
            alert('❌ Error deleting draft');
        }
    };

    const handleEdit = (productId) => {
        navigate(`/admin/edit-product/${productId}`);
    };

    if (loading) {
        return (
            <AdminLayout>
                <AdminHeader title="Draft Products" subtitle="Manage your unpublished products" />
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <AdminHeader title="Draft Products" subtitle="Manage your unpublished products" />

            <div className="max-w-6xl mx-auto">
                {drafts.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No Drafts Found</h3>
                        <p className="text-slate-500 mb-6">You haven't saved any products as drafts yet.</p>
                        <button
                            onClick={() => navigate('/admin/add-product')}
                            className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg transition-all"
                        >
                            Create New Product
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {drafts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                            >
                                {/* Product Image */}
                                <div className="aspect-square bg-slate-100 relative">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 backdrop-blur-md bg-gradient-to-r from-gold/90 to-amber-400/90 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/30">
                                        DRAFT
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900 mb-1 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-2">
                                        {product.category}
                                    </p>
                                    <p className="text-lg font-bold text-primary mb-4">
                                        ₹{parseFloat(product.price).toFixed(2)}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product.id)}
                                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 text-sm"
                                            title="Edit Draft"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handlePublish(product.id)}
                                            className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 text-sm"
                                            title="Publish Product"
                                        >
                                            <CheckCircle size={16} />
                                            Publish
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-3 rounded-lg transition-all"
                                            title="Delete Draft"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Drafts;
