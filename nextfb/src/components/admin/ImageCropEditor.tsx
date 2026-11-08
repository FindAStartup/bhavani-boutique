'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { RotateCcw } from 'lucide-react';
import { cropPresets, getCropRectangle, initialCrop, maximumZoom, type CropPosition, type CropPreset } from '@/lib/image-crop';

interface ImageCropEditorProps {
    source: string;
    preset: CropPreset;
    initialPosition?: CropPosition;
    onApply: (position: CropPosition) => Promise<void>;
    onClose: () => void;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function ImageCropEditor({ source, preset, initialPosition = initialCrop, onApply, onClose }: ImageCropEditorProps) {
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState<{ width: number; height: number }>();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const dialog = useRef<HTMLDialogElement>(null);
    const drag = useRef<{ id: number; startX: number; startY: number; position: CropPosition } | null>(null);
    const config = cropPresets[preset];
    const crop = size && getCropRectangle(size.width, size.height, preset, position);

    useEffect(() => {
        dialog.current?.showModal();
    }, []);

    function startDrag(event: PointerEvent<HTMLDivElement>) {
        if (!crop || busy || event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, position };
    }

    function moveDrag(event: PointerEvent<HTMLDivElement>) {
        const start = drag.current;
        if (!start || start.id !== event.pointerId || !crop || !size) return;
        const scale = crop.width / event.currentTarget.getBoundingClientRect().width;
        const rangeX = size.width - crop.width;
        const rangeY = size.height - crop.height;
        setPosition(current => ({
            ...current,
            x: rangeX ? clamp(start.position.x - (event.clientX - start.startX) * scale / rangeX) : current.x,
            y: rangeY ? clamp(start.position.y - (event.clientY - start.startY) * scale / rangeY) : current.y,
        }));
    }

    async function apply() {
        setBusy(true);
        setError('');
        try {
            await onApply(position);
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Could not apply the crop.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <dialog
            ref={dialog}
            aria-label="Adjust image crop"
            className="fixed inset-0 m-auto max-h-[90dvh] w-[min(92vw,26rem)] overflow-y-auto rounded-xl bg-white p-5 text-slate-900 shadow-xl backdrop:bg-black/60"
            onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}
        >
            <h2 className="text-lg font-semibold">Adjust image crop</h2>
            <p className="mb-3 text-sm text-slate-600">Drag the photo to position it, or use the sliders below.</p>
            <div
                className={`relative mx-auto max-w-52 touch-none cursor-grab overflow-hidden bg-stone-100 active:cursor-grabbing ${config.circular ? 'rounded-full' : 'rounded-lg'}`}
                style={{ aspectRatio: `${config.width} / ${config.height}` }}
                onPointerDown={startDrag}
                onPointerMove={moveDrag}
                onLostPointerCapture={() => { drag.current = null; }}
            >
                {/* Natural dimensions and the source pixels are required for the crop preview. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={source}
                    alt="Crop preview"
                    draggable={false}
                    onLoad={event => {
                        const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
                        if (width >= config.unitWidth && height >= config.unitHeight) setSize({ width, height });
                        else setError('Image is too small to crop.');
                    }}
                    onError={() => setError('Could not load the image.')}
                    className="pointer-events-none absolute max-w-none select-none"
                    style={crop && size ? {
                        width: `${size.width / crop.width * 100}%`,
                        left: `${-crop.left / crop.width * 100}%`,
                        top: `${-crop.top / crop.height * 100}%`,
                    } : { visibility: 'hidden' }}
                />
            </div>
            <fieldset disabled={busy || !crop} className="mt-4 space-y-2 text-sm">
                <label className="block">Zoom
                    <input className="block w-full" type="range" min={1} max={maximumZoom} step={0.01} value={position.zoom}
                        onChange={event => setPosition(current => ({ ...current, zoom: Number(event.target.value) }))} />
                </label>
                <label className="block">Horizontal position
                    <input className="block w-full" type="range" min={0} max={1} step={0.01} value={position.x}
                        onChange={event => setPosition(current => ({ ...current, x: Number(event.target.value) }))} />
                </label>
                <label className="block">Vertical position
                    <input className="block w-full" type="range" min={0} max={1} step={0.01} value={position.y}
                        onChange={event => setPosition(current => ({ ...current, y: Number(event.target.value) }))} />
                </label>
            </fieldset>
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
            <div className="mt-4 flex flex-wrap justify-end gap-2 text-sm">
                <button type="button" disabled={busy || !crop} onClick={() => setPosition(initialCrop)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50">
                    <RotateCcw size={15} aria-hidden="true" />
                    Reset
                </button>
                <button type="button" disabled={busy} onClick={onClose}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                    Cancel
                </button>
                <button type="button" disabled={busy || !crop} onClick={apply}
                    className="rounded-lg bg-[#550000] px-3 py-2 font-semibold text-white disabled:opacity-50">
                    {busy ? 'Saving…' : 'Apply crop'}
                </button>
            </div>
        </dialog>
    );
}
