import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EMICalculator from '@/components/tools/EMICalculator';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Home Loan EMI Calculator 2025 – Free Housing Loan Calculator India | SiteBoard',
    description: 'Calculate your home loan, housing loan, or flat purchase EMI instantly. Free online EMI calculator for India with interest breakdown, amortization chart, and tips to reduce EMI.',
    keywords: 'home loan emi calculator, housing loan calculator india, emi calculator flat purchase, home loan calculator 2025, monthly emi calculator india, siteboard tools',
    openGraph: {
        title: 'Free Home Loan EMI Calculator India 2025',
        description: 'Calculate exact monthly EMI, total interest, and repayment amount for any home loan. Free tool by SiteBoard.',
        type: 'website',
        url: 'https://siteboard.in/tools/emi-calculator',
    },
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How is home loan EMI calculated in India?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'EMI is calculated using the formula: EMI = P × r × (1+r)^n / ((1+r)^n – 1), where P is the principal loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the number of monthly installments.'
            }
        },
        {
            '@type': 'Question',
            name: 'What is the EMI for a 50 lakh home loan for 20 years at 8.5%?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'For a ₹50 lakh home loan at 8.5% interest rate for 20 years (240 months), the EMI would be approximately ₹43,391 per month. Total repayment would be ₹1,04,13,840, and total interest paid would be ₹54,13,840.'
            }
        },
        {
            '@type': 'Question',
            name: 'What is the current home loan interest rate in India in 2025?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'As of 2025, home loan interest rates in India range from 8.35% to 9.5% per annum depending on the lender and borrower profile. SBI offers rates starting at 8.50%, HDFC at 8.75%, and private banks typically at 8.50–9.50%.'
            }
        },
        {
            '@type': 'Question',
            name: 'How can I reduce my home loan EMI?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You can reduce your home loan EMI by: (1) Making a larger down payment to reduce principal, (2) Choosing a longer loan tenure, (3) Negotiating a lower interest rate with your bank, (4) Making periodic prepayments to reduce the outstanding principal.'
            }
        },
        {
            '@type': 'Question',
            name: 'Is stamp duty included in home loan?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Generally, banks do not include stamp duty and registration charges in the home loan. These must be paid separately. However, some lenders offer top-up loans that cover stamp duty. Use our Stamp Duty Calculator to estimate these charges.'
            }
        }
    ]
};

export default function EMICalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Script
                id="schema-emi-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Home Loan EMI Calculator India 2025
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Free housing loan EMI calculator. Calculate monthly installments, total interest, and amortization for any home loan in seconds.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 flex-1">
                <div className="max-w-4xl mx-auto">
                    <EMICalculator />

                    {/* How EMI Works Section */}
                    <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">How is Home Loan EMI Calculated?</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            EMI (Equated Monthly Installment) is calculated using the standard formula:<br />
                            <code className="bg-slate-100 px-3 py-1 rounded text-sm font-mono block mt-2 mb-4">EMI = P × r × (1+r)^n / ((1+r)^n – 1)</code>
                            Where <strong>P</strong> = Principal loan amount, <strong>r</strong> = Monthly interest rate (Annual Rate ÷ 12 ÷ 100), <strong>n</strong> = Loan tenure in months.
                        </p>
                        <h3 className="text-lg font-bold mb-3">Factors That Affect Your EMI</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <div className="text-2xl mb-2">💰</div>
                                <h4 className="font-semibold mb-1">Loan Amount</h4>
                                <p className="text-sm text-slate-600">Higher principal = higher EMI. Make a larger down payment to reduce your EMI burden.</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <div className="text-2xl mb-2">📊</div>
                                <h4 className="font-semibold mb-1">Interest Rate</h4>
                                <p className="text-sm text-slate-600">Even 0.5% difference in rate significantly impacts total interest. Compare lenders carefully.</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <div className="text-2xl mb-2">📅</div>
                                <h4 className="font-semibold mb-1">Loan Tenure</h4>
                                <p className="text-sm text-slate-600">Longer tenure = lower EMI but more total interest. Shorter tenure = higher EMI but saves lakhs.</p>
                            </div>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-8 bg-green-50 border border-green-200 p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-green-900 mb-3">💡 Tips to Reduce Your Home Loan EMI</h2>
                        <ul className="space-y-2 text-green-800">
                            <li>✓ Pay a larger down payment (20–30% reduces your principal significantly)</li>
                            <li>✓ Make annual prepayments — even ₹1 lakh/year can save ₹10L+ in interest</li>
                            <li>✓ Compare and negotiate interest rates across banks before finalising</li>
                            <li>✓ Opt for a shorter tenure if your income allows — save lakhs in interest</li>
                        </ul>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-10 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
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
                            <Link href="/tools/stamp-duty-calculator" className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                                🏛️ Stamp Duty Calculator
                            </Link>
                            <Link href="/tools/commission-calculator" className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                                🤝 Commission Calculator
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
