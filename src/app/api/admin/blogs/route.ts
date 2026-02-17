import { NextResponse } from 'next/server'; // Correct import for App Router
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM blogs ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, slug, content, excerpt, featured_image, meta_title, meta_description, published } = await req.json();

    if (!title || !slug || !content) {
        return NextResponse.json({ error: 'Title, Slug, and Content are required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(
            `INSERT INTO blogs (title, slug, content, excerpt, featured_image, meta_title, meta_description, published, author_id, published_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CASE WHEN $8 = true THEN NOW() ELSE NULL END, NOW())
             RETURNING *`,
            [title, slug, content, excerpt, featured_image, meta_title, meta_description, published || false, session.id]
        );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error: any) {
        console.error('Error creating blog:', error);
        if (error.code === '23505') { // Unique violation for slug
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
