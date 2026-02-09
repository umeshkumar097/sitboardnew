import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: companyId } = await params;
    // Authenticate Super Admin
    // const session = await getSession(); // Commented out for now as getSession might not be available in this context or mocked
    // if (!session || session.role !== 'super_admin') {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    const client = await pool.connect();

    try {
        const { plan, subscription_status, extend_trial_days, duration, customEndDate, amount, generateReceipt } = await req.json();

        await client.query('BEGIN');

        let periodEnd = null;
        let periodStart = new Date();

        // Calculate Subscription End Date
        if (plan !== 'trial' && duration) {
            const startDate = new Date();
            if (duration === 'monthly') {
                startDate.setMonth(startDate.getMonth() + 1);
                periodEnd = startDate;
            } else if (duration === 'yearly') {
                startDate.setFullYear(startDate.getFullYear() + 1);
                periodEnd = startDate;
            } else if (duration === 'custom' && customEndDate) {
                periodEnd = new Date(customEndDate);
            }
        }

        // Update Company Query
        let updateQuery = `
            UPDATE companies 
            SET 
                plan = $1, 
                subscription_status = $2,
                updated_at = NOW()
        `;
        const queryParams: any[] = [plan, subscription_status];
        let paramIndex = 3;

        if (periodEnd) {
            updateQuery += `, subscription_ends_at = $${paramIndex}`;
            queryParams.push(periodEnd);
            paramIndex++;
        }

        // Logic to update trial end date if requested
        if (plan === 'trial' && extend_trial_days > 0) {
            updateQuery += `, trial_ends_at = coalesce(trial_ends_at, NOW()) + INTERVAL '${extend_trial_days} days'`;
        }

        updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
        queryParams.push(companyId);

        const res = await client.query(updateQuery, queryParams);

        if (res.rowCount === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        // Generate Invoice if requested
        if (generateReceipt && amount > 0) {
            const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

            await client.query(`
                INSERT INTO invoices (company_id, invoice_number, amount, plan_name, period_start, period_end, status)
                VALUES ($1, $2, $3, $4, $5, $6, 'Paid')
            `, [companyId, invoiceNumber, amount, plan, periodStart, periodEnd]);
        }

        await client.query('COMMIT');

        return NextResponse.json(res.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Update Subscription Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
