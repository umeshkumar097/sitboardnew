"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LeadList({ leads }: { leads: any[] }) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        budget: '',
        status: 'new',
        notes: ''
    });

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone.includes(searchTerm)
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowForm(false);
                setFormData({ name: '', phone: '', email: '', budget: '', status: 'new', notes: '' });
                router.refresh(); // Refresh page to show new lead
            } else {
                alert("Failed to add lead");
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search leads..."
                    className="px-4 py-2 border rounded-lg w-full max-w-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={() => setShowForm(true)}
                    className="ml-4 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors shadow-lg"
                >
                    + Add Lead
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold mb-4">Add New Lead</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            required
                            placeholder="Name"
                            className="px-4 py-2 border rounded-lg"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            required
                            placeholder="Phone"
                            className="px-4 py-2 border rounded-lg"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <input
                            placeholder="Email (Optional)"
                            type="email"
                            className="px-4 py-2 border rounded-lg"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            placeholder="Budget (₹)"
                            type="number"
                            className="px-4 py-2 border rounded-lg"
                            value={formData.budget}
                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                        />

                        <select
                            className="px-4 py-2 border rounded-lg bg-white"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="interested">Interested</option>
                            <option value="booked">Booked</option>
                            <option value="lost">Lost</option>
                        </select>

                        <textarea
                            placeholder="Notes..."
                            className="col-span-1 md:col-span-2 px-4 py-2 border rounded-lg"
                            rows={3}
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />


                        <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Save Lead
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {leads.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No leads found. Add your first lead!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Name</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Budget</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Phone</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {lead.name}
                                            {lead.email && <div className="text-xs text-gray-400 font-normal">{lead.email}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={lead.status} />
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {lead.budget ? `₹${Number(lead.budget).toLocaleString()}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                                            {lead.phone}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        new: 'bg-blue-100 text-blue-700',
        contacted: 'bg-yellow-100 text-yellow-700',
        interested: 'bg-purple-100 text-purple-700',
        booked: 'bg-green-100 text-green-700',
        lost: 'bg-gray-100 text-gray-500',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colors[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}
