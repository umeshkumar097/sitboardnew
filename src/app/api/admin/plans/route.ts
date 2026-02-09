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
        const res = await client.query('SELECT * FROM subscription_plans ORDER BY price ASC');
        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Error fetching plans:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, price, currency, duration, features, is_active } = await request.json();

    const client = await pool.connect();
    try {
        const res = await client.query(
            `INSERT INTO subscription_plans (name, price, currency, duration, features, is_active) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, price, currency || 'USD', duration, features || {}, is_active ?? true]
        );
        return NextResponse.json(res.rows[0]);
    } catch (error) {
        console.error('Error creating plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
