import React from 'react';

const Newsletter = () => {
    return (
        <section className="mt-24 mb-16 bg-brand-maroon rounded-[2rem] p-12 text-center text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>

            <div className="relative z-10">
                <span className="material-icons-outlined text-4xl mb-4 text-brand-gold">mail</span>
                <h2 className="text-4xl font-serif font-bold mb-4">Join the Bhavani Circle</h2>
                <p className="text-stone-300 max-w-xl mx-auto mb-10 leading-relaxed">
                    Subscribe to receive exclusive access to private sales, early collection drops, and style inspiration.
                </p>
                <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                        className="flex-1 px-6 py-4 bg-white/10 border-white/20 focus:ring-primary rounded-full text-white placeholder:text-stone-400 backdrop-blur-sm"
                        placeholder="Your email address"
                        type="email"
                    />
                    <button className="px-8 py-4 bg-primary hover:bg-[#5d6b2e] text-white rounded-full font-bold transition-all whitespace-nowrap">
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
