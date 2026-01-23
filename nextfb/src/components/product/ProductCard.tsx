'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from '@/server/actions/wishlist.actions';

interface ProductCardProps {
    product: any; // Replace with proper Product type
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isCheckingWishlist, setIsCheckingWishlist] = useState(true);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const checkStatus = async () => {
            const { in_wishlist, error } = await checkWishlistStatus(product.id);
            if (!error) {
                setIsFavorite(in_wishlist || false);
            }
            setIsCheckingWishlist(false);
        };
        checkStatus();
    }, [product.id]);


    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/product/${product.id}`);
    };

    const handleFavoriteToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            router.push('/login');
            return;
        }

        if (isTogglingWishlist) return;

        setIsTogglingWishlist(true);

        try {
            if (isFavorite) {
                // Remove from wishlist
                const { success } = await removeFromWishlist(product.id);
                if (success) {
                    setIsFavorite(false);
                    // Trigger header to refresh wishlist count
                    window.dispatchEvent(new Event('wishlistUpdated'));
                }
            } else {
                // Add to wishlist
                const { success, error } = await addToWishlist(product.id);
                if (success) {
                    setIsFavorite(true);
                    // Trigger header to refresh wishlist count
                    window.dispatchEvent(new Event('wishlistUpdated'));
                } else if (error === 'Product already in wishlist') {
                    // Handle edge case where it might be desynced locally
                    setIsFavorite(true);
                }
            }
        } catch (error) {
            console.error('Wishlist toggle error:', error);
        } finally {
            setIsTogglingWishlist(false);
        }
    };

    const handleCardClick = () => {
        router.push(`/product/${product.id}`);
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



