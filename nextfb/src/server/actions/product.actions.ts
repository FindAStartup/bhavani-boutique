'use server'

import { revalidatePath } from 'next/cache'
import * as productService from '../services/product.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProduct(formData: any) {
    try {
        const product = await productService.createProductService(formData);
        revalidatePath('/products')
        return { success: true, product };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Create product error:', error);
        return { error: error.message || 'Internal server error' };
    }
}

export async function searchProducts(query: string) {
    try {
        const products = await productService.getProductsService({ search: query, limit: 5 });
        return { products };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Search products error:', error);
        return { error: error.message };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProducts(filters: any = {}) {
    try {
        const products = await productService.getProductsService(filters);
        return { products };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Get products error:', error);
        return { error: error.message };
    }
}

export async function getProductById(id: string) {
    try {
        const product = await productService.getProductByIdService(id);
        return { product };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Get product error:', error);
        return { error: error.message };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProduct(id: string, formData: any) {
    try {
        const product = await productService.updateProductService(id, formData);
        revalidatePath(`/products/${id}`)
        revalidatePath('/products')
        return { success: true, product };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Update product error:', error);
        return { error: error.message || 'Internal server error' };
    }
}

export async function deleteProduct(id: string) {
    try {
        await productService.deleteProductService(id);
        revalidatePath('/products')
        return { success: true };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Delete product error:', error);
        return { error: error.message };
    }
}


