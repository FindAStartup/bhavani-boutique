import React from 'react';
import img1 from '../../assets/AboutUs3.png';
import img2 from '../../assets/AboutUs1.png';
import img3 from '../../assets/AboutUS2.png';
import img4 from '../../assets/Kerala_Backwaters.png';

const VisualMosaic = () => {
    return (
        <section className="max-w-[1200px] mx-auto px-6 pb-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
                <div
                    className="col-span-2 row-span-2 bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url("${img1}")` }}
                    aria-label="Editorial shot"
                ></div>
                <div
                    className="bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url("${img2}")` }}
                    aria-label="Detailed view"
                ></div>
                <div
                    className="bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url("${img3}")` }}
                    aria-label="Artisan hands"
                ></div>
                <div
                    className="col-span-2 bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url("${img4}")` }}
                    aria-label="Boutique interior"
                ></div>
            </div>
        </section>
    );
};

export default VisualMosaic;
