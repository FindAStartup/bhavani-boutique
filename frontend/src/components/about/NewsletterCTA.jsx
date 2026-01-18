import React from 'react';

const NewsletterCTA = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle subscription
    };

    return (
        <section className="bg-[#161811] text-white py-20">
            <div className="max-w-[800px] mx-auto px-6 text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-light">Join Our Journey</h2>
                <p className="text-white/60 font-light">Subscribe to receive exclusive collection previews and stories from our artisans.</p>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                    <input
                        className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-white placeholder-white/40"
                        placeholder="Email Address"
                        type="email"
                        required
                    />
                    <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all">
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
};

export default NewsletterCTA;
