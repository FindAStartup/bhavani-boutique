import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Globe } from 'lucide-react';
import FindStartupModal from '../home/FindStartupModal';

const Footer = () => {
    return (
        <footer className="bg-stone-50 pt-8 pb-4 border-t border-stone-200">
            <div className="w-full px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-4">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-1 mb-6">
                            <Image
                                src="/BB_Black.png"
                                alt="Bhavani Boutique Logo"
                                width={48}
                                height={48}
                                className="h-8 sm:h-12 w-auto object-contain"
                                priority
                            />
                            <span className="text-xl font-serif font-medium tracking-widest text-[#5d1818] uppercase">Bhavani Boutique</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Curating timeless elegance for the modern woman. Every piece in our boutique is chosen with love and a focus on premium quality fabrics.
                        </p>
                    </div>
                    <div className="pt-3">
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Shopping</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link className="hover:text-primary transition-colors" href="/category/Cordset">Cordset</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/category/Saree">Saree</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/category/Kurties">Kurties</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/category/Set-mund">Set Mund</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/category/Bottoms">Bottoms</Link></li>
                        </ul>
                    </div>
                    <div className="pt-3">
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Customer Care</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link className="hover:text-primary transition-colors" href="/contact">Contact Us</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/about">About Us</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/faqs">FAQs</Link></li>
                        </ul>
                    </div>
                    <div className="pt-3">
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Connect</h4>
                        <ul className="space-y-4 text-sm text-slate-500 mb-6">
                            <li><Link className="hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/terms">Terms of Service</Link></li>
                        </ul>
                        <div className="flex gap-4 mb-6">
                            <a className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="https://www.bhavaniboutiques.in" target="_blank" rel="noopener noreferrer">
                                <Globe className="w-5 h-5" />
                            </a>
                            <a className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="https://www.facebook.com/share/16mvyfJibH/" target="_blank" rel="noopener noreferrer">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="https://www.instagram.com/bhavaniboutique_?igsh=c3VteGNiZ2ZzZGEx" target="_blank" rel="noopener noreferrer">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">© 2026 Bhavani Boutique Home. All rights reserved.</p>

                        {/* Created By */}
                        <FindStartupModal />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
