import Link from 'next/link';
import { Metadata } from 'next';
import pool from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogSidebar from '@/components/BlogSidebar';

export const metadata: Metadata = {
    title: 'Real Estate Developer Insights | SiteBoard Blog',
    description: 'Expert tips, market trends, and strategies for real estate developers and channel partners in India.',
};

async function getBlogs(search?: string, category?: string) {
    const client = await pool.connect();
    try {
        let query = `
            SELECT * FROM blogs 
            WHERE published = true 
        `;
        const values: any[] = [];
        let paramCount = 1;

        if (search) {
            query += ` AND (title ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        if (category) {
            query += ` AND category = $${paramCount}`;
            values.push(category);
            paramCount++;
        }

        query += ` ORDER BY published_at DESC`;

        const result = await client.query(query, values);
        return result.rows;
    } finally {
        client.release();
    }
}

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
    const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;

    const blogs = await getBlogs(search, category);

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* Header */}
            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {category ? `${category} Articles` : 'Real Estate Insights'}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Strategies, trends, and technology for modern real estate developers.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 flex-1">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-1">
                        {search && (
                            <div className="mb-8 p-4 bg-white border rounded-lg flex items-center justify-between shadow-sm">
                                <span className="text-slate-600">
                                    Search results for: <strong>"{search}"</strong>
                                </span>
                                <Link href="/blog" className="text-blue-600 hover:underline text-sm font-medium">
                                    Clear Search
                                </Link>
                            </div>
                        )}

                        {category && (
                            <div className="mb-8 p-4 bg-white border rounded-lg flex items-center justify-between shadow-sm">
                                <span className="text-slate-600">
                                    Showing posts in: <strong>"{category}"</strong>
                                </span>
                                <Link href="/blog" className="text-blue-600 hover:underline text-sm font-medium">
                                    Show All Posts
                                </Link>
                            </div>
                        )}

                        {blogs.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-8">
                                {blogs.map((blog: any) => (
                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        key={blog.id}
                                        className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-200 flex flex-col h-full"
                                    >
                                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                            {blog.featured_image ? (
                                                <img
                                                    src={blog.featured_image}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-100 text-slate-300">
                                                    📰
                                                </div>
                                            )}
                                            {blog.category && (
                                                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                                    {blog.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="text-xs text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wide font-medium">
                                                <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                                                {blog.author_name && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{blog.author_name}</span>
                                                    </>
                                                )}
                                            </div>
                                            <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {blog.title}
                                            </h2>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                                {blog.excerpt}
                                            </p>
                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-blue-600 font-semibold text-sm">
                                                Read Article
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
                                <p className="text-slate-500 mb-6">
                                    We couldn't find any articles matching your search.
                                </p>
                                <Link href="/blog" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors inline-block">
                                    View All Articles
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="flex-none lg:w-80">
                        <BlogSidebar />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
