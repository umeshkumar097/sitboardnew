import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM site_enquiries ORDER BY created_at DESC');
        return NextResponse.json({ enquiries: res.rows });
    } catch (err) {
        console.error('Fetch Enquiries Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PUT(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and Status are required' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            await client.query(
                'UPDATE site_enquiries SET status = $1 WHERE id = $2',
                [status, id]
            );
            return NextResponse.json({ success: true });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Update Enquiry Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            await client.query('DELETE FROM site_enquiries WHERE id = $1', [id]);
            return NextResponse.json({ success: true });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Delete Enquiry Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
