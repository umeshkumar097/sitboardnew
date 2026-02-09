'use client';

import { useState } from 'react';
import UserList from '@/components/UserList';
import BillingHistory from '@/components/BillingHistory';

export default function CompanyDetailView({ company, users, currentUserRole }: { company: any, users: any[], currentUserRole: string }) {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${company.subscription_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {company.subscription_status}
                    </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <span>Plan: <span className="font-medium text-slate-900 capitalize">{company.plan}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>City: <span className="font-medium text-slate-900">{company.city || 'N/A'}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Phone: <span className="font-medium text-slate-900">{company.phone || 'N/A'}</span></span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6">
                <nav className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'users' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Users ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'billing' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Billing & Invoices
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-4">Subscription Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Current Plan</span>
                                    <span className="font-medium capitalize">{company.plan}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Status</span>
                                    <span className={`font-medium capitalize ${company.subscription_status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{company.subscription_status}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Member Since</span>
                                    <span className="font-medium">{new Date(company.created_at).toLocaleDateString()}</span>
                                </div>
                                {company.trial_ends_at && (
                                    <div className="flex justify-between py-2 border-b border-slate-50">
                                        <span className="text-slate-500">Trial Ends</span>
                                        <span className="font-medium text-orange-600">{new Date(company.trial_ends_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {company.subscription_ends_at && (
                                    <div className="flex justify-between py-2 border-b border-slate-50">
                                        <span className="text-slate-500">Subscription Ends</span>
                                        <span className="font-medium">{new Date(company.subscription_ends_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-4">Company Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Total Users</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">{users.length}</p>
                                </div>
                                {/* Add more stats here later */}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <UserList users={users} companyId={company.id} currentUserRole={currentUserRole} />
                )}

                {activeTab === 'billing' && (
                    <BillingHistory companyId={company.id} />
                )}
            </div>
        </div>
    );
}
