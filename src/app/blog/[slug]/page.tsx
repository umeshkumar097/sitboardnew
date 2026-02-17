import { Metadata } from 'next';
import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import BlogEnquiryForm from '@/components/BlogEnquiryForm';

// Helper to get blog data
async function getBlog(slug: string) {
    const client = await pool.connect();
    try {
        // Increment views
        await client.query(`UPDATE blogs SET views = views + 1 WHERE slug = $1`, [slug]);

        // Fetch blog
        const res = await client.query(`SELECT * FROM blogs WHERE slug = $1 AND published = true`, [slug]);
        return res.rows[0];
    } finally {
        client.release();
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT title, excerpt, meta_title, meta_description, featured_image FROM blogs WHERE slug = $1`, [slug]);
        const blog = res.rows[0];

        if (!blog) return { title: 'Blog Not Found' };

        return {
            title: blog.meta_title || blog.title,
            description: blog.meta_description || blog.excerpt,
            openGraph: {
                title: blog.meta_title || blog.title,
                description: blog.meta_description || blog.excerpt,
                images: blog.featured_image ? [{ url: blog.featured_image }] : [],
                type: 'article',
            },
        };
    } finally {
        client.release();
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <article className="flex-1 pb-20">
                {/* Hero Section */}
                <div className="w-full bg-slate-50 border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6">
                        <div className="text-center space-y-4">
                            {blog.category && (
                                <Link
                                    href={`/blog?category=${encodeURIComponent(blog.category)}`}
                                    className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide hover:bg-blue-200 transition-colors"
                                >
                                    {blog.category}
                                </Link>
                            )}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                {blog.title}
                            </h1>
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 pt-2">
                                <time dateTime={blog.published_at}>
                                    {new Date(blog.published_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                                <span>•</span>
                                <span>{blog.views} views</span>
                                {blog.author_name && (
                                    <>
                                        <span>•</span>
                                        <span className="font-medium text-slate-700">By {blog.author_name}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                {blog.featured_image && (
                    <div className="max-w-4xl mx-auto px-4 -mt-8 sm:-mt-12 mb-12">
                        <img
                            src={blog.featured_image}
                            alt={blog.title}
                            className="w-full rounded-2xl shadow-xl border border-gray-100 object-cover aspect-[21/9]"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="max-w-3xl mx-auto px-4">
                    <div
                        className="prose prose-lg prose-slate prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 mx-auto"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    <BlogEnquiryForm blogTitle={blog.title} />

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <Link href="/blog" className="text-blue-600 font-medium hover:underline flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to all articles
                        </Link>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}
