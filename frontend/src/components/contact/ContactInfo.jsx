import React from 'react';
import { MapPin, Phone, Mail, Share2, Camera, Globe } from 'lucide-react';

const ContactInfo = () => {
    return (
        <section className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Boutique Information</h2>
                <div className="space-y-8">
                    {/* Address */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-full bg-primary/10 text-brand-gold">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs uppercase tracking-widest text-[#7c8560] mb-1 font-sans font-semibold">Address</p>
                            <p className="text-lg text-gray-800 dark:text-gray-200">ASWATHY ARCADE,<br /> WEST NADA SREEKRISHNA SWAMY TEMPLE,<br />  Kottanadu, Old Mavelikkara,<br />  Mavelikara,<br />  Kerala 690101</p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-full bg-primary/10 text-brand-gold">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs uppercase tracking-widest text-[#7c8560] mb-1 font-sans font-semibold">Phone</p>
                            <p className="text-lg text-gray-800 dark:text-gray-200">+91 08848744276</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-full bg-primary/10 text-brand-gold">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs uppercase tracking-widest text-[#7c8560] mb-1 font-sans font-semibold">Email</p>
                            <p className="text-lg text-gray-800 dark:text-gray-200">bhavaniboutique167@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Socials */}
            <div className="pt-8 border-t border-[#eff0ea] dark:border-[#2a2c22]">
                <p className="text-sm font-medium mb-4 uppercase tracking-widest text-[#7c8560] font-sans font-semibold">Follow our journey</p>
                <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#eff0ea] dark:border-[#2a2c22] hover:border-brand-gold text-brand-gold transition-colors group">
                        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#eff0ea] dark:border-[#2a2c22] hover:border-brand-gold text-brand-gold transition-colors group">
                        <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#eff0ea] dark:border-[#2a2c22] hover:border-brand-gold text-brand-gold transition-colors group">
                        <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                </div>
            </div>

            <div className="bg-primary/10 p-6 rounded-xl">
                <h3 className="font-bold mb-2 text-primary">Opening Hours</h3>
                <div className="grid grid-cols-2 text-sm gap-y-1 font-sans">
                    <span className="text-[#7c8560]">Mon - Fri:</span>
                    <span className="text-gray-700">09:00 AM - 07:00 PM</span>
                    <span className="text-[#7c8560]">Saturday:</span>
                    <span className="text-gray-700">10:00 AM - 06:00 PM</span>
                    <span className="text-[#7c8560]">Sunday:</span>
                    <span className="text-gray-700">Closed</span>
                </div>
            </div>
        </section>
    );
};

export default ContactInfo;
