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

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/enquiries', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) {
                setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this enquiry?')) return;
        try {
            const res = await fetch(`/api/admin/enquiries?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setEnquiries(prev => prev.filter(e => e.id !== id));
            } else {
                alert('Failed to delete enquiry');
            }
        } catch (error) {
            console.error('Error deleting enquiry:', error);
            alert('Error deleting enquiry');
        }
    };

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
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Actions</th>
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
                                    <td className="px-6 py-4">
                                        <select
                                            value={enquiry.status || 'new'}
                                            onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                                            className={`text-xs font-medium rounded-full px-2 py-1 border-0 ring-1 ring-inset focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer ${enquiry.status === 'completed' || enquiry.status === 'resolved'
                                                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                                    : enquiry.status === 'contacted'
                                                        ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                                                        : 'bg-slate-50 text-slate-700 ring-slate-600/20'
                                                }`}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(enquiry.id)}
                                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                            title="Delete Enquiry"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {enquiries.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
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
