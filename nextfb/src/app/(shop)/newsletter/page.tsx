import Newsletter from "@/components/home/Newsletter";

export const metadata = {
    title: 'Newsletter | Bhavani Boutique',
    description: 'Subscribe to our newsletter for exclusive updates.',
};

export default function NewsletterPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh] flex items-center justify-center">
            <div className="w-full max-w-4xl">
                <Newsletter />
            </div>
        </div>
    );
}
