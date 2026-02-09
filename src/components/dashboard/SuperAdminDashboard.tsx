"use client";

import Link from 'next/link';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

// Mock Data for Revenue Chart (Keep for now until time-series data is ready)
const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 7000 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 8000 },
];

// Mock Data for Subscription Plans (Can replace with real if we fetch it)
const subscriptionData = [
    { name: 'Basic', count: 12 },
    { name: 'Pro', count: 25 },
    { name: 'Enterprise', count: 8 },
];

export default function SuperAdminDashboard({ stats: initialStats }: { stats: any }) {
    const [stats, setStats] = useState(initialStats || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch fresh stats on mount
        const fetchStats = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (e) {
                console.error("Failed to fetch admin stats", e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const companies = stats?.companies || { total: 0, active: 0, expired: 0, trial: 0 };
    const gateways = stats?.gateways || { stripe: false, razorpay: false };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-100/50">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage subscriptions, companies, and platform health.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                        <span className={`w-2 h-2 rounded-full ${gateways.stripe ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        Stripe
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                        <span className={`w-2 h-2 rounded-full ${gateways.razorpay ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        Razorpay
                    </div>
                </div>
            </div>

            {/* Primary KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Revenue"
                    value={`$${(stats?.revenue || 0).toLocaleString()}`}
                    trend="+12.5%"
                    trendColor="text-emerald-600"
                    icon={<svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <KPICard
                    title="Active Companies"
                    value={companies.active}
                    subValue={`Total: ${companies.total}`}
                    trend={`+${companies.trial} on Trial`}
                    trendColor="text-blue-600"
                    icon={<svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                />
                <KPICard
                    title="Expired / Cancelled"
                    value={companies.expired}
                    trend="Needs Attention"
                    trendColor="text-orange-600"
                    icon={<svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <KPICard
                    title="Total Users"
                    value={stats?.users || 0}
                    trend="+8% growth"
                    trendColor="text-blue-600"
                    icon={<svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
            </div>

            {/* Analytical Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Revenue Growth</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Plan Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subscriptionData} layout="vertical" barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/companies" className="block">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-blue-500 h-full">
                        <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">Manage Companies</h3>
                        <p className="text-xs text-slate-500">Create, edit, or suspend builder accounts.</p>
                    </div>
                </Link>
                <Link href="/dashboard/admin/plans" className="block">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-emerald-500 h-full">
                        <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors">Subscription Plans</h3>
                        <p className="text-xs text-slate-500">Configure pricing tiers and features.</p>
                    </div>
                </Link>
                <Link href="/dashboard/admin/gateways" className="block">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-purple-500 h-full">
                        <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-purple-600 transition-colors">Platform Settings</h3>
                        <p className="text-xs text-slate-500">Global configurations and API keys.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

function KPICard({ title, value, subValue, icon, trend, trendColor }: { title: string, value: string | number, subValue?: string, icon: any, trend?: string, trendColor?: string }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:translate-y-[-2px] hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start z-10">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100 transition-colors">{icon}</div>
            </div>
            <div className="z-10">
                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
                </div>
                {(trend || subValue) && (
                    <div className="flex items-center gap-2 mt-1">
                        {trend && <p className={`text-xs font-medium ${trendColor || 'text-slate-400'}`}>{trend}</p>}
                        {subValue && <p className="text-xs text-slate-400">{subValue}</p>}
                    </div>
                )}
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full opacity-50 group-hover:scale-110 transition-transform z-0"></div>
        </div>
    );
}
