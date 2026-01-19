import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-white transition-colors duration-300 min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
