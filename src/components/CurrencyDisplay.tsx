'use client';

import { useState, useEffect } from 'react';

export default function CurrencyDisplay({ amountUSD, className = "" }: { amountUSD: number, className?: string }) {
    const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
    const [conversionRate, setConversionRate] = useState<number>(83.5); // Default fallback

    useEffect(() => {
        // Attempt to fetch real-time rate, fallback to 83.5 if fails
        const fetchRate = async () => {
            try {
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                if (res.ok) {
                    const data = await res.json();
                    if (data.rates && data.rates.INR) {
                        setConversionRate(data.rates.INR);
                    }
                }
            } catch (e) {
                console.warn('Failed to fetch currency rate, using fallback.');
            }
        };
        fetchRate();
    }, []);

    const displayAmount = currency === 'USD' ? amountUSD : (amountUSD * conversionRate);

    return (
        <div className={`flex flex-col items-end ${className}`}>
            <span className="font-bold">
                {currency === 'USD' ? '$' : '₹'}{displayAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <button
                onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-medium underline print:hidden mt-1 cursor-pointer"
            >
                Switch to {currency === 'USD' ? 'INR (₹)' : 'USD ($)'}
            </button>
            <span className="text-[10px] text-slate-400 print:block hidden">
                ({currency})
            </span>
        </div>
    );
}
