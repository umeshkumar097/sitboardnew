import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { jwtVerify } from 'jose';

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');
        await jwtVerify(token, secret);
    } catch (err) {
        return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const { id } = params;
    const { status } = await request.json();

    if (!status) return NextResponse.json({ error: 'Status required' }, { status: 400 });

    const client = await pool.connect();
    try {
        await client.query('UPDATE leads SET status = $1 WHERE id = $2', [status, id]);
        return NextResponse.json({ success: true, message: 'Status updated' });
    } catch (err) {
        console.error('Update status error:', err);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}
