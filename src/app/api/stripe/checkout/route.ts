import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getStripeClient } from '@/lib/stripe';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || !session.company_id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await request.json();

    const client = await pool.connect();
    try {
        // 1. Fetch Plan
        const planRes = await client.query('SELECT * FROM subscription_plans WHERE id = $1', [planId]);
        if (planRes.rowCount === 0) {
            return NextResponse.json({ error: 'Invalid Plan' }, { status: 400 });
        }
        const plan = planRes.rows[0];

        // 2. Init Stripe
        const stripe = await getStripeClient();

        // 3. Create Checkout Session
        // Note: For subscriptions, usually you create a Product/Price in Stripe first.
        // However, we can create on-the-fly prices with `price_data`.
        // BUT recurring prices require a Product ID or creating one.
        // For simplicity, we'll try `mode: 'subscription'` with `price_data` containing `recurring`.

        const origin = request.headers.get('origin') || 'http://localhost:3000';

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: (plan.currency || 'usd').toLowerCase(),
                        product_data: {
                            name: `${plan.name} Plan (${plan.duration})`,
                            description: `Subscription for ${plan.name} plan`,
                        },
                        unit_amount: Math.round(parseFloat(plan.price) * 100), // in cents
                        recurring: {
                            interval: plan.duration === 'yearly' ? 'year' : 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/billing?canceled=true`,
            metadata: {
                companyId: session.company_id.toString(),
                planId: plan.id.toString(),
                type: 'subscription_activation'
            },
            client_reference_id: session.company_id.toString(),
        });

        return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });

    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
