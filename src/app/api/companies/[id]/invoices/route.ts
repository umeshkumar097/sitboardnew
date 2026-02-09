import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || (session.role !== 'super_admin' && session.company_id !== parseInt((await params).id))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id: companyId } = await params;

    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM invoices WHERE company_id = $1 ORDER BY created_at DESC', [companyId]);
        return NextResponse.json(res.rows);
    } catch (err) {
        console.error('Fetch Invoices Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
