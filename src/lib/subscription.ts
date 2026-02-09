import pool from '@/lib/db';
import { addMonths, addYears } from 'date-fns';

/**
 * Activates a subscription for a company after successful payment.
 */
export async function activateSubscription({
    companyId,
    planId,
    gateway,
    transactionId,
    amount,
    currency = 'USD'
}: {
    companyId: number;
    planId: number;
    gateway: 'stripe' | 'razorpay';
    transactionId: string;
    amount: number;
    currency?: string;
}) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Fetch Plan Details
        const planRes = await client.query('SELECT * FROM subscription_plans WHERE id = $1', [planId]);
        if (planRes.rowCount === 0) throw new Error('Plan not found');
        const plan = planRes.rows[0];

        // 2. Calculate Dates
        const now = new Date();
        let subscriptionEndsAt = now;

        if (plan.duration === 'monthly') {
            subscriptionEndsAt = addMonths(now, 1);
        } else if (plan.duration === 'yearly') {
            subscriptionEndsAt = addYears(now, 1);
        }

        // 3. Update Company
        // Set plan, subscription_status, subscription_ends_at
        // Also update usage limits? Plan features are stored in `features` JSONB.
        // The middleware/logic uses `companies.plan` column. I should probably store the plan ID or name there.
        // The existing `companies` table has `plan` as VARCHAR likely (e.g. 'trial', 'pro').
        // Let's store the plan name for backward compatibility or update schema to use plan_id?
        // For now, let's store plan.name lowercased as the plan identifier, or just store the name.

        await client.query(`
            UPDATE companies 
            SET 
                plan = $1,
                subscription_status = 'active',
                subscription_ends_at = $2,
                updated_at = NOW()
            WHERE id = $3
        `, [plan.name.toLowerCase(), subscriptionEndsAt, companyId]);

        // 4. Create Payment Record
        const paymentRes = await client.query(`
            INSERT INTO payments (company_id, gateway, transaction_id, amount, currency, status)
            VALUES ($1, $2, $3, $4, $5, 'success')
            RETURNING id
        `, [companyId, gateway, transactionId, amount, currency]);
        const paymentId = paymentRes.rows[0].id;

        // 5. Generate Invoice
        // Format: INV-YYYYMMDD-XXX
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const invoiceNumber = `INV-${dateStr}-${randomSuffix}`;

        await client.query(`
            INSERT INTO invoices (
                company_id, 
                invoice_number, 
                amount, 
                plan_name, 
                period_start, 
                period_end, 
                status, 
                payment_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, 'Paid', $7)
        `, [
            companyId,
            invoiceNumber,
            amount,
            plan.name,
            now,
            subscriptionEndsAt,
            paymentId
        ]);

        await client.query('COMMIT');
        return { success: true, subscriptionEndsAt };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Subscription activation failed:', error);
        throw error;
    } finally {
        client.release();
    }
}
