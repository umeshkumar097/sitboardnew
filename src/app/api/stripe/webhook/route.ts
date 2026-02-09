import { NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';
import { activateSubscription } from '@/lib/subscription';

export async function POST(request: Request) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('Missing STRIPE_WEBHOOK_SECRET');
        return NextResponse.json({ error: 'Webhook Secret Missing' }, { status: 500 });
    }

    let event;
    const stripe = await getStripeClient();

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;

        // Metadata check
        const { companyId, planId, type } = session.metadata || {};

        if (type === 'subscription_activation' && companyId && planId) {
            try {
                const result = await activateSubscription({
                    companyId: parseInt(companyId),
                    planId: parseInt(planId),
                    gateway: 'stripe',
                    transactionId: session.payment_intent as string || session.id, // In subscription mode, payment_intent might be in invoice? session.id is reliable for checkout.
                    amount: session.amount_total ? session.amount_total / 100 : 0, // Convert cents to dollars
                    currency: session.currency?.toUpperCase() || 'USD'
                });
                console.log('Subscription activated via webhook:', result);
            } catch (e) {
                console.error('Failed to activate subscription via webhook:', e);
                return NextResponse.json({ error: 'Activation Failed' }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ received: true });
}
// Disable body parsing by Next.js if needed? In App Router request.text() handles raw body.
