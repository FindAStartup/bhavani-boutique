'use client';

import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import { ArrowLeft, ArrowRight, Crop, Upload, X } from 'lucide-react';
import Image from 'next/image';
import ImageCropEditor from '@/components/admin/ImageCropEditor';
import { cropPresets, initialCrop, saveImageCrop, type EditableImage } from '@/lib/image-crop';
import { createClient } from '@/supabase/client';

interface ImageUploadProps {
    images: EditableImage[];
    setImages: Dispatch<SetStateAction<EditableImage[]>>;
    onUploadingChange: (uploading: boolean) => void;
    disabled?: boolean;
    minImages?: number;
    maxImages?: number;
}

export default function ImageUpload({ images, setImages, onUploadingChange, disabled, minImages = 4, maxImages = 5 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [editing, setEditing] = useState<number | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const config = cropPresets.product;
    const selected = editing === null ? undefined : images[editing];
    const source = selected?.crop
        ? createClient().storage.from(config.bucket).getPublicUrl(selected.crop.originalPath).data.publicUrl
        : selected?.url;

    async function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? []);
        event.target.value = '';
        if (!files.length) return;
        if (images.length + files.length > maxImages) {
            setErrors([`You can upload up to ${maxImages} photos.`]);
            return;
        }

        setUploading(true);
        onUploadingChange(true);
        setErrors([]);
        try {
            for (const file of files) {
                try {
                    if (file.size > config.maxBytes) throw new Error('Choose an image up to 5 MB.');
                    const image = await saveImageCrop('product', initialCrop, file);
                    setImages(current => [...current, image]);
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Upload failed.';
                    setErrors(current => [...current, `${file.name}: ${message}`]);
                }
            }
        } finally {
            setUploading(false);
            onUploadingChange(false);
        }
    }

    function moveImage(index: number, offset: number) {
        setImages(current => {
            const next = [...current];
            const target = index + offset;
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    }

    const controlsDisabled = disabled || uploading || editing !== null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-semibold text-stone-800">Product Images</h3>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{images.length}/{maxImages} images</span>
            </div>

            {images.length < maxImages && (
                <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 hover:border-[#5d6b2e]">
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileSelect}
                        className="sr-only" disabled={controlsDisabled} />
                    <Upload className="mb-2 h-6 w-6 text-[#5d6b2e]" />
                    <span className="text-sm font-bold text-stone-700">{uploading ? 'Uploading…' : 'Choose photos'}</span>
                    <span className="mt-1 text-xs text-stone-500">JPEG, PNG, or WebP up to 5 MB</span>
                </label>
            )}

            {errors.length > 0 && <ul role="alert" className="text-sm text-red-700">{errors.map(error => <li key={error}>{error}</li>)}</ul>}

            <div className="grid grid-cols-2 gap-3">
                {images.map((image, index) => (
                    <div key={index} className="min-w-0 space-y-2">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-stone-100">
                            <Image src={image.url} alt={`Product photo ${index + 1}`} fill sizes="180px" className="object-cover" />
                            <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                                {index === 0 ? 'Main' : `#${index + 1}`}
                            </span>
                            <button type="button" disabled={controlsDisabled} aria-label={`Remove photo ${index + 1}`}
                                onClick={() => setImages(current => current.filter((_, i) => i !== index))}
                                className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-600">
                                <X size={14} />
                            </button>
                        </div>
                        <button type="button" disabled={controlsDisabled} onClick={() => setEditing(index)}
                            className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-[#550000]/20 bg-[#550000]/5 px-2 py-2 text-sm font-semibold text-[#550000] transition-colors enabled:hover:border-[#550000]/40 enabled:hover:bg-[#550000]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#550000] disabled:cursor-not-allowed disabled:opacity-50">
                            <Crop size={16} aria-hidden="true" className="shrink-0" />
                            Adjust crop
                        </button>
                        <div className="flex justify-center gap-3">
                            <button type="button" disabled={controlsDisabled || index === 0} aria-label={`Move photo ${index + 1} earlier`}
                                className="p-1 disabled:opacity-30" onClick={() => moveImage(index, -1)}><ArrowLeft size={16} /></button>
                            <button type="button" disabled={controlsDisabled || index === images.length - 1} aria-label={`Move photo ${index + 1} later`}
                                className="p-1 disabled:opacity-30" onClick={() => moveImage(index, 1)}><ArrowRight size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {images.length < minImages && (
                <p className="rounded bg-amber-50 p-2 text-xs font-medium text-amber-700">Minimum {minImages} images required to publish</p>
            )}

            {images.length > 0 && (
                <p className="text-xs text-slate-600">After applying a crop, publish the product to show it on the storefront or save it as a draft.</p>
            )}

            {selected && source && (
                <ImageCropEditor source={source} preset="product" initialPosition={selected.crop}
                    onClose={() => setEditing(null)}
                    onApply={async position => {
                        let input: File | string;
                        if (selected.crop) {
                            input = selected.crop.originalPath;
                        } else {
                            const response = await fetch(source);
                            if (!response.ok) throw new Error('Could not load the existing product photo.');
                            const blob = await response.blob();
                            input = new File([blob], 'product-photo', { type: blob.type });
                        }
                        const result = await saveImageCrop('product', position, input);
                        setImages(current => current.map((image, index) => index === editing ? result : image));
                    }}
                />
            )}
        </div>
    );
}
