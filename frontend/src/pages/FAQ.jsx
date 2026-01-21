import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border border-stone-200 rounded-lg overflow-hidden mb-4 bg-white transition-all duration-300 hover:shadow-sm">
            <button
                className={`w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none transition-colors ${isOpen ? 'bg-primary/5' : 'bg-white hover:bg-stone-50'
                    }`}
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <h3 className={`font-semibold text-lg ${isOpen ? 'text-primary' : 'text-slate-800'}`}>
                    {question}
                </h3>
                <span className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                </span>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 py-4 text-slate-600 bg-white border-t border-stone-100 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const FAQSection = ({ title, items }) => (
    <div className="mb-10">
        <h2 className="text-2xl font-serif font-bold text-[#550000] mb-6 flex items-center gap-2">
            {title}
        </h2>
        <div>
            {items.map((item, index) => (
                <FAQItem
                    key={index}
                    {...item}
                />
            ))}
        </div>
    </div>
);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState({ section: 0, index: 0 });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const toggleItem = (sectionIdx, itemIdx) => {
        setOpenIndex(
            openIndex.section === sectionIdx && openIndex.index === itemIdx
                ? { section: -1, index: -1 } // Close if already open
                : { section: sectionIdx, index: itemIdx }
        );
    };

    const faqData = [
        {
            title: "Shopping & Orders",
            items: [
                {
                    question: "How do I place an order?",
                    answer: "Browse our collections, select your size and quantity, and click 'Add to Cart'. When you're ready, proceed to checkout and follow the instructions to complete your purchase."
                },
                {
                    question: "Can I cancel or modify my order?",
                    answer: "We process orders quickly. If you need to make changes, please contact us within 2 hours of placing your order at bhavaniboutique167@gmail.com."
                }
            ]
        },
        {
            title: "Payments",
            items: [
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit/debit cards, UPI, and Net Banking. All transactions are secure and encrypted."
                },
                {
                    question: "Is Cash on Delivery (COD) available?",
                    answer: "Currently, we only accept prepaid orders to ensure the fastest delivery experience."
                }
            ]
        },
        {
            title: "Shipping & Delivery",
            items: [
                {
                    question: "Do you ship internationally?",
                    answer: "Yes, we ship globally! International shipping rates and delivery times vary by location and are calculated at checkout."
                },
                {
                    question: "How long will it take to get my order?",
                    answer: "Domestic orders typically arrive within 5-7 business days. International orders can take 10-15 business days."
                }
            ]
        },
        {
            title: "Returns & Refunds",
            items: [
                {
                    question: "What is your return policy?",
                    answer: "We accept returns for defective or incorrect items within 7 days of delivery. The item must be unused, unwashed, and in its original packaging."
                },
                {
                    question: "How do I initiate a return?",
                    answer: "Please email us at bhavaniboutique167@gmail.com with your order number and photos of the issue. We'll guide you through the process."
                }
            ]
        },
        {
            title: "Products & Care",
            items: [
                {
                    question: "Do you offer customization?",
                    answer: "Yes! For select items (like Cordset, Saree), we offer basic customization. Please contact us before placing your order to discuss your requirements."
                },
                {
                    question: "How do I care for my garments?",
                    answer: "Most of our ethnic wear is delicate. We recommend dry cleaning only for silk, embroidered, and embellished items. Cotton items can be gently hand-washed."
                }
            ]
        }
    ];

    return (
        <div className="font-sans text-slate-800">
            <Header />

            <main className="pt-24 pb-16 min-h-screen bg-stone-50">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="inline-block p-3 rounded-full bg-primary/10 text-primary mb-4">
                            <HelpCircle size={32} />
                        </span>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#550000] mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                            Everything you need to know about shopping with Bhavana Boutique. Can't find the answer you're looking for? Please contact our support team.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-10">
                        {faqData.map((section, sIdx) => (
                            <FAQSection
                                key={sIdx}
                                title={section.title}
                                items={section.items.map((item, iIdx) => ({
                                    ...item,
                                    isOpen: openIndex.section === sIdx && openIndex.index === iIdx,
                                    onClick: () => toggleItem(sIdx, iIdx)
                                }))}
                            />
                        ))}
                    </div>

                    <div className="mt-12 text-center bg-white rounded-xl p-8 border border-stone-100 shadow-sm max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Still have questions?</h3>
                        <p className="text-slate-600 mb-6">We are here to help you via email or phone.</p>
                        <a
                            href="mailto:bhavaniboutique167@gmail.com"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-[#5d6b2f] transition-colors md:text-lg"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FAQ;
