import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Product SEO Component
 * Handles all SEO meta tags and structured data
 */
const ProductSEO = ({ product, averageRating = 4.8, reviewCount = 42, selectedSize, getStockForSize }) => {
    if (!product) return null;

    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images,
        "description": product.description,
        "brand": {
            "@type": "Brand",
            "name": "Bhavana Boutique"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "INR",
            "price": product.price,
            "availability": getStockForSize(selectedSize) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": averageRating,
            "reviewCount": reviewCount
        }
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{product.name} - Bhavana Boutique | Premium {product.category}</title>
            <meta
                name="description"
                content={product.description || `Shop ${product.name} at Bhavana Boutique. Premium quality ${product.category} with fast delivery.`}
            />
            <meta
                name="keywords"
                content={`${product.name}, ${product.category}, boutique, fashion, Indian wear, ${product.product_stock?.map(s => s.size).join(', ')}`}
            />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="product" />
            <meta property="og:title" content={`${product.name} - Bhavana Boutique`} />
            <meta property="og:description" content={product.description} />
            <meta property="og:image" content={product.images?.[0]} />
            <meta property="og:url" content={window.location.href} />
            <meta property="product:price:amount" content={product.price} />
            <meta property="product:price:currency" content="INR" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${product.name} - Bhavana Boutique`} />
            <meta name="twitter:description" content={product.description} />
            <meta name="twitter:image" content={product.images?.[0]} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default ProductSEO;
