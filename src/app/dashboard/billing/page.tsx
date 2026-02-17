import { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';
import BillingPortal from '@/components/dashboard/BillingPortal';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Billing & Subscription | SiteBoard',
    description: 'Manage your subscription and billing details.',
};

export default async function BillingPage() {
    const session = await getSession();
    if (!session || !session.company_id) {
        redirect('/login');
    }

    const client = await pool.connect();

    try {
        const [companyRes, plansRes, gatewaysRes, invoicesRes] = await Promise.all([
            client.query('SELECT id, plan, subscription_status, subscription_ends_at FROM companies WHERE id = $1', [session.company_id]),
            client.query('SELECT * FROM subscription_plans WHERE is_active = true ORDER BY price ASC'),
            client.query('SELECT name as gateway_name, api_key as public_key FROM payment_gateways WHERE is_active = true'),
            client.query('SELECT * FROM invoices WHERE company_id = $1 ORDER BY created_at DESC LIMIT 10', [session.company_id])
        ]);

        if (companyRes.rowCount === 0) {
            redirect('/login'); // Should not happen
        }

        const company = companyRes.rows[0];
        const gateways = gatewaysRes.rows;

        const plans = plansRes.rows.map(plan => ({
            ...plan,
            created_at: plan.created_at ? new Date(plan.created_at).toISOString() : null,
            updated_at: plan.updated_at ? new Date(plan.updated_at).toISOString() : null
        }));

        const invoices = invoicesRes.rows.map(inv => ({
            ...inv,
            period_start: new Date(inv.period_start).toISOString(),
            period_end: new Date(inv.period_end).toISOString(),
            created_at: new Date(inv.created_at).toISOString()
        }));

        const serializedCompany = {
            ...company,
            subscription_ends_at: company.subscription_ends_at ? new Date(company.subscription_ends_at).toISOString() : null
        };

        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
                    <p className="text-slate-500 mt-1">Manage your plan, payments, and invoices.</p>
                </div>
                <BillingPortal company={serializedCompany} plans={plans} gateways={gateways} invoices={invoices} />
            </div>
        );

    } finally {
        client.release();
    }
}
