import React from 'react';
import { IndianRupee, ShoppingCart, Archive, TrendingUp, AlertTriangle } from 'lucide-react';

const StatsCards = () => {
    // TODO: Fetch real stats
    const cards = [
        {
            title: 'Total Sales',
            value: '₹ 0',
            icon: <IndianRupee size={40} className="text-[#FFD700]" />,
            color: 'gold',
            trendIcon: <TrendingUp size={16} className="mr-1" />,
            trendColor: 'text-emerald-500',
        },
        {
            title: 'Total Orders',
            value: '0',
            icon: <ShoppingCart size={40} className="text-[#550000]" />,
            color: 'primary',
            trendIcon: <TrendingUp size={16} className="mr-1" />,
            trendColor: 'text-emerald-500',
        },
        {
            title: 'Stock Alerts',
            value: '0 Items',
            icon: <Archive size={40} className="text-red-700" />,
            color: 'maroon',
            trendIcon: <AlertTriangle size={16} className="mr-1" />,
            trendColor: 'text-maroon',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{card.title}</p>
                            <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
                        </div>
                        <div className={`p-3 bg-slate-50 rounded-xl`}>
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
