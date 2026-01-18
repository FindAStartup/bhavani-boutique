import React from 'react';
import { MoreHorizontal, ChevronRight } from 'lucide-react';

const RecentOrders = () => {
    const orders = [
        {
            id: '#ORD-2841',
            customer: 'Priya Singh',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3T20Bv7pUsnSa71QxkDgzZw9_E9gv_V5f9qYz_PaHildoii3wpu6DVj-TxCiHnxxA4ZcqPQPjtapH_d2uY9DYxvrMfXe9DRv5Tux8Q35-eWAgMhiaXmbUmCwrArB92eso7glAuzJ7pBw5K2uLbIugSbLZ_6iMOfWYbW-qcIhqzjKYsCH3Ejy0xy043f6Sa2AYPBJYZiUbZcKY3LH27KdUZXbW2IYHTQgKkT4al1d-4Wgxw78FrNK-u6IBRpHraav7Pd48RddgtFGR',
            date: 'Oct 18, 2023',
            amount: '₹4,200',
            status: 'Shipped',
            statusColor: 'bg-emerald-100 text-emerald-700',
        },
        {
            id: '#ORD-2840',
            customer: 'Anjali Sharma',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZH4fWenmEMKDPyI-YrnDtRMTSAAuZjkUsCetutXnXTVVgxLxFoCKLTm9jPpQF8xBrrv6tgFa3W6OKPUV24W0ee-BFoX7N-kG0fDr1FoomMO-6tgsnTrX7R1nZ55dUPwcfOM1ZwhlS9yKmA6OhEelaCHbSOBv71E4i996ngG3RORw1pa0QTMLZ7hVn7frPhJZRUGM0JkiOCzRAMPhQEzbx0HX7FamumXtnOLU8u_Gu-bRXHwd5Ct4sElN7VHAhzFZdyohn9e2Clp-',
            date: 'Oct 18, 2023',
            amount: '₹12,500',
            status: 'Processing',
            statusColor: 'bg-gold/10 text-yellow-700',
        },
        {
            id: '#ORD-2839',
            customer: 'Meera Kapoor',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcnDd_SgkYkiP-hubNTBmVTqNH5Hdim6nsmtlSNsNxqrCDX_n5EyzpomtmUVw9X67RmBUyw4MEYWmTMEdTA0DDim5Ggn2OLNFZ_NN7hnjfWo8uU6wWij0ZtJSCaRDROxJ-_myzMyposH5QUxboAf2HUe7gyf_H9tTD37OCDRehcAerObtpY7BVOGUt5sYzjumXQuhxTrmbyj5qoDwTu2pIfIggmjiLjwiHQKNUYs5-JgKvSFPOIKDORcTlnWlZWsvzo6DPintbsfmD',
            date: 'Oct 17, 2023',
            amount: '₹7,800',
            status: 'Canceled',
            statusColor: 'bg-maroon/10 text-maroon',
        },
        {
            id: '#ORD-2838',
            customer: 'Radha Das',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD23GedtLAhnuNzUajLjmfprTmnZl_SFATrr-IaZFq7kBNgy5_JpUyXfpuzkRMvGM61IcPxuKTdW1ptXZIJuQi6FFWBlDdt6ZxdZCVxoiDFH7F8yBxC2v3_KpGZ0mqPSup_Q8TGXPkuh_1GRrAc2mB7L7BMawv4LNG12aHgX-3kdzmFoP7bLfQvidMtZf-4R4IorAmUT_sQbrGRnQf1AvXyJFZf3ZCcDY0NwQQQpCrWHTuYZuPI36Dwiq2QOw6-bnMFQmygZsvgbWgX',
            date: 'Oct 17, 2023',
            amount: '₹5,400',
            status: 'Delivered',
            statusColor: 'bg-emerald-100 text-emerald-700',
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold font-display">Recent Orders</h3>
                <button className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center">
                    View All <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium">{order.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0">
                                            <img alt={order.customer} className="rounded-full" src={order.avatar} />
                                        </div>
                                        <span>{order.customer}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{order.date}</td>
                                <td className="px-6 py-4 font-semibold">{order.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="p-1 hover:text-primary">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
