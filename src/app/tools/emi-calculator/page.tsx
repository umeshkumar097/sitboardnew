import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EMICalculator from '@/components/tools/EMICalculator';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Free Home Loan EMI Calculator | Real Estate India | SiteBoard',
    description: 'Calculate your home loan EMI instantly with our free online tool. Plan your real estate investment smarter with SiteBoard.',
    keywords: 'home loan emi calculator, real estate emi calculator, housing loan calculator india, siteboard tools',
};

export default function EMICalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Home Loan EMI Calculator
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Plan your dream home purchase with precise financial insights.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 flex-1">
                <div className="max-w-4xl mx-auto">
                    <EMICalculator />

                    <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="text-4xl mb-4">📉</div>
                            <h3 className="font-bold text-lg mb-2">Reduce Interest</h3>
                            <p className="text-sm text-slate-600">Opt for a shorter tenure to significantly reduce total interest payable.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="text-4xl mb-4">💰</div>
                            <h3 className="font-bold text-lg mb-2">Smart Pre-payment</h3>
                            <p className="text-sm text-slate-600">Paying just one extra EMI per year can reduce your loan term by years.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="text-4xl mb-4">🏠</div>
                            <h3 className="font-bold text-lg mb-2">Loan Eligibility</h3>
                            <p className="text-sm text-slate-600">Banks typically fund 80-90% of the property value. Ensure you have the down payment.</p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <h3 className="text-xl font-bold mb-4">More Free Tools</h3>
                        <div className="inline-flex gap-4">
                            <Link href="/tools/commission-calculator" className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                                Commission Calculator
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
