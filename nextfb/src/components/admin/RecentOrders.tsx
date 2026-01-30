import React from 'react';
import { MoreHorizontal, ChevronRight, User } from 'lucide-react';

const RecentOrders = () => {
    // TODO: Fetch real orders
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders: any[] = [];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold font-display">Recent Orders</h3>
                <button className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center">
                    View All <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
            <div className="overflow-x-auto">
                {orders.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No recent orders found.
                    </div>
                ) : (
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
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
                                                <User size={16} />
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
                )}
            </div>
        </div>
    );
};

export default RecentOrders;
