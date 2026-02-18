'use client';

import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EMICalculator() {
    const [amount, setAmount] = useState<number>(5000000);
    const [rate, setRate] = useState<number>(8.5);
    const [tenure, setTenure] = useState<number>(20);

    const [emi, setEmi] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPayment, setTotalPayment] = useState<number>(0);

    useEffect(() => {
        calculateEMI();
    }, [amount, rate, tenure]);

    const calculateEMI = () => {
        const principal = amount;
        const r = rate / 12 / 100;
        const n = tenure * 12;

        const emiValue = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayable = emiValue * n;
        const interest = totalPayable - principal;

        setEmi(Math.round(emiValue));
        setTotalInterest(Math.round(interest));
        setTotalPayment(Math.round(totalPayable));
    };

    const data = {
        labels: ['Principal Amount', 'Total Interest'],
        datasets: [
            {
                data: [amount, totalInterest],
                backgroundColor: ['#3b82f6', '#93c5fd'],
                borderColor: ['#2563eb', '#60a5fa'],
                borderWidth: 1,
            },
        ],
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
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Home Loan EMI Calculator</h2>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Loan Amount</label>
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
                            max="100000000"
                            step="100000"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full mt-2 accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>1L</span>
                            <span>10Cr</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Interest Rate (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={rate}
                                step="0.1"
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="w-full pl-4 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full mt-2 accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>1%</span>
                            <span>20%</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Loan Tenure (Years)</label>
                        <input
                            type="number"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full pl-4 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full mt-2 accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>1 Year</span>
                            <span>30 Years</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-xl">
                    <div className="w-48 h-48 mb-6">
                        <Doughnut data={data} options={{ plugins: { legend: { display: false } } }} />
                    </div>

                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                            <span className="text-slate-500 text-sm">Monthly EMI</span>
                            <span className="text-2xl font-bold text-blue-600">{formatCurrency(emi)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-dashed border-slate-300 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-slate-600">Principal Amount</span>
                            </div>
                            <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-dashed border-slate-300 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                                <span className="text-slate-600">Total Interest</span>
                            </div>
                            <span className="font-medium">{formatCurrency(totalInterest)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2">
                            <span className="text-slate-900 font-bold">Total Payable</span>
                            <span className="font-bold text-slate-900">{formatCurrency(totalPayment)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
