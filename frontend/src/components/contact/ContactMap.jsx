import React from 'react';
import { MapPin, Search, Plus, Minus, Navigation, ExternalLink } from 'lucide-react';

const ContactMap = () => {
    return (
        <section className="mb-16 rounded-xl overflow-hidden shadow-sm border border-[#eff0ea] dark:border-[#2a2c22] relative h-[400px] w-full bg-[#e5e5e5] group">
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://maps.google.com/maps?q=9.245495,76.5379389&hl=es;z=14&output=embed"
                title="Bhavani Boutique Location"
                className="filter saturate-150 contrast-110"
            >
            </iframe>

            {/* Clickable Tooltip Overlay */}
            <a
                href="https://www.google.com/maps/place/BHAVANI+BOUTIQUE/@9.245495,76.5379389,17z/data=!3m1!4b1!4m6!3m5!1s0x3b0619fe6e388481:0x9e4938a725538f9a!8m2!3d9.245495!4d76.5379389!16s%2Fg%2F11x_pwz8p9?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-16 cursor-pointer z-10 hover:scale-105 transition-transform"
            >
                <div className="bg-white dark:bg-zinc-900 border border-warm-gray-200 dark:border-zinc-700 shadow-xl py-2 px-4 rounded-lg relative animate-bounce-slow">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-maroon dark:text-brand-gold" />
                        <p className="font-serif font-bold text-brand-maroon dark:text-brand-gold text-sm whitespace-nowrap">
                            Bhavani Boutique
                        </p>
                    </div>
                    <p className="text-[10px] text-center text-gray-500 mt-0.5">Click to view on maps</p>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white dark:bg-zinc-900 border-r border-b border-warm-gray-200 dark:border-zinc-700 rotate-45"></div>
                </div>
            </a>

            {/* Map Controls */}
            <div className="absolute top-4 left-4">
                <div className="flex bg-white dark:bg-background-dark rounded-lg shadow-md p-2 items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Find our store"
                        className="border-none focus:ring-0 text-sm bg-transparent w-48 outline-none text-gray-700"
                    />
                </div>
            </div>

            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <div className="flex flex-col rounded-lg bg-white dark:bg-background-dark shadow-md overflow-hidden">
                    <button className="p-2 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600">
                        <Plus className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600">
                        <Minus className="w-5 h-5" />
                    </button>
                </div>
                <a
                    href="https://www.google.com/maps/place/BHAVANI+BOUTIQUE/@9.245495,76.5379389,17z/data=!3m1!4b1!4m6!3m5!1s0x3b0619fe6e388481:0x9e4938a725538f9a!8m2!3d9.245495!4d76.5379389!16s%2Fg%2F11x_pwz8p9?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white dark:bg-background-dark shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 transition-colors"
                    title="Open in Google Maps"
                >
                    <ExternalLink className="w-5 h-5" />
                </a>
            </div>
        </section>
    );
};

export default ContactMap;
