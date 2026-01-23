'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/server/actions/newsletter.actions';

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
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
        >
            {pending ? 'Subscribing...' : 'Subscribe'}
        </button>
    );
}

const NewsletterCTA = () => {
    const [state, formAction] = useActionState(subscribeToNewsletter, initialState);

    return (
        <section className="bg-[#161811] text-white py-20">
            <div className="max-w-[800px] mx-auto px-6 text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-light">Join Our Journey</h2>
                <p className="text-white/60 font-light">Subscribe to receive exclusive collection previews and stories from our artisans.</p>
                <form action={formAction} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto items-start">
                    <div className="flex-1 w-full flex flex-col">
                        <input
                            name="email"
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-white placeholder-white/40"
                            placeholder="Email Address"
                            type="email"
                            required
                        />
                        {state.error && <p className="text-red-400 text-sm mt-2 text-left">{state.error}</p>}
                        {state.success && <p className="text-green-400 text-sm mt-2 text-left">{state.message}</p>}
                    </div>
                    <SubmitButton />
                </form>
            </div>
        </section>
    );
};

export default NewsletterCTA;
