import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // If not logged in, maybe show empty or redirect? 
                // For now, let's assume specific behavior or redirect
                // But the design shows a full page. Let's just return empty if no session or redirect
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/cart', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data.cart);
                calculateSubtotal(data.cart);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateSubtotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        setSubtotal(total);
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Optimistic update
            const updatedItems = cartItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedItems);
            calculateSubtotal(updatedItems);

            const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (!response.ok) {
                // Revert on error
                fetchCart();
            } else {
                window.dispatchEvent(new Event('cartUpdated'));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            fetchCart();
        }
    };

    const removeItem = async (itemId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Optimistic update
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedItems);
            calculateSubtotal(updatedItems);

            const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                fetchCart();
            }
        } catch (error) {
            console.error('Error removing item:', error);
            fetchCart();
        }
    };

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f7f7f6] dark:bg-[#1b1d15] transition-colors duration-200">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
                {/* Page Heading */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div>
                        <h1 className="text-[#151613] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Your Selections</h1>
                        <p className="text-[#7a7f6c] mt-2 flex items-center gap-2">
                            <span className="material-icons-outlined text-sm">local_shipping</span>
                            Enjoy <span className="text-primary font-semibold">Free Express Shipping</span> on this order
                        </p>
                    </div>
                    <Link to="/" className="text-primary font-semibold text-sm flex items-center gap-2 hover:underline">
                        <span className="material-icons-outlined text-sm">arrow_back</span>
                        Continue Shopping
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#24261d] rounded-xl border border-[#e2e3de] dark:border-[#2d2f26]">
                        <span className="material-icons-outlined text-6xl text-slate-300 mb-4">shopping_cart</span>
                        <h2 className="text-xl font-bold text-[#151613] dark:text-white mb-2">Your cart is empty</h2>
                        <p className="text-[#7a7f6c] mb-6">Looks like you haven't added any items yet.</p>
                        <Link to="/" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Product List Table Area */}
                        <div className="flex-grow flex flex-col gap-6">
                            <div className="overflow-hidden rounded-xl border border-[#e2e3de] dark:border-[#2d2f26] bg-white dark:bg-[#24261d]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#fcfcfb] dark:bg-[#1b1d15] border-b border-[#e2e3de] dark:border-[#2d2f26]">
                                            <th className="px-6 py-4 text-sm font-semibold text-[#151613] dark:text-white uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-[#151613] dark:text-white uppercase tracking-wider hidden sm:table-cell">Size</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-[#151613] dark:text-white uppercase tracking-wider text-center">Quantity</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-[#151613] dark:text-white uppercase tracking-wider text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#e2e3de] dark:divide-[#2d2f26]">
                                        {cartItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-background-light/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className="h-20 w-20 flex-shrink-0 bg-center bg-no-repeat bg-cover rounded-lg shadow-sm"
                                                            style={{ backgroundImage: `url(${item.product.images?.[0] || 'https://via.placeholder.com/150'})` }}
                                                        ></div>
                                                        <div>
                                                            <Link to={`/product/${item.product.id}`} className="text-[#151613] dark:text-white font-bold hover:text-primary transition-colors">
                                                                {item.product.name}
                                                            </Link>
                                                            <p className="text-[#7a7f6c] text-xs mt-1">Ref: {item.product.id.slice(0, 8)}</p>
                                                            <div className="sm:hidden mt-1 text-xs px-2 py-0.5 bg-[#f3f3f1] dark:bg-[#2d2f26] rounded-full inline-block">Size: {item.size}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 hidden sm:table-cell">
                                                    <span className="px-3 py-1 bg-[#f3f3f1] dark:bg-[#2d2f26] rounded-md text-sm font-medium text-[#151613] dark:text-white">{item.size}</span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                                                            className="h-8 w-8 rounded-full border border-[#e2e3de] dark:border-[#2d2f26] flex items-center justify-center text-[#151613] dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all"
                                                        >
                                                            <span className="material-icons-outlined text-sm">remove</span>
                                                        </button>
                                                        <span className="text-sm font-bold w-4 text-center text-[#151613] dark:text-white">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="h-8 w-8 rounded-full border border-[#e2e3de] dark:border-[#2d2f26] flex items-center justify-center text-[#151613] dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all"
                                                        >
                                                            <span className="material-icons-outlined text-sm">add</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-right font-bold text-[#151613] dark:text-white">
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Promo Code Input */}
                            <div className="flex flex-col sm:flex-row items-end gap-4 p-6 bg-white dark:bg-[#24261d] rounded-xl border border-[#e2e3de] dark:border-[#2d2f26]">
                                <label className="flex flex-col flex-1 w-full">
                                    <p className="text-[#151613] dark:text-white text-sm font-semibold pb-2">Promo Code</p>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 resize-none overflow-hidden rounded-lg text-[#151613] dark:text-white border border-[#e2e3de] dark:border-[#2d2f26] bg-white dark:bg-[#1b1d15] focus:border-primary focus:ring-1 focus:ring-primary h-12 placeholder:text-[#7a7f6c] p-[15px] text-sm font-normal focus:outline-none"
                                            placeholder="Enter code here"
                                        />
                                        <button className="h-12 px-6 bg-[#f3f3f1] dark:bg-[#2d2f26] text-[#151613] dark:text-white rounded-lg font-bold text-sm hover:bg-primary hover:text-white transition-all uppercase tracking-wider">
                                            Apply
                                        </button>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Right: Summary Sidebar Area */}
                        <div className="lg:w-96 flex-shrink-0">
                            <div className="sticky top-24 flex flex-col gap-4">
                                <div className="bg-white dark:bg-[#24261d] p-6 rounded-xl border border-[#e2e3de] dark:border-[#2d2f26] shadow-sm">
                                    <h3 className="text-[#151613] dark:text-white text-xl font-bold border-b border-[#e2e3de] dark:border-[#2d2f26] pb-4 mb-4">Order Summary</h3>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#7a7f6c] dark:text-[#b0b4a4]">Subtotal ({cartItems.length} items)</span>
                                            <span className="font-medium text-[#151613] dark:text-white">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#7a7f6c] dark:text-[#b0b4a4]">Shipping</span>
                                            <span className="text-primary font-bold flex items-center gap-1">
                                                FREE
                                                <span className="material-icons-outlined text-[16px] text-accent-gold">stars</span>
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#7a7f6c] dark:text-[#b0b4a4]">Est. Taxes</span>
                                            <span className="font-medium text-[#151613] dark:text-white">₹0.00</span>
                                        </div>
                                        <div className="border-t border-dashed border-[#e2e3de] dark:border-[#2d2f26] my-2"></div>
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-lg font-bold text-[#151613] dark:text-white">Total</span>
                                            <span className="text-2xl font-black text-primary">{formatPrice(subtotal)}</span>
                                        </div>
                                        <button className="w-full py-4 bg-primary text-white rounded-lg font-bold text-base shadow-lg shadow-primary/20 hover:bg-[#5d6d2f] transition-all transform active:scale-[0.98]">
                                            Proceed to Checkout
                                        </button>
                                        <p className="text-center text-[11px] text-[#7a7f6c] dark:text-[#b0b4a4] mt-2">
                                            By clicking 'Proceed to Checkout', you agree to our <a href="#" className="underline">Terms & Conditions</a>.
                                        </p>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap justify-center gap-4 py-4 px-2 bg-[#fcfcfb] dark:bg-white/5 rounded-xl border border-dashed border-[#e2e3de] dark:border-[#2d2f26]">
                                    <div className="flex items-center gap-2 text-[#7a7f6c] text-xs">
                                        <span className="material-icons-outlined text-sm text-accent-gold">verified_user</span>
                                        Secure Payment
                                    </div>
                                    <div className="flex items-center gap-2 text-[#7a7f6c] text-xs">
                                        <span className="material-icons-outlined text-sm text-accent-gold">autorenew</span>
                                        30-Day Returns
                                    </div>
                                    <div className="flex items-center gap-2 text-[#7a7f6c] text-xs">
                                        <span className="material-icons-outlined text-sm text-accent-gold">support_agent</span>
                                        Premium Support
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
