'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { getUserRole } from '@/server/actions/auth.actions';

interface LoginFormProps {
    onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Check user role
            const { role } = await getUserRole();

            if (role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }

            router.refresh();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-display font-medium mb-2 text-[#161811]">Welcome Back</h2>
                <p className="text-slate-500 font-light text-sm">Please enter your details to access your account.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
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

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Password</label>
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className="text-xs text-primary font-bold hover:text-primary/80"
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[#161811] placeholder:text-slate-400 tracking-widest"
                            placeholder="••••••••"
                            required
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#708238] hover:bg-[#5f6f2e] text-white font-bold uppercase tracking-wider text-sm py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-4"
                >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Sign In'}
                </button>
            </form>


        </div>
    );
};

export default LoginForm;

