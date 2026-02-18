'use client';

import { useState, useEffect } from 'react';

export default function CommissionCalculator() {
    const [saleValue, setSaleValue] = useState<number>(5000000); // 50 Lakhs
    const [commissionPercent, setCommissionPercent] = useState<number>(2); // 2%
    const [tdsPercent, setTdsPercent] = useState<number>(5); // 5% TDS

    const [commissionAmount, setCommissionAmount] = useState<number>(0);
    const [tdsAmount, setTdsAmount] = useState<number>(0);
    const [netReceivable, setNetReceivable] = useState<number>(0);

    useEffect(() => {
        calculateCommission();
    }, [saleValue, commissionPercent, tdsPercent]);

    const calculateCommission = () => {
        const comm = (saleValue * commissionPercent) / 100;
        const tds = (comm * tdsPercent) / 100;
        const net = comm - tds;

        setCommissionAmount(Math.round(comm));
        setTdsAmount(Math.round(tds));
        setNetReceivable(Math.round(net));
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
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Real Estate Commission Calculator</h2>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Property Sale Value</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                            <input
                                type="number"
                                value={saleValue}
                                onChange={(e) => setSaleValue(Number(e.target.value))}
                                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <input
                            type="range"
                            min="100000"
                            max="100000000"
                            step="100000"
                            value={saleValue}
                            onChange={(e) => setSaleValue(Number(e.target.value))}
                            className="w-full mt-2 accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>1L</span>
                            <span>10Cr</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Commission Percentage (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={commissionPercent}
                                step="0.1"
                                onChange={(e) => setCommissionPercent(Number(e.target.value))}
                                className="w-full pl-4 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={commissionPercent}
                            onChange={(e) => setCommissionPercent(Number(e.target.value))}
                            className="w-full mt-2 accent-blue-600"
                        />
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-yellow-800">TDS Deduction (%)</label>
                            <input
                                type="number"
                                value={tdsPercent}
                                onChange={(e) => setTdsPercent(Number(e.target.value))}
                                className="w-16 pl-2 py-1 text-sm border border-yellow-300 rounded text-center focus:outline-none"
                            />
                        </div>
                        <p className="text-xs text-yellow-700">
                            Subject to Section 194H of Income Tax Act. Usually 5% for commission above ₹15,000.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                            <span className="text-slate-600 font-medium">Total Commission</span>
                            <span className="text-xl font-bold text-slate-800">{formatCurrency(commissionAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-200 text-red-500">
                            <span className="font-medium">Less: TDS ({tdsPercent}%)</span>
                            <span className="font-bold">-{formatCurrency(tdsAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-lg font-bold text-green-700">Net Receivable</span>
                            <span className="text-3xl font-bold text-green-700">{formatCurrency(netReceivable)}</span>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                        <p className="text-sm text-blue-800 font-medium mb-2">Track all your commissions automatically with SiteBoard.</p>
                        <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition">
                            Explore CRM Config
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
