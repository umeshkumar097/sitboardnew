"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function NewBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        meta_title: '',
        meta_description: '',
        published: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleContentChange = (value: string) => {
        setFormData(prev => ({ ...prev, content: value }));
    };

    // Auto-generate slug from title
    const handleTitleBlur = () => {
        if (!formData.slug && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    // Image Upload Handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const response = await fetch(
                `/api/upload?filename=${encodeURIComponent(file.name)}`,
                {
                    method: 'POST',
                    body: file,
                },
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const newBlob = await response.json();
            setFormData(prev => ({ ...prev, featured_image: newBlob.url }));
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to upload image. Checks logs or ensure BLOB_READ_WRITE_TOKEN is set.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Basic validation
            if (!formData.title || !formData.slug || !formData.content) {
                alert('Please fill in all required fields (Title, Slug, Content)');
                setLoading(false);
                return;
            }

            const res = await fetch('/api/admin/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard/admin/blogs');
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to create blog');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            alert('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const modules = useMemo(() => ({
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    }), []);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Create New Blog</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            onBlur={handleTitleBlur}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                            placeholder="Enter blog title"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Slug <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-mono text-sm"
                            placeholder="my-blog-post-slug"
                        />
                    </div>
                </div>

                {/* Content - ReactQuill */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Content <span className="text-red-500">*</span></label>
                    <div className="prose-editor">
                        <ReactQuill
                            theme="snow"
                            value={formData.content}
                            onChange={handleContentChange}
                            modules={modules}
                            className="h-64 mb-12"
                        />
                    </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Excerpt / Short Description</label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                        placeholder="Brief summary for listings..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Featured Image - Upload */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Featured Image</label>

                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-slate-50 file:text-slate-700
                                      hover:file:bg-slate-100
                                    "
                                />
                                {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                            </div>
                        </div>

                        {/* Hidden URL input/Preview */}
                        <div className="mt-2">
                            <input
                                type="url"
                                name="featured_image"
                                value={formData.featured_image}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-xs border border-gray-100 rounded bg-gray-50 text-gray-500"
                                placeholder="Image URL (auto-filled on upload)"
                                readOnly={uploading}
                            />
                        </div>
                        {formData.featured_image && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 w-full aspect-video relative">
                                <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="flex items-end pb-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="published"
                                checked={formData.published}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 text-slate-900 rounded border-gray-300 focus:ring-slate-900"
                            />
                            <span className="text-sm font-medium text-slate-700">Publish Immediately</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">SEO Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Meta Title</label>
                            <input
                                type="text"
                                name="meta_title"
                                value={formData.meta_title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                                placeholder="SEO optimized title"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Meta Description</label>
                            <textarea
                                name="meta_description"
                                value={formData.meta_description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                                placeholder="SEO description (150-160 chars recommended)"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Create Blog Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
