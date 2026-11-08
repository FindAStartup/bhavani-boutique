import { cache } from 'react';
import { createStaticClient } from '@/supabase/server';
import type { Category } from '@/lib/categories';

export const listCategories = cache(async (): Promise<Category[]> => {
    const supabase = await createStaticClient();
    const { data, error } = await supabase.from('categories')
        .select('*').order('display_order').order('slug');
    if (error) throw new Error('Could not load categories.', { cause: error });
    return data;
});
