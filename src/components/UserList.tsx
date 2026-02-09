"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserList({ users, companyId, currentUserRole }: { users: any[], companyId: number, currentUserRole: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: currentUserRole === 'company_admin' ? 'agent' : 'company_admin'
    });

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newUser, companyId })
            });
            if (res.ok) {
                setShowAddForm(false);
                setNewUser({ name: '', email: '', password: '', role: currentUserRole === 'company_admin' ? 'agent' : 'company_admin' });
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create user');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors"
                >
                    {showAddForm ? 'Cancel' : '+ Add User'}
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold mb-4">New User Details</h3>
                    <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={newUser.name}
                                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                required
                                type="email"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={newUser.email}
                                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input
                                required
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Secure password"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg bg-white"
                                value={newUser.role}
                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                {currentUserRole === 'super_admin' ? (
                                    <>
                                        <option value="company_admin">Company Admin (Full Access)</option>
                                        <option value="agent">Agent (View Only)</option>
                                    </>
                                ) : (
                                    <option value="agent">Agent (View Only)</option>
                                )}
                            </select>
                        </div>
                        <div className="md:col-span-2 pt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Email</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Role</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${user.role === 'company_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    No users found for this company.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
