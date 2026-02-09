'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CompanyList({ initialCompanies }: { initialCompanies: any[] }) {
    const router = useRouter();
    const [companies, setCompanies] = useState(initialCompanies);
    const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Edit Form State
    const [editForm, setEditForm] = useState<{
        plan: string;
        subscription_status: string;
        extend_trial_days: number;
        duration?: string;
        customEndDate?: string;
        amount?: number;
        generateReceipt?: boolean;
    }>({
        plan: 'trial',
        subscription_status: 'active',
        extend_trial_days: 0,
        duration: 'monthly',
        amount: 0,
        generateReceipt: false
    });

    const handleEditClick = (company: any) => {
        setSelectedCompany(company);
        setEditForm({
            plan: company.plan || 'trial',
            subscription_status: company.subscription_status || 'active',
            extend_trial_days: 0,
            duration: 'monthly',
            amount: 0,
            generateReceipt: false
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!selectedCompany) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/companies/${selectedCompany.id}/subscription`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                const updatedCompany = await res.json();
                // Update local state
                setCompanies(companies.map(c => c.id === selectedCompany.id ? { ...c, ...updatedCompany } : c));
                setShowEditModal(false);
                setSelectedCompany(null);
                router.refresh();
            } else {
                alert('Failed to update subscription');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating subscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Company Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Plan</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Users</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Created</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {companies.map((company) => (
                            <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{company.name}</div>
                                    <div className="text-xs text-slate-500">{company.city}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${company.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                                        company.plan === 'business' ? 'bg-blue-100 text-blue-700' :
                                            company.plan === 'starter' ? 'bg-indigo-100 text-indigo-700' :
                                                'bg-slate-100 text-slate-700'
                                        }`}>
                                        {company.plan || 'Trial'}
                                    </span>
                                    {company.plan === 'trial' && company.trial_ends_at && (
                                        <div className="text-xs text-orange-600 mt-1 font-medium">
                                            Ends: {new Date(company.trial_ends_at).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${company.subscription_status === 'active' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                        }`}>
                                        {company.subscription_status || 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-mono text-sm">{company.user_count}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(company.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-3 items-center">
                                        <Link href={`/dashboard/companies/${company.id}/users`} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                            Users
                                        </Link>
                                        <button
                                            onClick={() => handleEditClick(company)}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                        >
                                            Edit Plan
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedCompany && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-semibold text-slate-900">Edit Subscription: {selectedCompany.name}</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg bg-white"
                                    value={editForm.plan}
                                    onChange={e => setEditForm({ ...editForm, plan: e.target.value })}
                                >
                                    <option value="trial">Free Trial (7 Days)</option>
                                    <option value="starter">Starter Plan</option>
                                    <option value="business">Business Plan</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg bg-white"
                                    value={editForm.subscription_status}
                                    onChange={e => setEditForm({ ...editForm, subscription_status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {editForm.plan !== 'trial' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-lg bg-white"
                                            value={editForm.duration || 'monthly'}
                                            onChange={e => {
                                                const duration = e.target.value;
                                                let amount = 0;
                                                if (editForm.plan === 'starter') amount = duration === 'yearly' ? 290 : 29;
                                                if (editForm.plan === 'business') amount = duration === 'yearly' ? 790 : 79;
                                                if (editForm.plan === 'enterprise') amount = duration === 'yearly' ? 2990 : 299;

                                                setEditForm({ ...editForm, duration, amount });
                                            }}
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly (Save 20%)</option>
                                            <option value="custom">Custom Date</option>
                                        </select>
                                    </div>

                                    {editForm.duration === 'custom' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                className="w-full px-3 py-2 border rounded-lg"
                                                value={editForm.customEndDate || ''}
                                                onChange={e => setEditForm({ ...editForm, customEndDate: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount (Paid)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-slate-500">$</span>
                                            <input
                                                type="number"
                                                className="w-full pl-7 pr-3 py-2 border rounded-lg"
                                                value={editForm.amount || 0}
                                                onChange={e => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="genReceipt"
                                            className="w-4 h-4 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
                                            checked={editForm.generateReceipt || false}
                                            onChange={e => setEditForm({ ...editForm, generateReceipt: e.target.checked })}
                                        />
                                        <label htmlFor="genReceipt" className="text-sm text-slate-700 font-medium">Generate Invoice & Extend Subscription</label>
                                    </div>
                                </>
                            )}

                            {editForm.plan === 'trial' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Extend Trial (Days)</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Add days (e.g. 7)"
                                        value={editForm.extend_trial_days}
                                        onChange={e => setEditForm({ ...editForm, extend_trial_days: parseInt(e.target.value) || 0 })}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Leave 0 to keep current expiry.</p>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-black disabled:opacity-70"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
