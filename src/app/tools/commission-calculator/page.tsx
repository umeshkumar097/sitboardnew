import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommissionCalculator from '@/components/tools/CommissionCalculator';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Real Estate Commission Calculator India 2025 | Brokerage & TDS Calculator | SiteBoard',
    description: 'Calculate real estate brokerage commission and TDS deduction (Section 194H) for property deals in India. Free tool for real estate agents, brokers, and channel partners.',
    keywords: 'real estate commission calculator india, brokerage commission calculator, property dealer commission calculator, tds on brokerage 194h, real estate agent commission india, channel partner commission calculator',
    openGraph: {
        title: 'Brokerage Commission & TDS Calculator for Real Estate India 2025',
        description: 'Calculate exact net commission after TDS for property deals. Free tool for real estate agents and channel partners by SiteBoard.',
        type: 'website',
        url: 'https://siteboard.in/tools/commission-calculator',
    },
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What is the standard real estate commission in India?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The standard real estate brokerage commission in India is typically 1–2% of the property deal value for both the buyer and seller side. So a broker may earn 2% total (1% from buyer + 1% from seller) on a completed deal. Some channel partners earn 3–4% on new project launches.'
            }
        },
        {
            '@type': 'Question',
            name: 'What is TDS on real estate commission in India (Section 194H)?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Under Section 194H of the Income Tax Act, TDS of 5% is deducted on commission or brokerage paid to a resident individual or HUF if the total commission in a financial year exceeds ₹15,000. If the recipient does not provide a valid PAN, TDS increases to 20%.'
            }
        },
        {
            '@type': 'Question',
            name: 'How do I calculate net commission after TDS?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Net Commission = Gross Commission – TDS Amount. Example: If property value is ₹1 Crore and commission is 2%, gross commission = ₹2,00,000. TDS at 5% = ₹10,000. Net receivable = ₹1,90,000.'
            }
        },
        {
            '@type': 'Question',
            name: 'Is GST applicable on real estate commission in India?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, GST at 18% is applicable on real estate brokerage/commission services if the broker is registered under GST. This is separate from TDS. The builder or buyer pays GST on top of the commission amount.'
            }
        },
        {
            '@type': 'Question',
            name: 'What is channel partner commission in real estate?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Channel partners are real estate agents or firms that refer buyers to builders. Channel partner commission is typically 2–4% of the property cost and is paid by the builder/developer upon booking or registration. TDS under 194H applies.'
            }
        }
    ]
};

export default function CommissionCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Script
                id="schema-commission-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Brokerage Commission Calculator India 2025
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Calculate your real estate commission earnings and exact TDS deduction (Section 194H) in seconds.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 flex-1">
                <div className="max-w-4xl mx-auto">
                    <CommissionCalculator />

                    {/* TDS Section */}
                    <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">TDS on Real Estate Commission — Section 194H Explained</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            In India, TDS (Tax Deducted at Source) under <strong>Section 194H</strong> of the Income Tax Act is applicable on commission or brokerage payments made to real estate agents, channel partners, and brokers.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-700">5%</div>
                                <div className="text-sm text-slate-600 mt-1">Standard TDS Rate</div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-yellow-700">₹15,000</div>
                                <div className="text-sm text-slate-600 mt-1">Annual Threshold</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-red-700">20%</div>
                                <div className="text-sm text-slate-600 mt-1">Without PAN Card</div>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">How Real Estate Commission Works in India</h3>
                        <ul className="space-y-2 text-slate-600 list-disc list-inside">
                            <li>Standard commission: <strong>1–2% of property value</strong> (can be 3–4% for channel partners on new projects)</li>
                            <li>Commission is typically paid by the <strong>builder/seller</strong> to the agent on successful deal closure</li>
                            <li>TDS is deducted by the payer (builder) before paying the agent</li>
                            <li>GST at <strong>18%</strong> applies separately on commission if the agent is GST-registered</li>
                            <li>Net receivable = Gross Commission − TDS (− GST if applicable)</li>
                        </ul>
                    </div>

                    {/* FAQ */}
                    <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqSchema.mainEntity.map((faq, i) => (
                                <details key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                                    <summary className="p-4 font-semibold cursor-pointer bg-slate-50 hover:bg-slate-100">
                                        {faq.name}
                                    </summary>
                                    <div className="p-4 text-slate-600 leading-relaxed">
                                        {faq.acceptedAnswer.text}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <h3 className="text-xl font-bold mb-4">More Free Real Estate Tools</h3>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/tools/emi-calculator" className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                                🧮 EMI Calculator
                            </Link>
                            <Link href="/tools/stamp-duty-calculator" className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                                🏛️ Stamp Duty Calculator
                            </Link>
                            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                                Explore SiteBoard CRM →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
