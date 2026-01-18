import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ images, setImages, minImages = 4, maxImages = 5 }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);

        // Check if adding these files would exceed max
        if (images.length + files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        setUploading(true);

        for (const file of files) {
            try {
                // Create preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImages(prev => [...prev, {
                        url: e.target.result,
                        file,
                        isUploading: true
                    }]);
                };
                reader.readAsDataURL(file);

                // Upload to backend
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/upload-image`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    // Update with actual URL
                    setImages(prev => prev.map(img =>
                        img.file === file
                            ? { url: data.url, isUploading: false }
                            : img
                    ));
                } else {
                    throw new Error(data.error || 'Upload failed');
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert(`Failed to upload ${file.name}: ${error.message}`);
                // Remove failed upload
                setImages(prev => prev.filter(img => img.file !== file));
            }
        }

        setUploading(false);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const moveImage = (fromIndex, toIndex) => {
        setImages(prev => {
            const newImages = [...prev];
            const [removed] = newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, removed);
            return newImages;
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Product Images</h3>
                <span className="text-sm text-slate-500">
                    {images.length}/{maxImages} images
                </span>
            </div>

            {/* Main upload area */}
            {images.length < maxImages && (
                <label className="relative group aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-primary flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />
                    <Upload className="w-12 h-12 text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-slate-600">
                        {uploading ? 'Uploading...' : 'Click to upload'}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                        PNG, JPG up to 5MB
                    </span>
                </label>
            )}

            {/* Image previews */}
            <div className="grid grid-cols-2 gap-3">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group"
                    >
                        <img
                            src={image.url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                        />

                        {image.isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        )}

                        {!image.isUploading && (
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X size={16} />
                            </button>
                        )}

                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {index === 0 ? 'Main' : `#${index + 1}`}
                        </div>
                    </div>
                ))}

                {/* Placeholder boxes */}
                {Array.from({ length: Math.max(0, minImages - images.length) }).map((_, i) => (
                    <div
                        key={`placeholder-${i}`}
                        className="aspect-square rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center"
                    >
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                ))}
            </div>

            {images.length < minImages && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                    <span className="font-semibold">⚠</span>
                    Minimum {minImages} images required to publish
                </p>
            )}

            <p className="text-xs text-slate-400 italic">
                Images will be stored in Supabase Storage
            </p>
        </div>
    );
};

export default ImageUpload;
