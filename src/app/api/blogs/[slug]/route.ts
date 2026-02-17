import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Fetch blog
        const result = await client.query(
            `SELECT * FROM blogs WHERE slug = $1 AND published = true`,
            [slug]
        );

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // Increment views
        await client.query(
            `UPDATE blogs SET views = views + 1 WHERE id = $1`,
            [result.rows[0].id]
        );

        await client.query('COMMIT');

        // Return the blog data (views will be the old count or we could re-fetch/increment locally in response, 
        // usually it's fine to return the select result or the updated one? 
        // Let's just return the result we found, view count + 1 won't be critical for the user to see immediately perfectly synced)
        return NextResponse.json(result.rows[0]);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error fetching public blog:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
