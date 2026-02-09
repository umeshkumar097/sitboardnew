'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Plan {
    id: number;
    name: string;
    price: string;
    currency: string;
    duration: string;
    features: any;
}

interface Gateway {
    gateway_name: string;
    public_key: string;
}

interface Invoice {
    id: number;
    invoice_number: string;
    amount: string;
    plan_name: string;
    period_start: string; // ISO string
    period_end: string;
    status: string;
    created_at: string;
}

interface Company {
    id: number;
    plan: string;
    subscription_status: string;
    subscription_ends_at: string;
}

export default function BillingPortal({ company, plans, gateways, invoices = [] }: { company: Company, plans: Plan[], gateways: Gateway[], invoices?: Invoice[] }) {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(false);

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const stripeGateway = gateways.find(g => g.gateway_name === 'stripe');
    const razorpayGateway = gateways.find(g => g.gateway_name === 'razorpay');

    const handleStripeCheckout = async (plan: Plan) => {
        setLoading(true);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.id })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Checkout failed');
            }
        } catch (e) {
            console.error(e);
            alert('Error initiating checkout');
        } finally {
            setLoading(false);
        }
    };

    const handleRazorpayCheckout = async (plan: Plan) => {
        setLoading(true);
        try {
            // 1. Create Order
            const orderRes = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.id })
            });
            const orderData = await orderRes.json();

            if (orderData.error) {
                alert(orderData.error);
                setLoading(false);
                return;
            }

            // 2. Open Modal
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'SiteBoard',
                description: `Subscription for ${plan.name}`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch('/api/razorpay/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                companyId: company.id,
                                planId: plan.id
                            })
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            alert('Payment Successful! Subscription Active.');
                            router.refresh();
                        } else {
                            alert('Payment verification failed.');
                        }
                    } catch (e) {
                        alert('Verification error');
                    }
                },
                prefill: {
                    name: "", // Can fill from user session if passed
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#0f172a" // Slate-900
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert(response.error.description);
            });
            rzp.open();

        } catch (e) {
            console.error(e);
            alert('Error initiating Razorpay checkout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Current Status */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Current Subscription</h2>
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-sm text-slate-500">Plan</p>
                        <p className="font-semibold text-slate-900 capitalize">{company.plan || 'No Plan'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${company.subscription_status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {company.subscription_status || 'Inactive'}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Valid Until</p>
                        <p className="font-semibold text-slate-900">
                            {company.subscription_ends_at ? new Date(company.subscription_ends_at).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Plans List */}
            <h2 className="text-xl font-bold text-slate-800">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className={`bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col ${selectedPlan?.id === plan.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                                <span className="text-sm text-slate-500">/ {plan.duration}</span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm text-slate-600">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                {plan.features?.max_projects === -1 ? 'Unlimited' : plan.features?.max_projects} Projects
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-600">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                {plan.features?.max_plots === -1 ? 'Unlimited' : plan.features?.max_plots} Plots
                            </li>
                        </ul>

                        <div className="space-y-2">
                            {stripeGateway && (
                                <button
                                    onClick={() => handleStripeCheckout(plan)}
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {loading ? 'Processing...' : 'Pay with Stripe'}
                                </button>
                            )}
                            {razorpayGateway && (
                                <button
                                    onClick={() => handleRazorpayCheckout(plan)}
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Pay with Razorpay'}
                                </button>
                            )}
                            {!stripeGateway && !razorpayGateway && (
                                <p className="text-center text-sm text-red-500">No payment gateways enabled.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Billing History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-semibold">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Invoice #</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.length > 0 ? (
                                invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">{new Date(inv.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">#{inv.invoice_number}</td>
                                        <td className="px-6 py-4 capitalize">{inv.plan_name}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">${inv.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 capitalize">
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/invoices/${inv.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                        No invoices found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
