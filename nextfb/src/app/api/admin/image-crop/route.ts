import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { cropPresets, getCropRectangle, maximumZoom, type CropPosition } from '@/lib/image-crop';
import { findUserProfileById } from '@/server/repositories/user.repo';
import { createClient } from '@/supabase/server';

export const runtime = 'nodejs';

const formats = { jpeg: ['jpg', 'image/jpeg'], png: ['png', 'image/png'], webp: ['webp', 'image/webp'] } as const;
const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail('Sign in to edit images.', 401);
    const { data: profile } = await findUserProfileById(user.id);
    if (profile?.role !== 'admin') return fail('Only admins can edit images.', 403);

    const contentLength = Number(request.headers.get('content-length'));
    if (contentLength > cropPresets.category.maxBytes + 64 * 1024) return fail('Image is too large.', 413);

    let form: FormData;
    let position: CropPosition;
    try {
        form = await request.formData();
        const { x, y, zoom } = JSON.parse(String(form.get('position')));
        position = { x, y, zoom };
    } catch {
        return fail('Invalid crop request.');
    }

    const preset = form.get('preset');
    if (preset !== 'product' && preset !== 'category') return fail('Unknown crop preset.');
    const { x, y, zoom } = position;
    if (![x, y, zoom].every(Number.isFinite) || x < 0 || x > 1 || y < 0 || y > 1 || zoom < 1 || zoom > maximumZoom) {
        return fail('Invalid crop position or zoom.');
    }

    const config = cropPresets[preset];
    const bucket = supabase.storage.from(config.bucket);
    const file = form.get('file');
    const existingPath = form.get('originalPath');
    let source: Blob;
    if (file instanceof File) {
        source = file;
    } else if (typeof existingPath === 'string' && /^originals\/[a-f0-9-]{36}\.(jpg|png|webp)$/.test(existingPath)) {
        const { data, error } = await bucket.download(existingPath);
        if (error || !data) return fail('Could not load the original image.');
        source = data;
    } else {
        return fail('Choose an image to crop.');
    }

    if (source.size === 0 || source.size > config.maxBytes) {
        return fail(`Choose an image up to ${config.maxBytes / (1024 * 1024)} MB.`, 413);
    }

    const input = Buffer.from(await source.arrayBuffer());
    const image = sharp(input, { limitInputPixels: 40_000_000 });
    let format: keyof typeof formats;
    let rectangle;
    let cropped: Buffer;
    try {
        const metadata = await image.metadata();
        if (metadata.format !== 'jpeg' && metadata.format !== 'png' && metadata.format !== 'webp') {
            return fail('Choose a JPEG, PNG, or WebP image.');
        }
        format = metadata.format;
        const { width, height } = metadata.autoOrient;
        if (width < config.unitWidth || height < config.unitHeight) return fail('Image is too small to crop.');
        rectangle = getCropRectangle(width, height, preset, position);
        cropped = await image.autoOrient().extract(rectangle)
            .resize(config.width, config.height, { fit: 'fill' }).webp({ quality: 88 }).toBuffer();
    } catch {
        return fail('The image could not be decoded or exceeds the pixel limit.');
    }

    const id = randomUUID();
    const [extension, contentType] = formats[format];
    const isNewOriginal = file instanceof File;
    const originalPath = isNewOriginal ? `originals/${id}.${extension}` : String(existingPath);
    if (isNewOriginal) {
        const { error } = await bucket.upload(originalPath, input, { contentType });
        if (error) {
            console.error('Image crop original upload failed', { bucket: config.bucket, message: error.message });
            return fail(`Could not upload the original image to ${config.bucket}. Check the bucket and its upload policy.`, 502);
        }
    }

    const croppedPath = `cropped/${id}.webp`;
    const { error } = await bucket.upload(croppedPath, cropped, { contentType: 'image/webp' });
    if (error) {
        console.error('Image crop output upload failed', { bucket: config.bucket, message: error.message });
        if (isNewOriginal) await bucket.remove([originalPath]);
        return fail('Could not upload the cropped image.', 502);
    }

    return Response.json({
        path: croppedPath,
        url: bucket.getPublicUrl(croppedPath).data.publicUrl,
        crop: { ...position, originalPath, rectangle },
    });
}

