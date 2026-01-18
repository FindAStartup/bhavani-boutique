import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/home/Hero';
import DashboardCategories from '../components/home/DashboardCategories';
import BoutiqueFavorites from '../components/home/BoutiqueFavorites';
import Newsletter from '../components/home/Newsletter';

const Home = () => {
    return (
        <MainLayout>
            <div className="w-full px-6 lg:px-12 py-8">
                <Hero />
                <DashboardCategories />
                <BoutiqueFavorites />
                <Newsletter />
            </div>
        </MainLayout>
    );
};

export default Home;
