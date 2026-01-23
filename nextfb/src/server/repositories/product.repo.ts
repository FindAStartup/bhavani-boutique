// 👇 1. Import createStaticClient here
import { createClient, createStaticClient } from '@/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertProduct(productData: any) {
    // Write operations still use the normal client (auth required)
    const supabase = await createClient()
    return await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertProductStock(stockEntries: any[]) {
    const supabase = await createClient()
    return await supabase
        .from('product_stock')
        .insert(stockEntries);
}

export async function deleteProductById(id: string) {
    const supabase = await createClient()
    return await supabase
        .from('products')
        .delete()
        .eq('id', id);
}

export async function findProducts(filters: { category?: string; is_draft?: boolean; search?: string; limit?: number } = {}) {
    // 👇 2. Use createStaticClient here so the Homepage can be Static
    const supabase = await createStaticClient()

    const { category, is_draft, search, limit } = filters;

    let query = supabase
        .from('products')
        .select(`
        *,
        product_stock (
          size,
          stock_quantity
        )
      `)
        .order('created_at', { ascending: false });

    if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
        query = query.eq('category', category);
    }

    if (is_draft !== undefined) {
        query = query.eq('is_draft', is_draft);
    } else {
        query = query.eq('is_draft', false);
    }

    if (limit) {
        query = query.limit(limit);
    }

    return await query;
}

export async function findProductById(id: string) {
    // 👇 3. Use createStaticClient here too
    const supabase = await createStaticClient()

    return await supabase
        .from('products')
        .select(`
        *,
        product_stock (
          size,
          stock_quantity
        )
      `)
        .eq('id', id)
        .single();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProductById(id: string, productData: any) {
    const supabase = await createClient()
    return await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
}

export async function deleteProductStockByProductId(productId: string) {
    const supabase = await createClient()
    return await supabase.from('product_stock').delete().eq('product_id', productId);
}