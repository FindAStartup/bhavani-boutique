import React from 'react';

const VisualMosaic = () => {
    return (
        <section className="max-w-[1200px] mx-auto px-6 pb-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
                <div
                    className="col-span-2 row-span-2 bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url("/AboutUs3.png")` }}
                    aria-label="Editorial shot"
                ></div>
                <div
                    className="bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url("/AboutUs1.png")` }}
                    aria-label="Detailed view"
                ></div>
                <div
                    className="bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url("/AboutUS2.png")` }}
                    aria-label="Artisan hands"
                ></div>
                <div
                    className="col-span-2 bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url("/Kerala_Backwaters.png")` }}
                    aria-label="Boutique interior"
                ></div>
            </div>
        </section>
    );
};

export default VisualMosaic;
