'use server';

import * as newsletterService from '../services/newsletter.service';

export type SubscribeState = {
    message?: string;
    error?: string;
    success?: boolean;
};

export async function subscribeToNewsletter(
    prevState: SubscribeState,
    formData: FormData
): Promise<SubscribeState> {
    const email = formData.get('email') as string;

    try {
        await newsletterService.subscribeToNewsletterService(email);
        return { success: true, message: 'Thanks for subscribing!' };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return { error: error.message };
    }
}
