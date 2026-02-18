import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StampDutyCalculator from '@/components/tools/StampDutyCalculator';
import { STAMP_DUTY_DATA } from '@/lib/stamp-duty-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { state: slug } = await params;
    const stateData = STAMP_DUTY_DATA[slug];

    if (!stateData) {
        return {
            title: 'Stamp Duty Calculator | SiteBoard'
        };
    }

    return {
        title: `${stateData.name} Stamp Duty & Registration Charges Calculator 2025`,
        description: `Calculate updated Stamp Duty and Registration charges for ${stateData.name}. Current Rates: ${stateData.stampDuty.male}% for men, ${stateData.stampDuty.female}% for women.`,
        keywords: `${stateData.name} stamp duty calculator, ${stateData.name} property registration charges, ${slug} registry charges 2025`,
    };
}

export async function generateStaticParams() {
    return Object.keys(STAMP_DUTY_DATA).map((slug) => ({
        state: slug,
    }));
}

export default async function StateStampDutyPage({ params }: Props) {
    const { state: slug } = await params;
    const stateData = STAMP_DUTY_DATA[slug];

    if (!stateData) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        {stateData.name} Stamp Duty Calculator
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Current Stamp Duty Rates: {stateData.stampDuty.male}% | Registration Fee: {stateData.registrationFee}%
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 flex-1">
                <div className="max-w-4xl mx-auto">
                    <StampDutyCalculator preSelectedState={slug} />

                    <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">About Property Registration in {stateData.name}</h2>
                        <div className="prose prose-slate max-w-none">
                            <p>
                                When purchasing a property in <strong>{stateData.name}</strong>, buyers are required to pay Stamp Duty and Registration charges to the state government.
                                These charges are calculated based on the <strong>Market Value</strong> of the property (Ready Reckoner Rate) or the Agreement Value, whichever is higher.
                            </p>

                            <h3 className="text-lg font-bold mt-4">Current Rates in {stateData.name} (2025)</h3>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li><strong>Stamp Duty (Male):</strong> {stateData.stampDuty.male}%</li>
                                <li><strong>Stamp Duty (Female):</strong> {stateData.stampDuty.female}%</li>
                                <li><strong>Stamp Duty (Joint):</strong> {stateData.stampDuty.joint}%</li>
                                <li><strong>Registration Fee:</strong> {stateData.registrationFee}% {stateData.registrationMax ? `(Capped at ₹${stateData.registrationMax})` : ''}</li>
                                {stateData.cess ? <li><strong>Additional Cess:</strong> {stateData.cess}% (Applicable as per location)</li> : null}
                            </ul>

                            {stateData.remarks && (
                                <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400 mt-4 text-sm">
                                    <strong>Note:</strong> {stateData.remarks}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/tools/stamp-duty-calculator" className="text-blue-600 font-medium hover:underline">
                            ← View All States
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
