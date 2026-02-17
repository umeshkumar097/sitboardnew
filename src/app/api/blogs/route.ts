import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT id, title, slug, excerpt, featured_image, published_at, views 
             FROM blogs 
             WHERE published = true 
             ORDER BY published_at DESC 
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countRes = await client.query('SELECT COUNT(*) FROM blogs WHERE published = true');
        const total = parseInt(countRes.rows[0].count);

        return NextResponse.json({
            data: result.rows,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total
            }
        });
    } catch (error) {
        console.error('Error fetching public blogs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
