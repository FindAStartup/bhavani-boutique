'use server';

export type StartupFormState = {
    message?: string;
    error?: string;
    success?: boolean;
};

export async function submitStartupIdea(
    prevState: StartupFormState,
    formData: FormData
): Promise<StartupFormState> {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const idea = formData.get('idea') as string;

    if (!process.env.GOOGLE_SHEET_WEB_APP_URL) {
        // For development, if env var is missing, we might want to fail gracefully or log it.
        // But since the user specifically requested this connection, an error is appropriate if missing.
        return { error: 'Configuration error: Google Sheet Web App URL is missing. Please check .env file.' };
    }

    try {
        const response = await fetch(process.env.GOOGLE_SHEET_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, idea }),
        });

        if (!response.ok) {
            throw new Error(`Failed to submit to Google Sheet: ${response.statusText}`);
        }

        // Google Apps Script should return JSON.
        // If it returns HTML (e.g. error page), parsing might fail.
        const result = await response.json();

        if (result.result === 'error') {
            throw new Error(result.error || 'Unknown script error');
        }

        return { success: true, message: 'Your idea has been submitted successfully!' };

    } catch (error: any) {
        console.error('Startup submission error:', error);
        return { error: 'Failed to submit. Please try again later.' };
    }
}
