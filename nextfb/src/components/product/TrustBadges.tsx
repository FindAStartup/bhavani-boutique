import React from 'react';
import { Truck, Leaf, Shield } from 'lucide-react';

const TrustBadges = () => {
    const badges = [
        {
            icon: Truck,
            label: 'Free Delivery',
            description: 'On orders above ₹2000'
        },
        {
            icon: Leaf,
            label: 'Eco-Friendly',
            description: 'Sustainable materials'
        },
        {
            icon: Shield,
            label: 'Secure Pay',
            description: '100% secure payments'
        }
    ];

    return (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-slate-200">
            {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                    <div
                        key={index}
                        className="text-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                        <Icon
                            className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2 text-primary"
                            aria-hidden="true"
                        />
                        <p className="text-xs font-medium text-slate-700">{badge.label}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default TrustBadges;
