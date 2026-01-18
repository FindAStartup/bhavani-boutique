import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import LoginImage from '../assets/Login.png';
import LogoWhite from '../assets/BB_white.png';
import bbLogo from '../assets/BB_Black.png';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user has a valid session from the reset link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('Invalid or expired reset link. Please request a new password reset.');
            }
        };
        checkSession();
    }, []);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) {
                setError(updateError.message);
            } else {
                setSuccess('✅ Password updated successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            console.error('Password reset error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex h-screen w-screen overflow-hidden bg-background-light relative">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
                <div className="absolute inset-0 z-10 bg-black/20"></div>
                <img
                    src={LoginImage}
                    alt="Elegant fashion model in a boutique setting"
                    className="absolute inset-0 object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-1000"
                />
                <div className="relative z-20 flex flex-col justify-between p-12 pr-32 text-white h-full w-full">
                    <div className="flex items-center space-x-0 gap-1.5">
                        <img src={LogoWhite} alt="Bhavani Boutique Logo" className="h-20 w-auto" />
                        <span className="font-display text-lg tracking-widest uppercase">Bhavani Boutique</span>
                    </div>
                    <div>
                        <h1 className="font-display text-6xl leading-tight mb-6">Redefining <br /><span className="italic text-[gold]">Timeless</span> Style.</h1>
                        <p className="text-lg opacity-90 max-w-md font-light leading-relaxed">
                            Join our exclusive community of fashion enthusiasts and discover a curated collection of artisan-crafted dresses.
                        </p>
                    </div>
                    <div className="flex space-x-6 text-sm font-medium tracking-widest">
                        <a href="#" className="hover:text-gold transition-colors">INSTAGRAM</a>
                        <a href="#" className="hover:text-gold transition-colors">FACEBOOK</a>
                        <a href="#" className="hover:text-gold transition-colors">X</a>
                    </div>
                </div>
            </div>

            {/* Mobile Background Image */}
            <div className="lg:hidden absolute inset-0 z-0 opacity-10">
                <img
                    src={LoginImage}
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right Side - Reset Password Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-background-light/90 lg:bg-background-light relative z-10 h-full">
                <header className="flex justify-between items-center p-6 lg:p-8 shrink-0">
                    <div className="lg:hidden flex items-center space-x-3">
                        <img src={bbLogo} alt="Logo" className="h-10 w-auto" />
                        <span className="font-display text-base tracking-widest uppercase">Bhavani Boutique</span>
                    </div>
                </header>

                <div className="mb-20 lg:flex-1 flex flex-col justify-start pt-10 lg:justify-center lg:pt-0 px-6 sm:px-12 lg:px-16 pb-4 lg:pb-8 max-w-lg mx-auto w-full">
                    <div>
                        <h2 className="text-3xl font-display mb-3 text-slate-800">Reset Your Password</h2>
                        <p className="text-sm text-slate-500 mb-8">Enter your new password below.</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-600">{success}</p>
                            </div>
                        )}

                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label htmlFor="new-password" className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="new-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 pr-12"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters</p>
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 pr-12"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                            >
                                {loading ? 'Updating Password...' : 'Reset Password'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-sm text-primary hover:underline font-medium"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <footer className="mt-4 lg:mt-12 text-center pb-6">
                    <p className="text-xs text-slate-400 tracking-wide">
                        © 2026 Bhavani Boutique. HANDCRAFTED BOUTIQUE EXPERIENCE.
                    </p>
                </footer>
            </div>
        </main>
    );
};

export default ResetPassword;
