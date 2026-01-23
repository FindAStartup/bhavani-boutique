'use client';

import React, { useState } from 'react';
import { createClient } from '@/supabase/client';
import { Loader, ArrowLeft } from 'lucide-react';

interface ForgotFormProps {
    onBackToLogin: () => void;
}

const ForgotForm: React.FC<ForgotFormProps> = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            // Check if we are in a browser environment to get the origin
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            const redirectTo = `${origin}/auth/callback?next=/update-password`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo,
            });

            if (error) throw error;

            setMessage('Check your email for the password reset link.');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <button
                    onClick={onBackToLogin}
                    className="flex items-center text-slate-500 hover:text-[#708238] transition-colors mb-4 text-xs font-bold uppercase tracking-wider"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </button>
                <h2 className="text-2xl font-display font-medium mb-2 text-[#161811]">Forgot Password?</h2>
                <p className="text-slate-500 font-light text-sm">Enter your email address and we&apos;ll send you a link to reset your password.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100">
                    {error}
                </div>
            )}

            {message && (
                <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-6 border border-green-100">
                    {message}
                </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Email Address</label>
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[#161811]"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#708238] hover:bg-[#5f6f2e] text-white font-bold uppercase tracking-wider text-sm py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-4"
                >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                </button>
            </form>
        </div>
    );
};

export default ForgotForm;
