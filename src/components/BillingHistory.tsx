'use client';

import { useState, useEffect } from 'react';

export default function BillingHistory({ companyId }: { companyId: number }) {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch(`/api/companies/${companyId}/invoices`);
                if (res.ok) {
                    const data = await res.json();
                    setInvoices(data);
                }
            } catch (err) {
                console.error('Failed to fetch invoices', err);
            } finally {
                setLoading(false);
            }
        };

        if (companyId) fetchInvoices();
    }, [companyId]);

    if (loading) return <div className="text-sm text-slate-500">Loading billing history...</div>;

    if (invoices.length === 0) {
        return (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                <p className="text-slate-500 text-sm">No invoices found for this company.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Invoice #</th>
                        <th className="px-6 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider text-right">Receipt</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(invoice.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                {invoice.invoice_number}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                                {invoice.plan_name}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                ${invoice.amount}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {invoice.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <a
                                    href={`/invoices/${invoice.id}`}
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                >
                                    View
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
