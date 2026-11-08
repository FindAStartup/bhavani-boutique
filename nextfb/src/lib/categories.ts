import { cropPresets, type SavedImageCrop } from '@/lib/image-crop';

export interface Category {
    id: string;
    name: string;
    slug: string;
    display_order: number;
    legacy_image_url: string | null;
    image_path: string | null;
    image_crop: SavedImageCrop | null;
}

export function categorySlug(value: string) {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function categoryImageUrl(path: string) {
    const key = path.split('/').map(encodeURIComponent).join('/');
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${cropPresets.category.bucket}/${key}`;
}

export function categoryImage(category: Category) {
    return category.image_path ? categoryImageUrl(category.image_path) : category.legacy_image_url;
}
