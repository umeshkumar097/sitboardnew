import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || !session.company_id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();

    const client = await pool.connect();

    try {
        // 1. Get Stripe Credentials
        const gatewayRes = await client.query(
            "SELECT secret_key FROM payment_gateways WHERE name = 'stripe' AND is_active = true"
        );

        if (gatewayRes.rowCount === 0) {
            return NextResponse.json({ error: 'Stripe is not enabled' }, { status: 400 });
        }

        const stripeSecret = gatewayRes.rows[0].secret_key;
        if (!stripeSecret) {
            return NextResponse.json({ error: 'Stripe configuration incomplete' }, { status: 500 });
        }

        // 2. Get Plan Details
        const planRes = await client.query('SELECT * FROM subscription_plans WHERE id = $1', [planId]);
        if (planRes.rowCount === 0) {
            return NextResponse.json({ error: 'Invalid Plan' }, { status: 400 });
        }
        const plan = planRes.rows[0];

        // 3. Initialize Stripe
        const stripe = new Stripe(stripeSecret, {
            apiVersion: '2026-01-28.clover' as any, // Forcing specific version required by type def
        });

        // 4. Create Checkout Session
        // Note: In a real app, you'd want to handle webhooks to fulfill the order. 
        // For simplicity, we are just creating the session. 
        // You would typically pass client_reference_id or metadata to track.

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: (plan.currency || 'usd').toLowerCase(),
                        product_data: {
                            name: `Subscription: ${plan.name}`,
                            description: `Access to ${plan.features?.max_projects === -1 ? 'Unlimited' : plan.features?.max_projects} projects`,
                        },
                        unit_amount: Math.round(parseFloat(plan.price) * 100), // cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment', // or 'subscription' if using Stripe Products/Prices
            success_url: `${req.headers.get('origin')}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/dashboard/billing?canceled=true`,
            metadata: {
                company_id: session.company_id.toString(),
                plan_id: plan.id.toString(),
                plan_name: plan.name
            }
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error: any) {
        console.error('Error creating Stripe session:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
