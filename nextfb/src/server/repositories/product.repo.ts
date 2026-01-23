import { createClient } from '@/supabase/server'

export async function insertProduct(productData: any) {
    const supabase = await createClient()
    return await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
}

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
    const supabase = await createClient()
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
    const supabase = await createClient()
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
