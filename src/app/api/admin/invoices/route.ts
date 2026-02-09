import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT i.*, c.name as company_name 
            FROM invoices i 
            JOIN companies c ON i.company_id = c.id 
            ORDER BY i.created_at DESC
        `);
        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Error fetching admin invoices:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
