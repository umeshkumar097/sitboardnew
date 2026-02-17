"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'agent', // default
        password: '', // default empty
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/admin/users/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        role: data.role || 'agent',
                        password: '', // Don't fetch password
                    });
                } else {
                    alert('User not found');
                    router.push('/dashboard/users');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('User updated successfully');
                router.push('/dashboard/users');
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Edit User</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

                {/* Name */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                </div>

                {/* Role */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white"
                    >
                        <option value="super_admin">Super Admin</option>
                        <option value="company_admin">Company Admin</option>
                        <option value="agent">Agent</option>
                    </select>
                </div>

                {/* Password - Optional */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">New Password <span className="text-gray-400 font-normal">(Leave blank to keep current)</span></label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex justify-end pt-4 space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/users')}
                        className="px-6 py-2.5 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Update User'}
                    </button>
                </div>
            </form>
        </div>
    );
}
