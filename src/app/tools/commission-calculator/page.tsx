import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommissionCalculator from '@/components/tools/CommissionCalculator';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Real Estate Commission Calculator | Brokerage TDS Calculator | SiteBoard',
    description: 'Calculate real estate brokerage commission and TDS deduction for property deals in India. Essential tool for channel partners and agents.',
    keywords: 'real estate commission calculator, brokerage calculator india, property dealer commission, tds on commission 194h',
};

export default function CommissionCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Brokerage Commission Calculator
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Instantly calculate your earnings and applicable TDS deductions.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 flex-1">
                <div className="max-w-4xl mx-auto">
                    <CommissionCalculator />

                    <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-8">
                        <h3 className="text-xl font-bold text-blue-900 mb-4">About TDS on Commission (Section 194H)</h3>
                        <p className="text-blue-800 mb-4 leading-relaxed">
                            In India, TDS (Tax Deducted at Source) under Section 194H is applicable on commission or brokerage payments.
                            The payer (builder/seller) must deduct TDS if the total commission paid to a resident individual/HUF exceeds ₹15,000 in a financial year.
                        </p>
                        <ul className="list-disc list-inside text-blue-800 space-y-2">
                            <li><strong>Standard Rate:</strong> 5% TDS.</li>
                            <li><strong>Limit:</strong> Applicable if commission &gt; ₹15,000/year.</li>
                            <li><strong>Requirement:</strong> Valid PAN card is mandatory, else TDS rate may be 20%.</li>
                        </ul>
                    </div>

                    <div className="mt-12 text-center">
                        <h3 className="text-xl font-bold mb-4">More Free Tools</h3>
                        <div className="inline-flex gap-4">
                            <Link href="/tools/emi-calculator" className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                                EMI Calculator
                            </Link>
                            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                                Go to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
