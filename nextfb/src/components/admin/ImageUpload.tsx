'use client';

import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createClient } from '@/supabase/client';
import Image from 'next/image';

interface ImageUploadProps {
    images: { url: string; isUploading?: boolean; file?: File }[];
    setImages: React.Dispatch<React.SetStateAction<{ url: string; isUploading?: boolean; file?: File }[]>>;
    minImages?: number;
    maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, setImages, minImages = 4, maxImages = 5 }) => {
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (images.length + files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        setUploading(true);

        for (const file of files) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max size is 5MB.`);
                continue;
            }

            const tempId = Math.random().toString(36).substring(7);

            // Add temporary placeholder
            setImages(prev => [...prev, {
                url: URL.createObjectURL(file), // Local preview
                file,
                isUploading: true
            }]);

            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('product-images') // Assuming this bucket exists
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                // Update with actual public URL
                setImages(prev => prev.map(img =>
                    img.file === file
                        ? { url: publicUrl, isUploading: false }
                        : img
                ));
            } catch (error: any) {
                console.error('Upload error:', error);
                alert(`Failed to upload ${file.name}: ${error.message}`);
                // Remove failed upload
                setImages(prev => prev.filter(img => img.file !== file));
            }
        }

        setUploading(false);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-semibold text-stone-800">Product Images</h3>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    {images.length}/{maxImages} images
                </span>
            </div>

            {/* Main upload area */}
            {images.length < maxImages && (
                <label className="relative group aspect-video md:aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-[#5d6b2e] flex flex-col items-center justify-center cursor-pointer bg-stone-50 hover:bg-[#5d6b2e]/5 transition-all">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />
                    <div className="w-12 h-12 rounded-full bg-white mb-3 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-[#5d6b2e]" />
                    </div>
                    <span className="text-sm font-bold text-stone-700">
                        {uploading ? 'Uploading...' : 'Click to upload'}
                    </span>
                    <span className="text-xs text-stone-400 mt-1">
                        PNG, JPG up to 5MB
                    </span>
                </label>
            )}

            {/* Image previews */}
            <div className="grid grid-cols-2 gap-3">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden group shadow-sm"
                    >
                        <Image
                            src={image.url}
                            alt={`Product ${index + 1}`}
                            fill
                            className="object-cover"
                        />

                        {image.isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="animate-spin text-white w-8 h-8" />
                            </div>
                        )}

                        {!image.isUploading && (
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-md"
                            >
                                <X size={14} />
                            </button>
                        )}

                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                            {index === 0 ? 'Main' : `#${index + 1}`}
                        </div>
                    </div>
                ))}
            </div>

            {images.length < minImages && (
                <p className="text-xs text-amber-600 flex items-center gap-1 font-medium bg-amber-50 p-2 rounded">
                    <span>⚠</span>
                    Minimum {minImages} images required to publish
                </p>
            )}
        </div>
    );
};

export default ImageUpload;

