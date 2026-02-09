'use client';

import { useEffect, useState } from 'react';

interface Enquiry {
    id: number;
    name: string;
    email: string;
    phone: string;
    company_name: string;
    plan_interest: string;
    message: string;
    created_at: string;
    status: string;
}

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const res = await fetch('/api/admin/enquiries');
                if (res.ok) {
                    const data = await res.json();
                    setEnquiries(data.enquiries || []);
                }
            } catch (error) {
                console.error('Failed to fetch enquiries:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEnquiries();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading requests...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quote Requests</h1>
                    <p className="text-slate-500 mt-1">Manage incoming pricing enquiries from the landing page.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Contact</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Company</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Interested In</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {enquiries.map((enquiry) => (
                                <tr key={enquiry.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                        {new Date(enquiry.created_at).toLocaleDateString()} <br />
                                        <span className="text-xs">{new Date(enquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{enquiry.name}</div>
                                        <div className="text-xs text-slate-500">{enquiry.email}</div>
                                        <div className="text-xs text-slate-500 font-mono">{enquiry.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {enquiry.company_name || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {enquiry.plan_interest || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={enquiry.message}>
                                        {enquiry.message || '-'}
                                    </td>
                                </tr>
                            ))}
                            {enquiries.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No enquiries found yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
