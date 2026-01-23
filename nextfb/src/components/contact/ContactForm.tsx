'use client';

import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { submitContactForm } from '@/server/actions/contact.actions';

const ContactForm = () => {
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus({ type: 'loading', message: 'Sending message...' });

        const formData = new FormData(event.currentTarget);

        const result = await submitContactForm(formData);

        if (result.error) {
            setStatus({ type: 'error', message: result.error });
        } else if (result.success) {
            setStatus({ type: 'success', message: result.success });
            (event.target as HTMLFormElement).reset();
        }
    };

    return (
        <section className="bg-white p-8 lg:p-12 rounded-2xl border border-[#eff0ea] shadow-sm">
            <div className="flex flex-col gap-8">
                <div>
                    <h2 className="text-3xl font-serif font-bold mb-2 text-[#161811]">Customer Enquiry</h2>
                    <p className="text-sm text-[#708238] mb-4 font-light">Please fill out the form below and we will get back to you within 24 hours.</p>
                    {status.message && (
                        <div className={`p-4 rounded-lg flex items-center gap-2 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                            status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                            {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {status.message}
                        </div>
                    )}
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#161811] font-sans">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                placeholder="Jane Doe"
                                className="bg-white border border-slate-200 rounded-lg p-3 text-base focus:ring-1 focus:ring-[#708238] focus:border-[#708238] transition-all outline-none text-slate-800 placeholder:text-slate-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#161811] font-sans">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="jane@example.com"
                                className="bg-white border border-slate-200 rounded-lg p-3 text-base focus:ring-1 focus:ring-[#708238] focus:border-[#708238] transition-all outline-none text-slate-800 placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#161811] font-sans">Subject</label>
                        <select
                            name="subject"
                            className="bg-white border border-slate-200 rounded-lg p-3 text-base focus:ring-1 focus:ring-[#708238] focus:border-[#708238] transition-all outline-none appearance-none text-slate-800"
                        >
                            <option value="Order Status">Order Status</option>
                            <option value="Product Inquiry">Product Inquiry</option>
                            <option value="Wholesale/B2B">Wholesale/B2B</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#161811] font-sans">Message</label>
                        <textarea
                            name="message"
                            rows={5}
                            required
                            placeholder="How can we help you today?"
                            className="bg-white border border-slate-200 rounded-lg p-3 text-base focus:ring-1 focus:ring-[#708238] focus:border-[#708238] transition-all outline-none resize-none text-slate-800 placeholder:text-slate-300"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={status.type === 'loading'}
                        className="w-full bg-[#708238] text-white font-bold py-4 rounded-lg hover:bg-[#5a6a2d] transition-colors shadow-lg shadow-[#708238]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                    >
                        <span>{status.type === 'loading' ? 'Sending...' : 'Send Message'}</span>
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;



