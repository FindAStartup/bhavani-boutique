import React from 'react';

const PrivacyPolicy = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-stone-100">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#5d1818] mb-2">Privacy Policy</h1>
                <p className="text-sm text-slate-500 mb-8 uppercase tracking-wider">Last Updated: {currentDate}</p>

                <div className="space-y-8 text-slate-600 leading-relaxed">
                    <section>
                        <p className="mb-4">
                            At <strong>Bhavani Boutique</strong>, we value your trust and are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you visit our website <a href="https://bhavaniboutiques.in" className="text-primary hover:underline">bhavaniboutiques.in</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">1. Information We Collect</h2>
                        <p className="mb-4">We may collect the following types of information:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping/billing address when you make a purchase or contact us.</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with our website, such as IP address, browser type, pages visited, and time spent on the site.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">We use your information to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Process and deliver your orders.</li>
                            <li>Respond to your inquiries and customer support requests.</li>
                            <li>Send updates, promotional offers, and newsletters (you can opt-out at any time).</li>
                            <li>Improve our website functionality and user experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">3. Information Sharing</h2>
                        <p>
                            We <strong>do not</strong> sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential (e.g., payment processors, shipping partners).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">4. Cookies</h2>
                        <p>
                            Our website uses cookies to enhance your browsing experience. Cookies help us remember your preferences and cart items. You can choose to disable cookies through your browser settings, though this may affect some site functionalities.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">5. Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information. However, please be aware that no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">6. Third-Party Links</h2>
                        <p>
                            Our website may contain links to third-party sites (e.g., social media). We are not responsible for the privacy practices or content of these external sites.
                        </p>
                    </section>

                    <section className="bg-stone-50 p-6 rounded-lg border border-stone-200 mt-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">7. Contact Us</h2>
                        <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
                        <div className="space-y-1">
                            <p><strong>Email:</strong> <a href="mailto:support@bhavaniboutiques.in" className="text-primary hover:underline">support@bhavaniboutiques.in</a></p>
                            <p><strong>Phone:</strong> <a href="tel:+919446304423" className="text-primary hover:underline">+91 94463 04423</a></p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
