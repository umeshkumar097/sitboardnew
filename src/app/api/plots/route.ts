import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role === 'agent') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { projectId, number, dimension, price } = await req.json();

        if (!projectId || !number) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            // Verify project ownership
            const projectCheck = await client.query('SELECT company_id FROM projects WHERE id = $1', [projectId]);

            if (projectCheck.rowCount === 0) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            }

            if (session.role !== 'super_admin' && projectCheck.rows[0].company_id !== session.company_id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }

            await client.query(
                'INSERT INTO plots (project_id, plot_number, dimension, price) VALUES ($1, $2, $3, $4)',
                [projectId, number, dimension, price ? parseFloat(price) : null]
            );

            return NextResponse.json({ success: true });
        } finally {
            client.release();
        }
    } catch (e: any) {
        console.error('Add Plot Error:', e);
        if (e.code === '23505') {
            return NextResponse.json({ error: 'Plot number already exists in this project' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
