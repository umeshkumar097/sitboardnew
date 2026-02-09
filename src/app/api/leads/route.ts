import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { role, company_id, id: userId } = session;

    const client = await pool.connect();
    try {
        let query = '';
        let params: any[] = [];

        if (role === 'company_admin') {
            query = 'SELECT * FROM leads WHERE company_id = $1 ORDER BY created_at DESC';
            params = [company_id];
        } else if (role === 'agent') {
            query = 'SELECT * FROM leads WHERE agent_id = $1 ORDER BY created_at DESC';
            params = [userId];
        } else if (role === 'super_admin') {
            query = 'SELECT * FROM leads ORDER BY created_at DESC';
            params = [];
        } else {
            // Super Admin? Or authorized check
            return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
        }

        const res = await client.query(query, params);
        return NextResponse.json({ leads: res.rows });

    } catch (err) {
        console.error('Fetch Leads Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { company_id, id: userId, role } = session;

    if (!company_id) {
        return NextResponse.json({ error: 'No company associated' }, { status: 400 });
    }

    try {
        const { name, phone, email, budget, notes, status } = await req.json();

        if (!name || !phone) {
            return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const res = await client.query(
                `INSERT INTO leads (company_id, agent_id, name, phone, email, budget, notes, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING id`,
                [company_id, userId, name, phone, email, budget, notes, status || 'new']
            );
            return NextResponse.json({ id: res.rows[0].id });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Create Lead Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
