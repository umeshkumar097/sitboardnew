'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlanManager() {
    const router = useRouter();
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any | null>(null);

    const [form, setForm] = useState({
        name: '',
        price: '',
        duration: 'monthly',
        features: { max_projects: '', max_plots: '' },
        is_active: true
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/admin/plans');
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (e) {
            console.error('Failed to fetch plans', e);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (plan: any) => {
        setEditingPlan(plan);
        setForm({
            name: plan.name,
            price: plan.price,
            duration: plan.duration,
            features: {
                max_projects: plan.features?.max_projects || '',
                max_plots: plan.features?.max_plots || ''
            },
            is_active: plan.is_active
        });
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingPlan(null);
        setForm({
            name: '',
            price: '',
            duration: 'monthly',
            features: { max_projects: '', max_plots: '' },
            is_active: true
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingPlan ? 'PUT' : 'POST';
        const url = editingPlan ? `/api/admin/plans/${editingPlan.id}` : '/api/admin/plans';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price),
                    features: {
                        max_projects: parseInt(form.features.max_projects) || -1,
                        max_plots: parseInt(form.features.max_plots) || -1
                    }
                })
            });

            if (res.ok) {
                setShowModal(false);
                fetchPlans();
                router.refresh();
            } else {
                alert('Failed to save plan');
            }
        } catch (e) {
            console.error(e);
            alert('Error saving plan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        try {
            const res = await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchPlans();
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete plan');
            }
        } catch (e) {
            console.error(e);
            alert('Error deleting plan');
        }
    };

    if (loading) return <div className="p-4 text-center">Loading plans...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Subscription Plans</h2>
                <button
                    onClick={handleCreate}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                >
                    + Create Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className={`bg-white rounded-xl border p-6 shadow-sm relative group overflow-hidden ${!plan.is_active ? 'opacity-60 border-dashed' : 'border-slate-200'}`}>
                        {!plan.is_active && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded">Inactive</div>
                        )}
                        <h3 className="font-bold text-lg text-slate-900">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mt-1 mb-4">
                            <span className="text-2xl font-bold text-slate-900">${plan.price}</span>
                            <span className="text-sm text-slate-500">/ {plan.duration}</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Projects</span>
                                <span className="font-medium">{plan.features.max_projects === -1 ? 'Unlimited' : plan.features.max_projects}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Plots</span>
                                <span className="font-medium">{plan.features.max_plots === -1 ? 'Unlimited' : plan.features.max_plots}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                            <button
                                onClick={() => handleEdit(plan)}
                                className="text-sm text-blue-600 font-medium hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(plan.id)}
                                className="text-sm text-red-600 font-medium hover:underline ml-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-900">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Plan Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Starter"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })}
                                        placeholder="29.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Billing Cycle</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg bg-white"
                                    value={form.duration}
                                    onChange={e => setForm({ ...form, duration: e.target.value })}
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Projects</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={form.features.max_projects}
                                        onChange={e => setForm({ ...form, features: { ...form.features, max_projects: e.target.value } })}
                                        placeholder="-1 for unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Plots</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={form.features.max_plots}
                                        onChange={e => setForm({ ...form, features: { ...form.features, max_plots: e.target.value } })}
                                        placeholder="-1 for unlimited"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="w-4 h-4 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
                                    checked={form.is_active}
                                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active (Visible to users)</label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-black transition-colors"
                                >
                                    {editingPlan ? 'Save Changes' : 'Create Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
