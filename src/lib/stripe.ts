import Stripe from 'stripe';
import pool from '@/lib/db';

export async function getStripeClient() {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT secret_key FROM payment_settings WHERE gateway_name = 'stripe' AND is_enabled = true");
        if (res.rowCount === 0 || !res.rows[0].secret_key) {
            throw new Error('Stripe is not enabled or configured.');
        }
        const secretKey = res.rows[0].secret_key;
        return new Stripe(secretKey, {
            apiVersion: '2025-01-27.acacia', // Use latest or pinned version
            typescript: true,
        });
    } finally {
        client.release();
    }
}
