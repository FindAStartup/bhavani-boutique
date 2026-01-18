import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../../supabaseClient';
import { Eye, EyeOff, X } from 'lucide-react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                if (signInError.message.includes('Email not confirmed')) {
                    setError('Please verify your email before logging in. Check your inbox for the verification link.');
                } else if (signInError.message.includes('Invalid login credentials')) {
                    setError('Invalid email or password. Please try again.');
                } else {
                    setError(signInError.message);
                }
                setLoading(false);
                return;
            }

            const userId = data.user.id;
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/get-user-role`, { userId });
            const role = response.data.role;

            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.status === 404) {
                setError('Account not found. Please sign up first.');
            } else {
                setError('An error occurred during login. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setResetMessage('');
        setResetLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                setResetMessage(`Error: ${error.message}`);
            } else {
                setResetMessage('✅ Password reset link sent! Check your email inbox.');
                setTimeout(() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setResetMessage('');
                }, 3000);
            }
        } catch (err) {
            console.error('Password reset error:', err);
            setResetMessage('An error occurred. Please try again.');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <>
            <div>
                <h2 className="text-3xl font-display mb-3 text-slate-800">Welcome Back</h2>
                <p className="text-sm text-slate-500 mb-8">Please enter your details to access your account.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-xs font-medium text-slate-600 uppercase tracking-wider">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative" style={{ zIndex: 10000 }}>
                        <button
                            onClick={() => {
                                setShowForgotPassword(false);
                                setResetEmail('');
                                setResetMessage('');
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-display mb-3 text-slate-800">Reset Password</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        {resetMessage && (
                            <div className={`mb-4 p-4 rounded-lg ${resetMessage.includes('✅')
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-red-50 border border-red-200'
                                }`}>
                                <p className={`text-sm ${resetMessage.includes('✅') ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {resetMessage}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label htmlFor="reset-email" className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <input
                                    id="reset-email"
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
                                    placeholder="you@example.com"
                                    required
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={resetLoading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                            >
                                {resetLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginForm;
