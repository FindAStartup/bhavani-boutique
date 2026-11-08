'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { categorySlug } from '@/lib/categories';
import { maximumZoom, type SavedImageCrop } from '@/lib/image-crop';
import { requireAdmin } from '@/server/auth/requireAdmin';
import { createClient } from '@/supabase/server';

function refreshCategories() {
    revalidatePath('/', 'layout');
}

export async function saveCategory(input: {
    id?: string;
    name: string;
    image?: { path: string; crop: SavedImageCrop };
}) {
    await requireAdmin();
    const name = input.name.trim();
    if (!name || name.length > 80) return { error: 'Enter a category name of up to 80 characters.' };
    if (!input.id && !input.image) return { error: 'Choose and crop a category image.' };

    const fields: { name: string; image_path?: string; image_crop?: SavedImageCrop } = { name };
    if (input.image) {
        const { path, crop } = input.image;
        if (!/^cropped\/[a-f0-9-]{36}\.webp$/.test(path) ||
            !/^originals\/[a-f0-9-]{36}\.(jpg|png|webp)$/.test(crop.originalPath) ||
            ![crop.x, crop.y].every(value => Number.isFinite(value) && value >= 0 && value <= 1) ||
            !Number.isFinite(crop.zoom) || crop.zoom < 1 || crop.zoom > maximumZoom) {
            return { error: 'Apply the image crop before saving.' };
        }
        fields.image_path = path;
        fields.image_crop = crop;
    }

    const supabase = await createClient();
    let result;
    if (input.id) {
        result = await supabase.from('categories').update(fields).eq('id', input.id).select('id').maybeSingle();
    } else {
        const { data, error } = await supabase.from('categories').select('display_order')
            .order('display_order', { ascending: false }).limit(1).maybeSingle();
        if (error) return { error: 'Could not determine the category order.' };
        result = await supabase.from('categories').insert({
            ...fields,
            slug: categorySlug(name) || randomUUID(),
            display_order: (data?.display_order ?? 0) + 1,
        }).select('id').single();
    }
    if (result.error?.code === '23505') return { error: 'A category with that name or URL already exists.' };
    if (result.error || !result.data) return { error: 'Could not save the category.' };

    refreshCategories();
    return { success: true };
}

export async function deleteCategory(id: string) {
    await requireAdmin();
    const supabase = await createClient();
    const { count, error: countError } = await supabase.from('products')
        .select('id', { count: 'exact', head: true }).eq('category_id', id);
    if (countError) return { error: 'Could not check for assigned products.' };
    if (count) return { error: `Reassign the ${count} linked product(s) or draft(s) before deleting this category.` };

    const { data, error } = await supabase.from('categories').delete().eq('id', id).select('id').maybeSingle();
    if (error?.code === '23503') return { error: 'Reassign linked products and drafts before deleting this category.' };
    if (error || !data) return { error: 'Could not delete the category.' };

    refreshCategories();
    return { success: true };
}

