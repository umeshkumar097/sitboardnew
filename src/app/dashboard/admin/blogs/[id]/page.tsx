"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/admin/blogs/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        title: data.title || '',
                        slug: data.slug || '',
                        content: data.content || '',
                        excerpt: data.excerpt || '',
                        featured_image: data.featured_image || '',
                        meta_title: data.meta_title || '',
                        meta_description: data.meta_description || '',
                        published: data.published || false,
                    });
                } else {
                    alert('Blog not found');
                    router.push('/dashboard/admin/blogs');
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/blogs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard/admin/blogs');
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to update blog');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            alert('An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Edit Blog</h1>
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

                {/* Content */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Content <span className="text-red-500">*</span></label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-mono text-sm"
                        placeholder="Write your blog content here..."
                    />
                    <p className="text-xs text-gray-400">Basic HTML is supported.</p>
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
                    {/* Featured Image */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Featured Image URL</label>
                        <input
                            type="url"
                            name="featured_image"
                            value={formData.featured_image || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                            placeholder="https://example.com/image.jpg"
                        />
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
                            <span className="text-sm font-medium text-slate-700">Published</span>
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
                                value={formData.meta_title || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                                placeholder="SEO optimized title"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Meta Description</label>
                            <textarea
                                name="meta_description"
                                value={formData.meta_description || ''}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                                placeholder="SEO description (150-160 chars recommended)"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/admin/blogs')}
                        className="px-6 py-2.5 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Update Blog Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
