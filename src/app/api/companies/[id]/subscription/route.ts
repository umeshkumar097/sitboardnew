import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: companyId } = await params;
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }


    const client = await pool.connect();

    try {
        const { plan, subscription_status, extend_trial_days } = await req.json();

        let query = `
            UPDATE companies 
            SET 
                plan = $1, 
                subscription_status = $2
        `;
        const queryParams: any[] = [plan, subscription_status];

        // Logic to update trial end date if requested
        if (plan === 'trial' && extend_trial_days > 0) {
            query += `, trial_ends_at = coalesce(trial_ends_at, NOW()) + INTERVAL '${extend_trial_days} days'`;
        }

        query += ` WHERE id = $3 RETURNING *`;
        queryParams.push(companyId);

        const res = await client.query(query, queryParams);

        if (res.rowCount === 0) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        return NextResponse.json(res.rows[0]);
    } catch (err) {
        console.error('Update Subscription Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
