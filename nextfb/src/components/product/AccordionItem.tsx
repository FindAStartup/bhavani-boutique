'use client';

import React from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface AccordionItemProps {
    title: string;
    content: string;
    section: string;
    isExpanded: boolean;
    onToggle: (section: string) => void;
    icon?: LucideIcon;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, section, isExpanded, onToggle, icon: Icon }) => {
    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={() => onToggle(section)}
                className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors group"
                aria-expanded={isExpanded}
                aria-controls={`accordion-${section}`}
            >
                <span className="font-semibold text-slate-800 flex items-center gap-2">
                    {Icon && <Icon size={18} className="text-primary" />}
                    {title}
                </span>
                <ChevronDown
                    size={20}
                    className={`text-slate-400 group-hover:text-primary transition-all duration-300 ${isExpanded ? 'rotate-180' : ''
                        }`}
                />
            </button>
            <div
                id={`accordion-${section}`}
                className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 pb-4' : 'max-h-0'
                    }`}
            >
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {content}
                </p>
            </div>
        </div>
    );
};

export default AccordionItem;
