'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const tiers = [
    {
        name: 'Free Trial',
        price: 'Free',
        duration: '7 Days',
        features: [
            'Full Platform Access',
            'Up to 5 Users',
            'Unlimited Projects',
            'Basic Support'
        ],
        cta: 'Start Free Trial',
        primary: false,
        action: '/signup' // Standard signup flow starts trial
    },
    {
        name: 'Starter',
        price: '$49', // Placeholder
        duration: '/month',
        features: [
            'Up to 10 Users',
            'Advanced Analytics',
            'Email Support',
            'Custom Domain'
        ],
        cta: 'Buy Now',
        primary: true,
        action: '#' // Placeholder for payment link
    },
    {
        name: 'Business',
        price: '$99', // Placeholder
        duration: '/month',
        features: [
            'Unlimited Users',
            'Priority Support',
            'White Labeling',
            'API Access'
        ],
        cta: 'Buy Now',
        primary: false,
        action: '#' // Placeholder
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        duration: '',
        features: [
            'Dedicated Account Manager',
            'SLA Guarantee',
            'On-premise Deployment',
            'Custom Integrations'
        ],
        cta: 'Contact Sales',
        primary: false,
        action: 'mailto:sales@siteboard.com'
    }
];

export default function PricingSection() {
    const router = useRouter();

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden" id="pricing">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Choose the perfect plan for your real estate business. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col ${tier.primary
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105 z-10'
                                    : 'bg-white text-slate-900 border-slate-200'
                                }`}
                        >
                            <div className="mb-6">
                                <h3 className={`text-lg font-semibold mb-2 ${tier.primary ? 'text-blue-300' : 'text-slate-900'}`}>{tier.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    {tier.duration && <span className={`text-sm ${tier.primary ? 'text-slate-400' : 'text-slate-500'}`}>{tier.duration}</span>}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm">
                                        <svg
                                            className={`w-5 h-5 flex-shrink-0 ${tier.primary ? 'text-blue-400' : 'text-green-500'}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className={tier.primary ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => tier.action.startsWith('http') || tier.action.startsWith('mailto') ? window.location.href = tier.action : router.push(tier.action)}
                                className={`w-full py-3 rounded-xl font-semibold transition-colors ${tier.primary
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                    }`}
                            >
                                {tier.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500">
                        Need a custom solution for multiple branches? <a href="mailto:sales@siteboard.com" className="text-blue-600 font-semibold hover:underline">Contact our sales team</a>
                    </p>
                </div>
            </div>
        </section>
    );
}
