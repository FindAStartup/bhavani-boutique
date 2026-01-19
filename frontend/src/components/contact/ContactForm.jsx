import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: 'Order Status',
        message: ''
    });

    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Sending message...' });

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([
                    {
                        full_name: formData.fullName,
                        email: formData.email,
                        subject: formData.subject,
                        message: formData.message
                    }
                ]);

            if (error) throw error;

            setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
            setFormData({ fullName: '', email: '', subject: 'Order Status', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
        }
    };

    return (
        <section className="bg-white dark:bg-[#21231a] p-8 lg:p-12 rounded-2xl border border-[#eff0ea] dark:border-[#2a2c22] shadow-sm">
            <div className="flex flex-col gap-8">
                <div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Customer Enquiry</h2>
                    <p className="text-sm text-[#7c8560] mb-4">Please fill out the form below and we will get back to you within 24 hours.</p>
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
                            <label className="text-xs font-bold uppercase tracking-wider text-[#161811] dark:text-[#eff0ea] font-sans">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                className="bg-background-light border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#161811] dark:text-[#eff0ea] font-sans">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="jane@example.com"
                                className="bg-background-light border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#161811] dark:text-[#eff0ea] font-sans">Subject</label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="bg-background-light border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary/50 transition-all outline-none appearance-none"
                        >
                            <option>Order Status</option>
                            <option>Product Inquiry</option>
                            <option>Wholesale/B2B</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#161811] dark:text-[#eff0ea] font-sans">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            placeholder="How can we help you today?"
                            className="bg-background-light border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary/50 transition-all outline-none resize-none"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={status.type === 'loading'}
                        className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-[#5a6a2d] transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
