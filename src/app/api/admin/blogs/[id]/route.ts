import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, slug, content, excerpt, featured_image, meta_title, meta_description, published } = await req.json();

    const client = await pool.connect();
    try {
        // Optimistically update published_at if switching to published for the first time or re-publishing?
        // Simple logic: If published is true now and wasn't before? Or just update it if published is true.
        // Let's keep it simple: if published is true, we update published_at if it was null?

        // Actually, easiest is to just update published and updated_at.
        const result = await client.query(
            `UPDATE blogs 
             SET title = $1, slug = $2, content = $3, excerpt = $4, featured_image = $5, 
                 meta_title = $6, meta_description = $7, published = $8, updated_at = NOW(),
                 published_at = CASE WHEN $8 = true AND published_at IS NULL THEN NOW() ELSE published_at END
             WHERE id = $9
             RETURNING *`,
            [title, slug, content, excerpt, featured_image, meta_title, meta_description, published, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        console.error('Error updating blog:', error);
        if (error.code === '23505') {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
