import React from 'react';
import { MapPin, Phone, Mail, Globe, Facebook, Instagram } from 'lucide-react';

const ContactInfo = () => {
    return (
        <section className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                <h2 className="text-3xl font-serif font-bold text-[#161811]">Boutique Information</h2>
                <div className="space-y-8">
                    {/* Address */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-full bg-primary/10 text-[#708238]">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs uppercase tracking-widest text-[#708238] mb-1 font-sans font-bold">Address</p>
                            <p className="text-lg text-[#161811] font-serif  leading-relaxed">ASWATHY ARCADE,<br /> WEST NADA SREEKRISHNA SWAMY TEMPLE,<br />  Kottanadu, Old Mavelikkara,<br />  Mavelikara,<br />  Kerala 690101</p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-full bg-primary/10 text-[#708238]">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs uppercase tracking-widest text-[#708238] mb-1 font-sans font-bold">Phone</p>
                            <a href="tel:9446304423" className="text-lg text-[#161811] hover:text-primary transition-colors ">9446304423</a>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-full bg-primary/10 text-[#708238]">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs uppercase tracking-widest text-[#708238] mb-1 font-sans font-bold">Email</p>
                            <p className="text-lg text-[#161811] font-serif">bhavaniboutique167@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Socials */}
            <div className="pt-8 border-t border-[#eff0ea]">
                <p className="text-sm font-medium mb-4 uppercase tracking-widest text-[#708238] font-sans font-bold">Follow our journey</p>
                <div className="flex gap-4">
                    <a href="https://www.facebook.com/share/16mvyfJibH/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#eff0ea] hover:border-[#708238] text-[#708238] transition-colors group">
                        <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                    <a href="https://www.instagram.com/bhavaniboutique_?igsh=c3VteGNiZ2ZzZGEx" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#eff0ea] hover:border-[#708238] text-[#708238] transition-colors group">
                        <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                    <a href="https://www.bhavaniboutiques.in" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#eff0ea] hover:border-[#708238] text-[#708238] transition-colors group">
                        <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                </div>
            </div>

            <div className="bg-[#f7f7f6] p-6 rounded-xl border border-transparent">
                <h3 className="font-serif font-bold mb-4 text-[#708238] text-lg">Opening Hours</h3>
                <div className="grid grid-cols-[100px_1fr] text-sm gap-y-2 font-sans">
                    <span className="text-[#708238] font-bold uppercase text-xs tracking-wider pt-0.5">Mon - Fri</span>
                    <span className="text-slate-600">09:00 AM - 07:00 PM</span>
                    <span className="text-[#708238] font-bold uppercase text-xs tracking-wider pt-0.5">Saturday</span>
                    <span className="text-slate-600">10:00 AM - 06:00 PM</span>
                    <span className="text-[#708238] font-bold uppercase text-xs tracking-wider pt-0.5">Sunday</span>
                    <span className="text-slate-600">Closed</span>
                </div>
            </div>
        </section>
    );
};

export default ContactInfo;
