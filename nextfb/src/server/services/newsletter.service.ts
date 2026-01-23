import * as newsletterRepo from '../repositories/newsletter.repo'

export async function subscribeToNewsletterService(email: string) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address.');
    }

    const { error } = await newsletterRepo.insertSubscriber(email);

    if (error) {
        if (error.code === '23505') { // Unique violation
            throw new Error('You are already subscribed!');
        }
        console.error('Newsletter service error:', error);
        throw new Error('Something went wrong. Please try again.');
    }

    return true;
}
