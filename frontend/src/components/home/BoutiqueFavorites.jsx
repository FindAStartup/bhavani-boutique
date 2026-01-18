import React from 'react';

const ProductCard = ({ image, title, price, rating, originalPrice, tag, tagColor }) => (
    <div className="group flex flex-col h-full">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-stone-100">
            <img
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={image}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <span className="material-icons-outlined">favorite_border</span>
                </button>
                <button className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <span className="material-icons-outlined">visibility</span>
                </button>
            </div>
            {tag && (
                <div className={`absolute top-4 ${tag === 'Sale' ? 'left-4' : 'right-4'} ${tagColor} text-slate-900 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider`}>
                    {tag}
                </div>
            )}
        </div>
        <div className="flex flex-col flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
                <h3 className="font-serif text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-tight">{title}</h3>
                <div className="flex items-center gap-1 text-brand-gold shrink-0">
                    <span className="material-icons-outlined text-sm">star</span>
                    <span className="text-xs font-semibold text-slate-500">{rating}</span>
                </div>
            </div>

            <div className="mt-auto">
                <p className="text-brand-gold font-bold text-lg mb-4 pt-2">
                    {price}
                    {originalPrice && <span className="text-sm font-normal text-slate-400 line-through ml-2">{originalPrice}</span>}
                </p>
                <button className="w-full py-3 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#5d6b2e] transition-all transform active:scale-95 shadow-sm">
                    <span className="material-icons-outlined text-lg">add_shopping_cart</span>
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
);

const BoutiqueFavorites = () => {
    const products = [
        {
            title: "Olive Silk Wrap Dress",
            price: "$249.00",
            rating: "4.9",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbj-R4GVi2Ix5-byCkFHeV4gH0LIWL9WlZVuN2q4fgDc_daF4IM9Ks_23z5QGFF8onc8nxLie6rTln-CNSxLPAn_DhTruYpQZ2b3t-BQfhXDvXqFRpesUa_a8PfEpcxzKQb8i_L6y5H6B8j9bFxML7lIBFKMyqF7tkaImObfsPmzluEPB2XnNaApxg-mID_5SOdlI_zZqvYCs6QkpF-pcYwVN2zR99-_plyR_xW2j1v1P6JkHXKk_ircAGcruzFWMvgLmMyd4mPWIb",
            tag: "Top Rated",
            tagColor: "bg-brand-gold"
        },
        {
            title: "Midnight Velvet Gown",
            price: "$310.00",
            rating: "4.8",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn2LwJwUA6IltadXBA3cOpxQL-E78tatSmhgU8XolUfx0NF5VTfPOecpuQzMFUsTq4MfzbKcFTbJlE5MqqGcBn-dCheDEOpQVLD8MLDZ5YNq0nDjFHPupir6gE9Q5_hc0sPbwnySfs2I44oL0s8YG_WZNLfu0Uf8XJZBwocTMrzKL4ekE6efKM1NkOkbX3mR32ArRJXU_7UIjCRbLeHvp_uHHcHOzRp1zmKTjzeSGrPDC_0GUvITKLstd9bEn0zM8M5WKIvjkPQ0i6",
        },
        {
            title: "Floral Tunic",
            price: "$185.00",
            originalPrice: "$225.00",
            rating: "4.7",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5enm3e40HMbFdXqFZsTtO8B3ogWTuiadBwW4EKN36ui0YKrwAudiqC53kXy0dW_iM4Q55BO0UoKAy3r6ui_j9oDbdmXmu-KVcBGkQnCAQB8cay-sgZNJ--GbpcUlUpJzdtv90SoIVJDq94Mcxf6HQMMxa9ECd9azCu9faNjgqnRhTTixVEeD_HC4XGYh5Q-JOowEw02acpAJeREMdoIM6ASExeT9Y7KCICQIWZEmG7TJROPDJF2tcp5RypdlSE8MeJFjBmdSuA8ot",
            tag: "Sale",
            tagColor: "bg-brand-maroon text-white"
        },
        {
            title: "Crimson Satin Slip",
            price: "$195.00",
            rating: "5.0",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCujVkaU5VBNIfWP7W-FJTKV5pJuXC6XlC0qSwAPw-wuN0BEiMGCJl96XccnTEeWN9UZg1JO-CTGdBgZg_48kvH6uI2Cj_nNgaQ4Vv_O-s5H7u0g9z1pzDqimmFHalMjz3jL7BFZLLz782_pw-IQe4kanfG9B4M7gO5czIW60ebaQqCmWW15j3RD0rPpheEVo1uhbjKu_bbQ-z9BllbFQKy99AfYkYu-8X6KAVXzoGJSkb7VFBTMpgw_Gao1otFcUvrstIcCT2vrt-S",
        }
    ];

    return (
        <div className="mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Latest Arrivals</h2>
                    <div className="h-1 w-20 bg-brand-maroon rounded-full"></div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-12">
                {products.map((product, index) => (
                    <ProductCard key={index} {...product} />
                ))}
            </div>
        </div>
    );
};

export default BoutiqueFavorites;
