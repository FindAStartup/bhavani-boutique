import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const TermsOfService = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="font-sans text-slate-800">
            <Header />

            <main className="pt-24 pb-16 min-h-screen bg-stone-50">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-stone-100">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#5d1818] mb-2">Terms of Service</h1>
                        <p className="text-sm text-slate-500 mb-8 uppercase tracking-wider">Last Updated: January 20, 2026</p>

                        <div className="space-y-8 text-slate-600 leading-relaxed">
                            <section>
                                <p className="mb-4">
                                    Welcome to <strong>Bhavana Boutique</strong>. By accessing or using our website <a href="https://bhavaniboutiques.in" className="text-primary hover:underline">bhavaniboutiques.in</a>, you agree to be bound by these Terms of Service. Please read them carefully.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
                                <p>By using our site, you agree to these terms and conditions. If you do not agree, please do not use our website.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">2. Products and Services</h2>
                                <p>
                                    We make every effort to display our products (colors, images, and descriptions) as accurately as possible. However, we cannot guarantee that your device's display will accurately reflect the actual product. All products are subject to availability.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">3. Pricing and Payments</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>All prices are listed in Indian Rupees (INR) and are subject to change without notice.</li>
                                    <li>We reserve the right to modify or discontinue any product at any time.</li>
                                    <li>Payment must be made in full at the time of purchase.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">4. Returns and Refunds</h2>
                                <p>
                                    Please review our separate Return Policy (if applicable) for information on returns and refunds. Generally, we accept returns for defective items within 7 days of delivery. Custom-made items are non-refundable.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">5. Intellectual Property</h2>
                                <p>
                                    All content on this website, including text, graphics, logos, images, and software, is the property of Bhavana Boutique and is protected by copyright laws. You may not use our content without express written permission.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">6. User Conduct</h2>
                                <p>
                                    You agree not to use our website for any unlawful purpose or to violate any laws in your jurisdiction. You must not transmit any worms, viruses, or destructive code.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">7. Limitation of Liability</h2>
                                <p>
                                    Bhavana Boutique shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our products or website.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">8. Governing Law</h2>
                                <p>
                                    These Terms shall be governed by and construed in accordance with the laws of India, specifically the jurisdiction of Kerala.
                                </p>
                            </section>

                            <section className="bg-stone-50 p-6 rounded-lg border border-stone-200 mt-8">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">9. Contact Information</h2>
                                <p className="mb-4">Questions about the Terms of Service should be sent to us at:</p>
                                <div className="space-y-1">
                                    <p><strong>Email:</strong> <a href="mailto:support@bhavaniboutiques.in" className="text-primary hover:underline">support@bhavaniboutiques.in</a></p>
                                    <p><strong>Phone:</strong> <a href="tel:+919446304423" className="text-primary hover:underline">+91 94463 04423</a></p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfService;
