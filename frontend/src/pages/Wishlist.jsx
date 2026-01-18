import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { supabase } from '../supabaseClient';

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuthAndFetchWishlist();
    }, []);

    const checkAuthAndFetchWishlist = async () => {
        try {
            // Check if user is authenticated
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/login');
                return;
            }

            setUser(session.user);
            await fetchWishlist(session.access_token);
        } catch (err) {
            console.error('Auth check error:', err);
            navigate('/login');
        }
    };

    const fetchWishlist = async (token) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch wishlist');
            }

            const data = await response.json();
            setWishlistItems(data.wishlist || []);
        } catch (err) {
            console.error('Fetch wishlist error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove from wishlist');
            }

            // Update local state
            setWishlistItems(prev => prev.filter(item => item.id !== productId));

            // Trigger header to refresh wishlist count
            window.dispatchEvent(new Event('wishlistUpdated'));
        } catch (err) {
            console.error('Remove from wishlist error:', err);
            alert('Failed to remove item from wishlist');
        }
    };

    const isNewlyAdded = (addedDate) => {
        const added = new Date(addedDate);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return added > weekAgo;
    };

    const getStockStatus = (productStock) => {
        if (!productStock || productStock.length === 0) {
            return { status: 'out', label: 'Out of Stock', color: 'bg-black/80' };
        }

        const totalStock = productStock.reduce((sum, item) => sum + (item.stock_quantity || 0), 0);

        if (totalStock === 0) {
            return { status: 'out', label: 'Out of Stock', color: 'bg-black/80' };
        } else if (totalStock <= 5) {
            return { status: 'low', label: 'Low Stock', color: 'bg-orange-600' };
        } else {
            return { status: 'in', label: 'In Stock', color: 'bg-primary' };
        }
    };

    return (
        <MainLayout>
            <main className="flex-1 flex flex-col items-center">
                <div className="w-full max-w-[1200px] px-6 py-12">
                    {/* Page Heading */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10 pb-6 border-b border-stone-200">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.03em]" style={{ color: '#550000' }}>
                                My Wishlist
                            </h1>
                            <p className="text-slate-600 text-lg">
                                Curated styles just for you ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
                            </p>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <span className="material-icons-outlined text-6xl text-red-500 mb-4">error</span>
                                <p className="text-xl text-slate-600">
                                    Failed to load wishlist. Please try again later.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && wishlistItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32">
                            <span className="material-icons-outlined text-[120px] text-slate-300 mb-6">favorite_border</span>
                            <h2 className="text-4xl font-bold text-slate-700 mb-3">No items are present</h2>
                            <p className="text-slate-500 text-lg mb-10 text-center max-w-md">
                                Check back soon for your favorite items in your wishlist.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-10 py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:brightness-110 transition-all"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}

                    {/* Wishlist Grid */}
                    {!loading && !error && wishlistItems.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {wishlistItems.map((item) => {
                                const stockInfo = getStockStatus(item.product_stock);
                                const imageUrl = item.images && item.images.length > 0
                                    ? item.images[0]
                                    : 'https://via.placeholder.com/400x600?text=No+Image';

                                return (
                                    <div key={item.id} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                        <div className="relative w-full aspect-[3/4] overflow-hidden">
                                            <div
                                                className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: `url("${imageUrl}")` }}
                                                role="img"
                                                aria-label={item.name}
                                            />
                                            <button
                                                onClick={() => removeFromWishlist(item.id)}
                                                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:bg-white transition-colors"
                                                aria-label="Remove from wishlist"
                                            >
                                                <span className="material-icons-outlined">favorite</span>
                                            </button>

                                            {/* NEW Badge - shows for 7 days after adding to wishlist */}
                                            {isNewlyAdded(item.added_at) && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-primary/90 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border border-white/20">
                                                        New
                                                    </span>
                                                </div>
                                            )}

                                            {stockInfo.status === 'out' ? (
                                                <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                                                    <span className="bg-black/80 text-white text-xs font-black px-4 py-2 rounded-lg uppercase tracking-widest">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="absolute bottom-4 left-4">
                                                    <span className={`${stockInfo.color} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest`}>
                                                        {stockInfo.label}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className={`p-5 flex flex-col gap-4 ${stockInfo.status === 'out' ? 'opacity-70' : ''}`}>
                                            <div>
                                                <h3
                                                    className="text-lg font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer"
                                                    style={{ color: '#550000' }}
                                                    onClick={() => navigate(`/product/${item.id}`)}
                                                >
                                                    {item.name}
                                                </h3>
                                                <p className="text-primary text-xl font-black mt-1">
                                                    ₹{parseFloat(item.price).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {stockInfo.status === 'out' ? (
                                                    <button
                                                        className="flex w-full items-center justify-center rounded-lg h-11 bg-gray-400 text-white text-sm font-bold leading-normal tracking-wide cursor-not-allowed"
                                                        disabled
                                                    >
                                                        Notify Me
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => navigate(`/product/${item.id}`)}
                                                        className="flex w-full items-center justify-center rounded-lg h-11 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
                                                    >
                                                        <span className="material-icons-outlined mr-2 text-[20px]">shopping_cart</span>
                                                        View Product
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => removeFromWishlist(item.id)}
                                                    className="flex w-full items-center justify-center h-8 text-red-600 text-xs font-bold uppercase tracking-widest hover:text-red-700 hover:bg-red-50 transition-colors rounded"
                                                >
                                                    Remove Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer CTA */}
                    {!loading && !error && wishlistItems.length > 0 && (
                        <div className="mt-20 flex flex-col items-center justify-center py-12 px-6 bg-primary/10 rounded-2xl border border-primary/20">
                            <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: '#550000' }}>
                                Found your perfect look?
                            </h2>
                            <p className="text-slate-600 text-center mb-8 max-w-lg">
                                Don't wait too long – our boutique collections are limited. Explore your wishlist items and complete your order today.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-10 py-4 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-all"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </MainLayout>
    );
};

export default Wishlist;
