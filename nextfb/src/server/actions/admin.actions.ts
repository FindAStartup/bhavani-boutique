'use server';

import { createClient } from '@/supabase/server';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertProduct(productData: any) {
    const supabase = await createClient();
    const { id, stock, ...productFields } = productData;

    try {
        let productId = id;

        if (id) {
            // Update existing product
            const { error: productError } = await supabase
                .from('products')
                .update(productFields)
                .eq('id', id);

            if (productError) throw productError;
        } else {
            // Insert new product
            const { data, error: productError } = await supabase
                .from('products')
                .insert([productFields])
                .select()
                .single();

            if (productError) throw productError;
            productId = data.id;
        }

        // Handle Stock
        if (stock && Array.isArray(stock)) {
            // First, delete existing stock for this product
            const { error: deleteStockError } = await supabase
                .from('product_stock')
                .delete()
                .eq('product_id', productId);

            if (deleteStockError) throw deleteStockError;

            // Insert new stock
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const stockToInsert = stock.map((s: any) => ({
                product_id: productId,
                size: s.size,
                stock_quantity: s.quantity
            }));

            const { error: stockError } = await supabase
                .from('product_stock')
                .insert(stockToInsert);

            if (stockError) throw stockError;
        }

        revalidatePath('/admin');
        revalidatePath('/admin/drafts');
        revalidatePath(`/product/${productId}`);
        revalidatePath('/');

        return { success: true, productId };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error upserting product:', error);
        return { error: error.message };
    }
}

export async function getDrafts() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            product_stock (*)
        `)
        .eq('is_draft', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching drafts:', error);
        return { error: error.message };
    }

    return { products };
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient();

    try {
        // Table relationships should handle stock deletion if cascade is set, 
        // but let's be explicit if not sure.
        const { error: stockError } = await supabase
            .from('product_stock')
            .delete()
            .eq('product_id', productId);

        if (stockError) throw stockError;

        const { error: productError } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (productError) throw productError;

        revalidatePath('/admin');
        revalidatePath('/admin/drafts');
        revalidatePath('/');

        return { success: true };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return { error: error.message };
    }
}

export async function publishProduct(productId: string) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('products')
            .update({ is_draft: false })
            .eq('id', productId);

        if (error) throw error;

        revalidatePath('/admin');
        revalidatePath('/admin/drafts');
        revalidatePath(`/product/${productId}`);
        revalidatePath('/');

        return { success: true };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error publishing product:', error);
        return { error: error.message };
    }
}

