export const cropPresets = {
    product: { width: 900, height: 1200, unitWidth: 3, unitHeight: 4, circular: false, bucket: 'product-images', maxBytes: 5 * 1024 * 1024 },
    category: { width: 512, height: 512, unitWidth: 1, unitHeight: 1, circular: true, bucket: 'Categories', maxBytes: 10 * 1024 * 1024 },
} as const;

export type CropPreset = keyof typeof cropPresets;
export type CropPosition = { x: number; y: number; zoom: number };
export type CropRectangle = { left: number; top: number; width: number; height: number };
export type SavedImageCrop = CropPosition & { originalPath: string; rectangle: CropRectangle };
export type EditableImage = { url: string; path?: string; crop?: SavedImageCrop };

export const initialCrop: CropPosition = { x: 0.5, y: 0.5, zoom: 1 };
export const maximumZoom = 4;

export function getCropRectangle(width: number, height: number, preset: CropPreset, position: CropPosition): CropRectangle {
    const { unitWidth, unitHeight } = cropPresets[preset];
    const units = Math.max(1, Math.floor(Math.min(width / unitWidth, height / unitHeight) / position.zoom));
    const cropWidth = units * unitWidth;
    const cropHeight = units * unitHeight;
    return {
        left: Math.round((width - cropWidth) * position.x),
        top: Math.round((height - cropHeight) * position.y),
        width: cropWidth,
        height: cropHeight,
    };
}

export async function saveImageCrop(preset: CropPreset, position: CropPosition, source: File | string): Promise<EditableImage> {
    const form = new FormData();
    form.set('preset', preset);
    form.set('position', JSON.stringify(position));
    form.set(typeof source === 'string' ? 'originalPath' : 'file', source);
    const response = await fetch('/api/admin/image-crop', { method: 'POST', body: form });
    if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Could not save the image crop.');
    }
    return response.json();
}

