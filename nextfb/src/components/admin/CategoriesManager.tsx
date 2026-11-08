'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Crop, ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react';
import ImageCropEditor from '@/components/admin/ImageCropEditor';
import { categoryImage, categoryImageUrl, type Category } from '@/lib/categories';
import { cropPresets, saveImageCrop, type SavedImageCrop } from '@/lib/image-crop';
import { deleteCategory, saveCategory } from '@/server/actions/category.actions';

type CategoryPhoto = { path: string; crop: SavedImageCrop };

export default function CategoriesManager({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [editing, setEditing] = useState<Category | 'new' | null>(null);
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState<CategoryPhoto>();
    const [file, setFile] = useState<File>();
    const [source, setSource] = useState<string>();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState<Category | null>(null);
    const [notice, setNotice] = useState('');
    const deleteDialog = useRef<HTMLDialogElement>(null);
    const editorDialog = useRef<HTMLDialogElement>(null);
    const current = editing && editing !== 'new' ? editing : null;
    const savedCrop = photo?.crop ?? current?.image_crop ?? undefined;
    const preview = photo ? categoryImageUrl(photo.path) : current && categoryImage(current);

    useEffect(() => {
        if (deleting) deleteDialog.current?.showModal();
    }, [deleting]);

    useEffect(() => {
        if (editing) editorDialog.current?.showModal();
    }, [editing]);

    function edit(category: Category | 'new' | null) {
        if (!category) editorDialog.current?.close();
        setError('');
        setNotice('');
        setName(category && category !== 'new' ? category.name : '');
        setPhoto(undefined);
        setEditing(category);
    }

    function closeCrop() {
        if (file && source) URL.revokeObjectURL(source);
        setSource(undefined);
        setFile(undefined);
    }

    function chooseFile(event: ChangeEvent<HTMLInputElement>) {
        const selected = event.target.files?.[0];
        event.target.value = '';
        if (!selected) return;
        if (selected.size > cropPresets.category.maxBytes || !['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
            setError('Choose a JPEG, PNG, or WebP image up to 10 MB.');
            return;
        }
        setError('');
        setFile(selected);
        setSource(URL.createObjectURL(selected));
    }

    async function save() {
        setBusy(true);
        setError('');
        try {
            const result = await saveCategory({ id: current?.id, name, image: photo });
            if (result.error) setError(result.error);
            else {
                edit(null);
                setNotice(current ? 'Category updated.' : 'Category created.');
                router.refresh();
            }
        } catch {
            setError('Could not save the category. Try again.');
        } finally {
            setBusy(false);
        }
    }

    async function remove(category: Category) {
        setBusy(true);
        setError('');
        try {
            const result = await deleteCategory(category.id);
            if (result.error) setError(result.error);
            else {
                setDeleting(null);
                setNotice(`${category.name} was deleted.`);
                router.refresh();
            }
        } catch {
            setError('Could not delete the category. Try again.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
                    <p className="mt-1 text-slate-600">Manage the collections shown in your storefront.</p>
                </div>
                <button type="button" disabled={busy || !!editing} onClick={() => edit('new')}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#550000] px-4 py-2 font-semibold text-white disabled:opacity-50 md:w-auto">
                    <Plus size={18} /> New Category
                </button>
            </header>

            {editing && (
                <dialog ref={editorDialog} aria-labelledby="category-editor-title"
                    className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-white text-slate-900 backdrop:bg-black/50 md:max-w-lg md:shadow-xl motion-safe:md:transition-transform motion-safe:md:duration-200 motion-safe:md:starting:translate-x-full"
                    onCancel={event => { event.preventDefault(); if (!busy) edit(null); }}>
                    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4 md:justify-between md:px-6">
                        <button type="button" autoFocus disabled={busy} onClick={() => edit(null)}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 md:hidden">
                            <ArrowLeft size={18} aria-hidden="true" /> Back
                        </button>
                        <h2 id="category-editor-title" className="text-lg font-semibold">{current ? 'Edit category' : 'New category'}</h2>
                        <button type="button" disabled={busy} onClick={() => edit(null)} aria-label="Close category editor"
                            className="hidden rounded-lg p-2 hover:bg-slate-100 disabled:opacity-50 md:inline-flex">
                            <X size={20} aria-hidden="true" />
                        </button>
                    </header>
                    <form onSubmit={event => { event.preventDefault(); if (!busy) void save(); }}
                        className="space-y-5 px-5 py-5 md:px-6">
                        <label className="block text-sm font-medium">Name
                            <input required maxLength={80} value={name} disabled={busy} onChange={event => setName(event.target.value)}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" />
                        </label>
                        <div className="flex flex-wrap items-center gap-4">
                            {preview && <div className="relative size-24 overflow-hidden rounded-full bg-stone-100">
                                <Image src={preview} alt="Category preview" fill sizes="96px" className="object-cover" />
                            </div>}
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Category photo</p>
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold hover:bg-slate-100 focus-within:ring-2 focus-within:ring-[#550000]">
                                    <ImagePlus size={16} aria-hidden="true" />
                                    {preview ? 'Replace photo' : 'Choose photo'}
                                    <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={chooseFile}
                                        className="sr-only" />
                                </label>
                                <p className="text-xs text-slate-600">Recommended 512 × 512 px. Center the subject for the circular crop.</p>
                                {preview && <button type="button" disabled={busy}
                                    onClick={() => setSource(savedCrop ? categoryImageUrl(savedCrop.originalPath) : preview)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-[#550000]/20 bg-[#550000]/5 px-3 py-2 text-sm font-semibold text-[#550000]">
                                    <Crop size={16} /> Adjust crop
                                </button>}
                            </div>
                        </div>
                        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                            <button type="button" disabled={busy} onClick={() => edit(null)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
                            <button type="submit" disabled={busy || !name.trim() || (!current && !photo)} className="rounded-lg bg-[#550000] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                                {busy ? 'Saving…' : 'Save category'}
                            </button>
                        </div>
                    </form>
                </dialog>
            )}

            {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
            {!categories.length && <p className="rounded-xl bg-white p-5 text-slate-600">No categories yet. Add one to get started.</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map(category => {
                    const image = categoryImage(category);
                    return (
                        <article key={category.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="relative mx-auto size-28 overflow-hidden rounded-full bg-stone-100 ring-4 ring-stone-100">
                                {image && <Image src={image} alt="" fill sizes="112px" className="object-cover" />}
                            </div>
                            <h2 className="mt-3 text-center font-semibold text-slate-900">{category.name}</h2>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button type="button" disabled={busy || !!editing} onClick={() => edit(category)}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm font-semibold enabled:hover:bg-slate-100 disabled:opacity-50">
                                    <Pencil size={14} aria-hidden="true" /> Edit
                                </button>
                                <button type="button" disabled={busy || !!editing} onClick={() => { setError(''); setNotice(''); setDeleting(category); }}
                                    aria-label={`Delete ${category.name}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-2 py-2 text-sm font-semibold text-red-700 enabled:hover:bg-red-100 disabled:opacity-50">
                                    <Trash2 size={14} aria-hidden="true" /> Delete
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            {deleting && (
                <dialog ref={deleteDialog} aria-labelledby="delete-category-title" aria-describedby="delete-category-description"
                    className="fixed inset-0 m-auto w-[min(92vw,26rem)] rounded-xl bg-white p-6 text-slate-900 shadow-xl backdrop:bg-black/60"
                    onCancel={event => { event.preventDefault(); if (!busy) setDeleting(null); }}>
                    <div className="mb-3 inline-flex rounded-full bg-red-50 p-3 text-red-700"><Trash2 size={20} aria-hidden="true" /></div>
                    <h2 id="delete-category-title" className="text-lg font-semibold">Delete {deleting.name}?</h2>
                    <p id="delete-category-description" className="mt-2 text-sm text-slate-600">
                        This removes the category from the storefront. You must reassign any linked products or drafts before deleting it.
                    </p>
                    {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                    <div className="mt-5 flex flex-wrap justify-end gap-2">
                        <button type="button" autoFocus disabled={busy} onClick={() => setDeleting(null)}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                        <button type="button" disabled={busy} onClick={() => void remove(deleting)}
                            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50">
                            {busy ? 'Deleting…' : 'Delete category'}
                        </button>
                    </div>
                </dialog>
            )}

            {source && <ImageCropEditor source={source} preset="category" initialPosition={file ? undefined : savedCrop} onClose={closeCrop}
                onApply={async position => {
                    let input: string | File;
                    if (file) input = file;
                    else if (savedCrop) input = savedCrop.originalPath;
                    else {
                        const response = await fetch(source);
                        if (!response.ok) throw new Error('Could not load the category photo.');
                        const blob = await response.blob();
                        input = new File([blob], 'category-photo', { type: blob.type });
                    }
                    const image = await saveImageCrop('category', position, input);
                    if (!image.crop || !image.path) throw new Error('Could not save the category photo.');
                    setPhoto({ path: image.path, crop: image.crop });
                }} />}
        </div>
    );
}
