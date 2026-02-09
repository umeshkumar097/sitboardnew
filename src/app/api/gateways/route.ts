import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const res = await client.query("SELECT gateway_name, public_key FROM payment_settings WHERE is_enabled = true");
        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Error fetching gateways:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
