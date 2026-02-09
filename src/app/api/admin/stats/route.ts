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
        // 1. Company Stats
        const companiesRes = await client.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN subscription_status = 'active' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN subscription_status IN ('expired', 'cancelled') THEN 1 ELSE 0 END) as expired,
                SUM(CASE WHEN plan = 'trial' THEN 1 ELSE 0 END) as trial
            FROM companies
        `);
        const companyStats = companiesRes.rows[0];

        // 2. Revenue Stats (from payments table)
        // If payments table is empty, this will return null, so coalesce to 0
        const revenueRes = await client.query(`
            SELECT COALESCE(SUM(amount), 0) as total_revenue 
            FROM payments 
            WHERE status = 'success'
        `);
        const totalRevenue = parseFloat(revenueRes.rows[0].total_revenue);

        // 3. User Stats
        const usersRes = await client.query('SELECT COUNT(*) as total FROM users');
        const totalUsers = parseInt(usersRes.rows[0].total);

        // 4. Gateway Status
        const gatewaysRes = await client.query('SELECT gateway_name, is_enabled FROM payment_settings');
        const gateways = gatewaysRes.rows.reduce((acc: any, row: any) => {
            acc[row.gateway_name] = row.is_enabled;
            return acc;
        }, {});

        return NextResponse.json({
            companies: {
                total: parseInt(companyStats.total),
                active: parseInt(companyStats.active),
                expired: parseInt(companyStats.expired),
                trial: parseInt(companyStats.trial)
            },
            revenue: totalRevenue,
            users: totalUsers,
            gateways
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
