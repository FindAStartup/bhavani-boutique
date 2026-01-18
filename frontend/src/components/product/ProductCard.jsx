import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isCheckingWishlist, setIsCheckingWishlist] = useState(true);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

    useEffect(() => {
        checkWishlistStatus();
    }, [product.id]);

    const checkWishlistStatus = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setIsCheckingWishlist(false);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/check/${product.id}`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setIsFavorite(data.in_wishlist);
            }
        } catch (error) {
            console.error('Check wishlist error:', error);
        } finally {
            setIsCheckingWishlist(false);
        }
    };

    const handleQuickView = (e) => {
        e.stopPropagation();
        navigate(`/product/${product.id}`);
    };

    const handleFavoriteToggle = async (e) => {
        e.stopPropagation();

        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            navigate('/login');
            return;
        }

        if (isTogglingWishlist) return;

        setIsTogglingWishlist(true);

        try {
            if (isFavorite) {
                // Remove from wishlist
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/${product.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });

                if (response.ok) {
                    setIsFavorite(false);
                    // Trigger header to refresh wishlist count
                    window.dispatchEvent(new Event('wishlistUpdated'));
                }
            } else {
                // Add to wishlist
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({ product_id: product.id })
                });

                if (response.ok) {
                    setIsFavorite(true);
                    // Trigger header to refresh wishlist count
                    window.dispatchEvent(new Event('wishlistUpdated'));
                }
            }
        } catch (error) {
            console.error('Wishlist toggle error:', error);
        } finally {
            setIsTogglingWishlist(false);
        }
    };

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    // Get the first image or use a placeholder
    const imageUrl = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/400x600?text=No+Image';

    // Determine if product is new (created within last 7 days)
    const isNew = () => {
        const createdDate = new Date(product.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
    };

    // Calculate delivery date
    const getDeliveryDate = () => {
        const deliveryDays = product.delivery_days || 7; // Default to 7 days if not set
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

        // Format as "Jan 25, 2026"
        return deliveryDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div
            className="group product-card flex flex-col relative cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Product Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                    role="img"
                    aria-label={product.name}
                />

                {/* Quick View Overlay */}
                <div className="quick-view absolute inset-x-0 bottom-4 px-4 opacity-0 transform translate-y-4 transition-all duration-300">
                    <button
                        onClick={handleQuickView}
                        className="w-full py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
                    >
                        Quick View
                    </button>
                </div>

                {/* Wishlist Button - Heart Icon */}
                <button
                    onClick={handleFavoriteToggle}
                    className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/50 backdrop-blur hover:bg-white dark:hover:bg-black/70 rounded-full transition-all shadow-md"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isFavorite ? "#EF4444" : "none"}
                        stroke={isFavorite ? "#EF4444" : "#1F2937"}
                        strokeWidth="2"
                        className="w-5 h-5 transition-all"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>

                {/* Status Label - NEW Badge (shows for 7 days) */}
                {isNew() && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-primary/90 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border border-white/20">
                            New
                        </span>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="mt-3">
                <h3 className="font-semibold text-base mb-2 transition-colors line-clamp-2" style={{ color: '#550000' }}>
                    {product.name}
                </h3>
                <p className="text-primary font-bold text-lg mb-1">
                    ₹{parseFloat(product.price).toLocaleString('en-IN')}
                </p>
                {/* Delivery Date - Always visible in maroon */}
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                    Delivery by <span className="font-bold text-[#550000]">{getDeliveryDate()}</span>
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
