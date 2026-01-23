'use server';

import { createClient } from '@/supabase/server';

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient();

    const full_name = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!full_name || !email || !message) {
        return { error: 'Please fill in all required fields.' };
    }

    try {
        const { error } = await supabase
            .from('contact_messages')
            .insert([
                {
                    full_name,
                    email,
                    subject: subject || 'Order Status',
                    message
                }
            ]);

        if (error) {
            console.error('Contact form error:', error);
            return { error: 'Failed to send message. Please try again.' };
        }

        return { success: 'Message sent successfully! We will get back to you soon.' };
    } catch (error) {
        console.error('Contact submit error:', error);
        return { error: 'Internal server error.' };
    }
}

