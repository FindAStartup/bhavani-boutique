'use client';

import React, { useState } from 'react';
import { createClient } from '@/supabase/client';
import { Eye, EyeOff, Loader, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { checkEmailAvailability } from '@/actions/auth';

const SignupForm = () => {
    // Step state: 1 = Personal Details & Email, 2 = Password & Terms
    const [step, setStep] = useState(1);

    // Form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // UI states
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const supabase = createClient();

    const handleDetailsCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!firstName || !lastName || !email) {
            setError('Please fill in all required fields.');
            return;
        }

        // Check if email ends with .com
        if (!email.toLowerCase().endsWith('.com')) {
            setError('Email must end with .com');
            return;
        }

        setLoading(true);

        try {
            // Check availability via Server Action (Checks Supabase Auth Users)
            const result = await checkEmailAvailability(email);

            if (!result.available) {
                setError(result.message || 'This email cannot be used.');
                setLoading(false);
                return;
            }

            // If valid and available, proceed to step 2 (Password)
            setStep(2);
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
            setSuccess(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
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
                    We&apos;ve sent a verification link to <span className="font-semibold text-slate-800">{email}</span>. Please check your inbox to confirm your account.
                </p>
                <button
                    onClick={() => {
                        setSuccess(false);
                        setStep(1);
                        setEmail('');
                        setPassword('');
                        setFirstName('');
                        setLastName('');
                        setPhone('');
                    }}
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
                <p className="text-slate-500 font-light text-sm">
                    {step === 1 ? 'Enter your details to get started.' : 'Set a password to complete your account.'}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100 flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {step === 1 ? (
                // STEP 1: Personal Details & Email Check
                <form onSubmit={handleDetailsCheck} className="space-y-5 animate-in slide-in-from-left-4 fade-in duration-300">
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
                                autoFocus
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
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[#161811] placeholder:text-slate-300"
                            placeholder="alex@example.com"
                            required
                        />
                        <p className="text-xs text-slate-400">Must be a valid .com email address</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#708238] hover:bg-[#5f6f2e] text-white font-bold uppercase tracking-wider text-sm py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-4 group"
                    >
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : (
                            <>
                                Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                    </div>
                </form>
            ) : (
                // STEP 2: Password & Terms
                <form onSubmit={handleSignup} className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="space-y-1.5 opacity-60">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Personal Details</label>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <ArrowLeft className="w-3 h-3" /> Edit
                            </button>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                            <p className="font-medium text-[#161811]">{firstName} {lastName}</p>
                            <p>{email}</p>
                            {phone && <p>{phone}</p>}
                        </div>
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
                                autoFocus
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
            )}
        </div>
    );
};

export default SignupForm;
