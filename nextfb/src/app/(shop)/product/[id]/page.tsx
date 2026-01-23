import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductById } from '@/server/actions/product.actions';
import ProductDetailsClient from '@/components/product/ProductDetailsClient';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const { product } = await getProductById(id);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.name} | Bhavani Boutique`,
        description: product.description ? product.description.substring(0, 160) : 'Shop this exclusive item at Bhavani Boutique.',
        openGraph: {
            images: product.images && product.images.length > 0 ? [product.images[0]] : [],
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const { product, error } = await getProductById(id);

    if (error || !product) {
        // You might want to show a custom 404 component or simple error
        // notFound() triggers the closest not-found.tsx
        return notFound();
    }

    return <ProductDetailsClient product={product} />;
}
