import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || !session.company_id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { planId } = await req.json();

        // 1. Get Razorpay Credentials & Plan Details
        const client = await pool.connect();
        let razorpayKey = null;
        let razorpaySecret = null;
        let plan = null;

        try {
            const gatewayRes = await client.query(
                "SELECT api_key, secret_key FROM payment_gateways WHERE name = 'razorpay' AND is_active = true"
            );

            if (gatewayRes.rowCount === 0) {
                return NextResponse.json({ error: 'Razorpay is not enabled' }, { status: 400 });
            }

            razorpayKey = gatewayRes.rows[0].api_key;
            razorpaySecret = gatewayRes.rows[0].secret_key;

            const planRes = await client.query('SELECT * FROM subscription_plans WHERE id = $1', [planId]);
            if (planRes.rowCount === 0) {
                return NextResponse.json({ error: 'Invalid Plan' }, { status: 400 });
            }
            plan = planRes.rows[0];

        } finally {
            client.release();
        }

        if (!razorpayKey || !razorpaySecret) {
            return NextResponse.json({ error: 'Razorpay configuration incomplete' }, { status: 500 });
        }

        // 2. Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: razorpayKey,
            key_secret: razorpaySecret,
        });

        // 3. Create Order
        // Amount is in smallest currency unit (paise for INR)
        // Assuming plan.price is in full units (e.g. 29.00)
        const amount = Math.round(parseFloat(plan.price) * 100);
        const currency = plan.currency || 'USD'; // Default to USD if not set, or INR

        const options = {
            amount: amount,
            currency: currency,
            receipt: `rcpt_${Date.now()}_${session.company_id}`,
            notes: {
                company_id: session.company_id,
                plan_id: plan.id,
                plan_name: plan.name
            }
        };

        const order = await razorpay.orders.create(options);

        // 4. Return Order Details
        return NextResponse.json({
            key: razorpayKey,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            name: plan.name,
            description: `Subscription for ${plan.name}`
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
