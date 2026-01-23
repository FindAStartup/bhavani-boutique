'use client';

import React, { useState } from 'react';
import { createClient } from '@/supabase/client';
import { Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

const SignupForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const supabase = createClient();
    const { signInWithGoogle } = useAuth();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreedToTerms) {
            setError('You must agree to the Terms of Service and Privacy Policy.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: `${firstName} ${lastName}`.trim(),
                        phone: phone,
                        role: 'customer'
                    }
                }
            });

            if (signUpError) throw signUpError;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Google signup failed');
        }
    };

    if (success) {
        return (
            <div className="w-full text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-display font-medium mb-3 text-[#161811]">Check your email</h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                    We've sent a verification link to <span className="font-semibold text-slate-800">{email}</span>. Please check your inbox to confirm your account.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="text-primary font-medium hover:underline"
                >
                    Back to Sign Up
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-display font-medium mb-2 text-[#161811]">Create Account</h2>
                <p className="text-slate-500 font-light text-sm">Start your journey with us today.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[#161811] placeholder:text-slate-300"
                            placeholder="Alex"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[#161811] placeholder:text-slate-300"
                            placeholder="Morgan"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[#161811] placeholder:text-slate-300"
                        placeholder="alex@example.com"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[#161811] placeholder:text-slate-300"
                        placeholder="+91 98765 43210"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Create Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[#161811] placeholder:text-slate-400 tracking-widest"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-start gap-3 mt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-500 leading-tight">
                        I agree to the <a href="/terms" className="underline text-slate-700 hover:text-primary">Terms of Service</a> and <a href="/privacy" className="underline text-slate-700 hover:text-primary">Privacy Policy</a>.
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#708238] hover:bg-[#5f6f2e] text-white font-bold uppercase tracking-wider text-sm py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-4"
                >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Create Account'}
                </button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;

