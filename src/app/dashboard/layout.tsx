import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import pool from '@/lib/db';
import DashboardLayoutClient from './DashboardLayoutClient';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    // Subscription Check
    if (session.role !== 'super_admin') {
        const headersList = await headers();
        const pathname = headersList.get('x-pathname') || '';

        // Allow access to settings, billing, and the expired page itself to prevent loops
        const allowedPaths = ['/dashboard/subscription-expired', '/dashboard/settings', '/dashboard/billing'];
        const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path));

        if (!isAllowedPath && session.company_id) {
            const client = await pool.connect();
            try {
                const res = await client.query('SELECT plan, subscription_status, trial_ends_at, subscription_ends_at FROM companies WHERE id = $1', [session.company_id]);

                if ((res.rowCount || 0) > 0) {
                    const company = res.rows[0];
                    const now = new Date();

                    const isTrial = company.plan === 'trial';
                    const trialEnded = company.trial_ends_at && new Date(company.trial_ends_at) < now;
                    // For paid plans, check subscription end date OR status
                    // Note: If subscription_ends_at is NULL for a paid plan, we assume it's active/lifetime unless status says otherwise? 
                    // Let's rely on status mostly, but check date if present.
                    // Actually, let's correspond to the "Active" logic.

                    const subEnded = company.subscription_ends_at && new Date(company.subscription_ends_at) < now;
                    const statusInactive = company.subscription_status !== 'active';

                    // Logic: Expired if (Trial & Ended) OR (Not Trial & (Status Inactive OR Ends At Passed))
                    // Simplified:
                    let isExpired = false;

                    if (isTrial) {
                        if (trialEnded) isExpired = true;
                    } else {
                        // Paid plan
                        if (statusInactive) isExpired = true;
                        if (subEnded) isExpired = true;
                    }

                    if (isExpired) {
                        redirect('/dashboard/subscription-expired');
                    }
                }
            } finally {
                client.release();
            }
        }
    }

    return (
        <DashboardLayoutClient user={session}>
            {children}
        </DashboardLayoutClient>
    );
}
