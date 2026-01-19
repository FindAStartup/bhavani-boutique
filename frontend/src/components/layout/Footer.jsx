import React from 'react';
import { Link } from 'react-router-dom';
import bbLogo from '../../assets/BB_Black.png';

const Footer = () => {
    return (
        <footer className="bg-stone-50 pt-16 pb-8 border-t border-stone-200">
            <div className="w-full px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-1 mb-6">
                            <img src={bbLogo} alt="Bhavani Boutique" className="h-10 w-auto" />
                            <span className="text-xl font-serif font-medium tracking-widest text-[#5d1818] uppercase">Bhavani Boutique</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Curating timeless elegance for the modern woman. Every piece in our boutique is chosen with love and a focus on premium quality fabrics.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Shopping</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link className="hover:text-primary transition-colors" to="/category/Corset">Corset</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/category/Saree">Saree</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/category/Kurties">Kurties</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/category/Set-mund">Set Mund</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/category/Bottoms">Bottoms</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Customer Care</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link className="hover:text-primary transition-colors" to="/contact">Contact Us</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/about">About Us</Link></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Size Guide</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">FAQs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Connect</h4>
                        <ul className="space-y-4 text-sm text-slate-500 mb-6">
                            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                        </ul>
                        <div className="flex gap-4 mb-6">
                            <a className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                                <span className="material-icons-outlined text-lg">public</span>
                            </a>
                            <a className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                                <span className="material-icons-outlined text-lg">share</span>
                            </a>
                            <a className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                                <span className="material-icons-outlined text-lg">camera_alt</span>
                            </a>
                        </div>
                        <p className="text-xs text-slate-400">© 2026 Bhavani Boutique Home. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
