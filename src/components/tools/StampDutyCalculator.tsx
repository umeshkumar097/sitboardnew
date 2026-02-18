'use client';

import { useState, useEffect } from 'react';
import { STAMP_DUTY_DATA, GENDERS, StateData } from '@/lib/stamp-duty-data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
    preSelectedState?: string;
}

export default function StampDutyCalculator({ preSelectedState }: Props) {
    const router = useRouter();
    const [amount, setAmount] = useState<number>(5000000);
    const [selectedStateSlug, setSelectedStateSlug] = useState<string>(preSelectedState || 'maharashtra');
    const [gender, setGender] = useState<'male' | 'female' | 'joint'>('male');

    // Results
    const [stampDutyAmount, setStampDutyAmount] = useState<number>(0);
    const [registrationAmount, setRegistrationAmount] = useState<number>(0);
    const [cessAmount, setCessAmount] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const currentState: StateData = STAMP_DUTY_DATA[selectedStateSlug];

    useEffect(() => {
        calculate();
    }, [amount, selectedStateSlug, gender]);

    // Update URL when state changes, if not pre-selected on a dynamic page
    // Actually, good UX might be to just recalculate, or push to new route if on main page
    const handleStateChange = (slug: string) => {
        setSelectedStateSlug(slug);
        // Optional: Redirect to that state's page for better SEO permanence? 
        // For now, let's keep it as a calculator app feel.
    };

    const calculate = () => {
        if (!currentState) return;

        // 1. Stamp Duty
        const dutyRate = currentState.stampDuty[gender];
        let duty = (amount * dutyRate) / 100;

        // 2. Cess / Surcharge
        let cess = 0;
        if (currentState.cess) {
            // Check remarks or assumptions: Usually Cess is % of Stamp Duty, or % of Property?
            // Convention: In Karnataka/Rajasthan it's % of Stamp Duty. In Maharashtra (Metro cess) it's % of Property value added to rate.
            // Let's standardise based on data structure comments or simple logic.
            // For now: 
            // KA/RJ (High cess like 10-20%) -> % of Duty
            // MH/TS (Low cess like 1%) -> % of Property added to rate (already usually accounted in text but let's separate)

            // Simplified logic for this tool:
            // If cess > 5, assume it's percent of Duty
            // If cess <= 5, assume it's percent of Property Value added

            if (currentState.cess > 5) {
                cess = (duty * currentState.cess) / 100;
            } else {
                cess = (amount * currentState.cess) / 100;
            }
        }

        // 3. Registration Fee
        let reg = (amount * currentState.registrationFee) / 100;
        if (currentState.registrationMax && reg > currentState.registrationMax) {
            reg = currentState.registrationMax;
        }

        // Haryana specific fixed logic simulation if needed, but current data uses % or max.

        setStampDutyAmount(Math.round(duty));
        setRegistrationAmount(Math.round(reg));
        setCessAmount(Math.round(cess));
        setTotalAmount(Math.round(duty + reg + cess));
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {currentState.name} Stamp Duty Calculator
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Property Market Value</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <input
                            type="range"
                            min="100000"
                            max="50000000"
                            step="100000"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full mt-2 accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>10L</span>
                            <span>5Cr</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                        <select
                            value={selectedStateSlug}
                            onChange={(e) => handleStateChange(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            {Object.values(STAMP_DUTY_DATA).map(state => (
                                <option key={state.slug} value={state.slug}>{state.name}</option>
                            ))}
                        </select>
                        {!preSelectedState && (
                            <p className="text-xs text-slate-500 mt-1">Select state to see specific rates.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Owner Gender</label>
                        <div className="flex gap-4">
                            {GENDERS.map(g => (
                                <label key={g.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g.value}
                                        checked={gender === g.value}
                                        onChange={(e) => setGender(e.target.value as any)}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-sm text-slate-700">{g.label}</span>
                                </label>
                            ))}
                        </div>
                        {gender === 'female' && currentState.stampDuty.female < currentState.stampDuty.male && (
                            <p className="text-xs text-green-600 mt-1">🎉 Lower rates applicable for female owners in {currentState.name}!</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-200">
                            <span className="text-slate-600 font-medium">Stamp Duty ({currentState.stampDuty[gender]}%)</span>
                            <span className="font-bold text-slate-700">{formatCurrency(stampDutyAmount)}</span>
                        </div>
                        {cessAmount > 0 && (
                            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-200">
                                <span className="text-slate-600 font-medium">Cess / Surcharge</span>
                                <span className="font-bold text-slate-700">{formatCurrency(cessAmount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-200">
                            <span className="text-slate-600 font-medium">Registration Fee</span>
                            <span className="font-bold text-slate-700">{formatCurrency(registrationAmount)}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-lg font-bold text-blue-900">Total Government Charges</span>
                            <span className="text-2xl font-bold text-blue-900">{formatCurrency(totalAmount)}</span>
                        </div>
                    </div>

                    {currentState.remarks && (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                            <strong>Note:</strong> {currentState.remarks}
                        </div>
                    )}

                    {!preSelectedState && (
                        <div className="text-center text-xs text-slate-400">
                            Looking for specific state info? <Link href={`/tools/stamp-duty-calculator/${selectedStateSlug}`} className="text-blue-500 hover:underline">Go to {currentState.name} Page</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
