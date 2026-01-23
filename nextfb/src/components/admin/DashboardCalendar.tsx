'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DashboardCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [today, setToday] = useState(new Date());

    // Update today on mount to avoid hydration mismatch
    useEffect(() => {
        setToday(new Date());
    }, []);

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);

        // Empty slots for days before the 1st
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        // Days of the month
        for (let i = 1; i <= totalDays; i++) {
            const isToday =
                i === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

            days.push(
                <div
                    key={i}
                    className={`
                        h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-default
                        ${isToday
                            ? 'bg-[#5d6b2e] text-white shadow-md shadow-[#5d6b2e]/30'
                            : 'text-slate-700 hover:bg-slate-100'
                        }
                    `}
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-serif font-semibold text-stone-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-1.5 hover:bg-stone-100 rounded-full text-stone-500 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1.5 hover:bg-stone-100 rounded-full text-stone-500 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-bold text-stone-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 place-items-center">
                {renderDays()}
            </div>

            <div className="mt-6 pt-6 border-t border-stone-100">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Current Date</span>
                    <span className="font-semibold text-[#5d6b2e]">
                        {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DashboardCalendar;
