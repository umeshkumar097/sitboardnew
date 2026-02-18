import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StampDutyCalculator from '@/components/tools/StampDutyCalculator';
import { STAMP_DUTY_DATA } from '@/lib/stamp-duty-data';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Stamp Duty & Registration Charges Calculator India 2025 | SiteBoard',
    description: 'Calculate Stamp Duty and Registration charges for property registration in Maharashtra, UP, Delhi, Karnataka and all major Indian states.',
    keywords: 'stamp duty calculator india, property registration charges calculator, flat registration calculator, siteboard tools',
};

export default function StampDutyHubPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Stamp Duty Calculator India
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Calculate exact government charges for property registration across all Indian states.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 flex-1">
                <div className="max-w-4xl mx-auto">
                    <StampDutyCalculator />

                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">State-wise Stamp Duty Charges 2025</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Object.values(STAMP_DUTY_DATA).map(state => (
                                <Link
                                    key={state.slug}
                                    href={`/tools/stamp-duty-calculator/${state.slug}`}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition text-center"
                                >
                                    <div className="font-semibold text-slate-800">{state.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">Check Rates →</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 text-center border-t border-slate-200 pt-8">
                        <h3 className="text-xl font-bold mb-4">Other Utilities</h3>
                        <div className="inline-flex gap-4">
                            <Link href="/tools/emi-calculator" className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                                EMI Calculator
                            </Link>
                            <Link href="/tools/commission-calculator" className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                                Commission Calculator
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
