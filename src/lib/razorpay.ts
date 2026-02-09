import Razorpay from 'razorpay';
import pool from '@/lib/db';

export async function getRazorpayClient() {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT public_key, secret_key FROM payment_settings WHERE gateway_name = 'razorpay' AND is_enabled = true");
        if (res.rowCount === 0 || !res.rows[0].secret_key || !res.rows[0].public_key) {
            throw new Error('Razorpay is not enabled or configured.');
        }
        const { public_key, secret_key } = res.rows[0];

        return new Razorpay({
            key_id: public_key,
            key_secret: secret_key,
        });
    } finally {
        client.release();
    }
}
