import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();

    // Only Company Admin (or Super Admin if they had a company context, but per rules, Project needs Company)
    // We assume here that the user MUST have a company_id to create a project.
    if (!session || !session.company_id || session.role === 'agent') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { name, location } = await req.json();

        if (!name || !location) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const res = await client.query(
                'INSERT INTO projects (company_id, name, location) VALUES ($1, $2, $3) RETURNING id',
                [session.company_id, name, location]
            );
            return NextResponse.json({ id: res.rows[0].id });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error creating project:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
