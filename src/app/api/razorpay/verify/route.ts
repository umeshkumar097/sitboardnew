import { NextResponse } from 'next/server';
import crypto from 'crypto';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || !session.company_id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = await req.json();

    const client = await pool.connect();

    try {
        // 1. Get Razorpay Secret
        const gatewayRes = await client.query(
            "SELECT secret_key FROM payment_gateways WHERE name = 'razorpay' AND is_active = true"
        );

        if (gatewayRes.rowCount === 0) {
            return NextResponse.json({ error: 'Razorpay is not enabled' }, { status: 400 });
        }
        const razorpaySecret = gatewayRes.rows[0].secret_key;

        // 2. Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", razorpaySecret)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // 3. Payment Verified - Proceed to Update Subscription
        await client.query('BEGIN');

        // Fetch Plan (again to be safe, or trust passed ID)
        const planRes = await client.query('SELECT * FROM subscription_plans WHERE id = $1', [planId]);
        if (planRes.rowCount === 0) throw new Error('Invalid Plan ID');
        const plan = planRes.rows[0];

        const startDate = new Date();
        const endDate = new Date();

        if (plan.duration === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan.duration === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            // Fallback
            endDate.setMonth(endDate.getMonth() + 1);
        }

        // Update Company
        await client.query(`
            UPDATE companies 
            SET 
                plan = $1, 
                subscription_status = 'active',
                subscription_ends_at = $2,
                updated_at = NOW()
            WHERE id = $3
        `, [plan.name.toLowerCase(), endDate, session.company_id]);

        // Create Invoice
        const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

        await client.query(`
            INSERT INTO invoices (company_id, invoice_number, amount, plan_name, period_start, period_end, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'Paid')
        `, [session.company_id, invoiceNumber, plan.price, plan.name, startDate, endDate]);

        await client.query('COMMIT');

        return NextResponse.json({ success: true });

        // Send WhatsApp Notification (Async - don't block response)
        const companyId = session?.company_id;
        (async () => {
            try {
                const { sendWhatsAppMessage } = await import('@/lib/whatsapp');
                const adminPhone = process.env.ADMIN_PHONE;
                if (adminPhone && companyId) {
                    await sendWhatsAppMessage(adminPhone, 'payment_received', [
                        { type: 'text', text: plan.name },
                        { type: 'text', text: plan.price },
                        { type: 'text', text: companyId.toString() }
                    ]);
                }
            } catch (e) {
                console.error('WhatsApp Notification Error:', e);
            }
        })();

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error verifying Razorpay payment:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
