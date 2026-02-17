'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
    'General',
    'Real Estate Tips',
    'Market Updates',
    'Project Launches',
    'Technology',
    'Vastu'
];

export default function BlogSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        // Always reset page to 1 when searching
        params.delete('page');
        router.push(`/blog?${params.toString()}`);
    };

    return (
        <aside className="w-full lg:w-80 space-y-8">
            {/* Search Widget */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Search</h3>
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </form>
            </div>

            {/* Categories Widget */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Categories</h3>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/blog"
                            className={`block px-3 py-2 rounded-md transition-colors ${!currentCategory ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            All Posts
                        </Link>
                    </li>
                    {CATEGORIES.map(category => (
                        <li key={category}>
                            <Link
                                href={`/blog?category=${encodeURIComponent(category)}`}
                                className={`block px-3 py-2 rounded-md transition-colors ${currentCategory === category ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                {category}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Newsletter / CTA Widget */}
            <div className="bg-blue-600 p-6 rounded-lg shadow-sm text-white">
                <h3 className="text-lg font-bold mb-2">Get Real Estate Insights</h3>
                <p className="text-blue-100 mb-4 text-sm">Join 2,000+ developers getting expert tips weekly.</p>
                <Link href="/#signup" className="block w-full text-center py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Subscribe
                </Link>
            </div>
        </aside>
    );
}
