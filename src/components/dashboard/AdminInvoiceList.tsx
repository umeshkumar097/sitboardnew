'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Invoice {
    id: number;
    invoice_number: string;
    amount: string;
    plan_name: string;
    period_start: string;
    period_end: string;
    status: string;
    created_at: string;
    company_name: string;
}

export default function AdminInvoiceList() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch('/api/admin/invoices');
                if (res.ok) {
                    const data = await res.json();
                    setInvoices(data);
                }
            } catch (error) {
                console.error('Failed to fetch admin invoices', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading invoices...</div>;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Global Invoice History</h2>
                <div className="text-sm text-slate-500">Total: {invoices.length}</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-semibold">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Invoice #</th>
                            <th className="px-6 py-3">Company</th>
                            <th className="px-6 py-3">Plan</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoices.length > 0 ? (
                            invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">{new Date(inv.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{inv.invoice_number}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{inv.company_name}</td>
                                    <td className="px-6 py-4 capitalize">{inv.plan_name}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">${inv.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                                inv.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/invoices/${inv.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                                    No invoices found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
