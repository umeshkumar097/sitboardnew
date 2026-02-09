import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getRazorpayClient } from '@/lib/razorpay';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || !session.company_id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, currency } = await request.json();

    const client = await pool.connect();
    try {
        // 1. Fetch Plan
        const planRes = await client.query('SELECT * FROM subscription_plans WHERE id = $1', [planId]);
        if (planRes.rowCount === 0) {
            return NextResponse.json({ error: 'Invalid Plan' }, { status: 400 });
        }
        const plan = planRes.rows[0];

        // 2. Init Razorpay
        const razorpay = await getRazorpayClient();

        // 3. Create Order
        // Amount must be in subunits (paise)
        // Convert plan price (USD?) to INR if needed?
        // The plan has `currency` column. If USD, we might need conversion or just charge in USD if Razorpay supports it (international).
        // For SiteBoard (Indian real estate), plan should ideally be in INR. 
        // But `subscription_plans` defaults to 'USD'.
        // If plan is USD, let's assume 1 USD = 83 INR roughly, or just use the price as is if currency is INR.
        // User requested dynamic conversion component earlier.
        // For robustness, let's assume plan currency is what we charge. Razorpay supports international.
        // If currency is 'USD', amount is in cents? No, Razorpay expects smallest currency unit.
        // USD -> cents. INR -> paise.

        const currencyCode = (plan.currency || 'INR').toUpperCase();
        let amount = parseFloat(plan.price);

        if (currencyCode === 'INR') {
            amount = Math.round(amount * 100); // paise
        } else {
            amount = Math.round(amount * 100); // cents for USD
        }

        const options = {
            amount: amount,
            currency: currencyCode,
            receipt: `rcpt_${session.company_id}_${Date.now()}`,
            notes: {
                companyId: session.company_id.toString(),
                planId: plan.id.toString(),
                description: `Subscription for ${plan.name} plan`
            }
        };

        const order = await razorpay.orders.create(options);

        // Fetch public key for frontend
        const keyRes = await client.query("SELECT public_key FROM payment_settings WHERE gateway_name = 'razorpay' AND is_enabled = true");
        const publicKey = keyRes.rows[0]?.public_key;

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: publicKey,
        });

    } catch (error: any) {
        console.error('Razorpay Order Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
