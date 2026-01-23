'use client';

import React, { useState, useActionState, useEffect } from 'react';
import Image from 'next/image';
import { X, Loader2 } from 'lucide-react';
import { submitStartupIdea } from '@/server/actions/startup.actions';
import { useFormStatus } from 'react-dom';

const initialState = {
    message: '',
    error: '',
    success: false
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary hover:bg-[#5d6b2e] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
            {pending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                </>
            ) : (
                'Submit Application'
            )}
        </button>
    );
}

const FindStartupModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction] = useActionState(submitStartupIdea, initialState);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        // Optional: Reset state if needed, but useActionState doesn't easily reset without key change or effect
    };

    // Close on success after a delay
    useEffect(() => {
        if (state.success) {
            const timer = setTimeout(() => {
                closeModal();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [state.success]);

    return (
        <>
            {/* Trigger */}
            <div
                className="flex flex-row items-center gap-8 cursor-pointer group"
                onClick={openModal}
            >
                <span className="text-[10px] uppercase tracking-widest text-[#5d1818] font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                    Created By
                </span>
                <Image
                    src="/findastartup-white_bg.png"
                    alt="FindAStartup"
                    width={140}
                    height={45}
                    className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                />
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>

                    {/* Content */}
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-stone-50">
                            <h3 className="text-lg font-bold text-gray-800 font-serif">Apply to Find A Startup</h3>
                            <button
                                onClick={closeModal}
                                className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all shadow-sm"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto">
                            {state.success ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-icons-outlined text-3xl">check</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">Application Received!</h4>
                                    <p className="text-gray-600">
                                        {state.message || "We've received your details and will get back to you soon."}
                                    </p>
                                </div>
                            ) : (
                                <form action={formAction} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Jane Doe"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="jane@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <textarea
                                            id="idea"
                                            name="idea"
                                            required
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                            placeholder="Tell us a bit about what you want to know..."
                                        ></textarea>
                                    </div>

                                    {state.error && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                                            <span className="material-icons-outlined text-sm mt-0.5">error_outline</span>
                                            {state.error}
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <SubmitButton />
                                        <p className="text-xs text-center text-gray-400 mt-3">
                                            By submitting, you agree to share your details with our team.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FindStartupModal;
