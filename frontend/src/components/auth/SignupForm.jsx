import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const SignupForm = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const { error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                    }
                }
            });

            if (authError) throw authError;

            // Successful signup - Prompt for verification
            setSuccessMessage("Registration successful! Please check your email to verify your account before logging in.");

        } catch (err) {
            setError(err.message || 'Signup failed');
        }
    };

    if (successMessage) {
        return (
            <div className="animate-fade-in text-center py-8 max-w-md mx-auto">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 p-8 rounded-2xl mb-6 shadow-lg">
                    <div className="flex justify-center mb-4">
                        <span className="material-icons text-6xl text-green-600">mark_email_read</span>
                    </div>
                    <h3 className="font-display text-3xl mb-3 text-green-900">Verify Your Email</h3>
                    <p className="text-green-700 leading-relaxed mb-2">{successMessage}</p>
                    <p className="text-sm text-green-600 mt-4">Please check your inbox and spam folder.</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-primary hover:text-burgundy font-semibold underline underline-offset-4 transition-colors duration-200"
                >
                    ← Back to Sign Up
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h2 className="font-display text-2xl mb-2">Create Account</h2>
                <p className="text-slate-500">Start your journey with us today.</p>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <form className="space-y-5" onSubmit={handleSignup}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Alex"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Morgan"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@example.com"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">Create Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                        >
                            <span className="material-icons-outlined text-lg">
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                </div>
                <div className="flex items-start space-x-2 py-2">
                    <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-500">
                        I agree to the <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a> and <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-opacity-90 text-white font-semibold tracking-widest uppercase transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                >
                    <span>Create Account</span>
                </button>
            </form>
        </div>
    );
};

export default SignupForm;
