import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog - SiteBoard',
    description: 'Latest news, updates, and insights from SiteBoard.',
};

async function getBlogs() {
    // In a server component, we can call the DB directly or fetch from API. 
    // Fetching from API (absolute URL needed) or DB directly is fine. 
    // Let's use the API route we created, but we need full URL. 
    // Actually, for Server Components, direct DB access is often cleaner if we want to avoid full URL issues, 
    // but we already made an API. Let's try to use the API if we can, or validly use DB code.
    // Given we are in the same app, let's just re-use the DB logic or import the GET function? 
    // Importing GET function is tricky with NextRequest types. 
    // Let's use direct DB query here for simplicity and performance in Server Component.

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT id, title, slug, excerpt, featured_image, published_at, views 
            FROM blogs 
            WHERE published = true 
            ORDER BY published_at DESC
        `);
        return res.rows;
    } finally {
        client.release();
        // Don't end pool as it might be shared? actually new Pool here is bad practice if repeated.
        // We should import the singleton pool from @/lib/db
        // But @/lib/db uses 'pg' import which is fine.
    }
}

// Better way: Import pool from lib
import pool from '@/lib/db';

async function getBlogsSafe() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT id, title, slug, excerpt, featured_image, published_at, views 
            FROM blogs 
            WHERE published = true 
            ORDER BY published_at DESC
        `);
        return res.rows;
    } catch (e) {
        console.error(e);
        return [];
    } finally {
        client.release();
    }
}

export default async function BlogParams() {
    const blogs = await getBlogsSafe();

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Nav placeholder - Assuming Main Layout handles generic Nav, but if this is a public page 
                outside dashboard layout, it might need its own Nav. 
                For now, let's just make the content area. 
             */}

            <div className="bg-slate-50 border-b border-gray-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight sm:text-5xl">
                        Our Blog
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                        Latest updates, industry insights, and news from the SiteBoard team.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogs.length > 0 ? (
                        blogs.map((blog: any) => (
                            <Link
                                href={`/blog/${blog.slug}`}
                                key={blog.id}
                                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="aspect-[16/9] w-full bg-gray-100 relative overflow-hidden">
                                    {blog.featured_image ? (
                                        <img
                                            src={blog.featured_image}
                                            alt={blog.title}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300">
                                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                                        <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{blog.views} views</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                        {blog.excerpt || blog.content?.substring(0, 150) + "..."}
                                    </p>
                                    <span className="text-blue-600 font-medium text-sm mt-auto inline-flex items-center group-hover:translate-x-1 transition-transform">
                                        Read more
                                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No blog posts found. Check back later!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
