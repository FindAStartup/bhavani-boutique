import React from 'react';


const AdminHeader = ({ title, subtitle }) => {
    return (
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-10 gap-4">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold font-display">{title}</h2>
                <p className="text-slate-500 mt-1">{subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
                {/* Removed Dark Mode Toggle per user request */}
                <div className="flex items-center bg-white rounded-lg border border-slate-200 px-5 py-3">
                    <input
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="text-lg font-medium text-slate-700 outline-none bg-transparent cursor-pointer"
                    />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
