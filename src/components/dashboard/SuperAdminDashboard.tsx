"use client";

import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

// Mock Data for Revenue Chart
const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 7000 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 8000 },
];

// Mock Data for Subscription Plans
const subscriptionData = [
    { name: 'Basic', count: 12 },
    { name: 'Pro', count: 25 },
    { name: 'Enterprise', count: 8 },
];

export default function SuperAdminDashboard({ stats }: { stats: any }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage subscriptions, companies, and platform health.</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors">
                    Export Report
                </button>
            </div>

            {/* Primary KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Revenue"
                    value="$42,500"
                    trend="+12.5%"
                    trendColor="text-green-600"
                    icon={<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <KPICard
                    title="Active Subscriptions"
                    value={stats.companiesCount}
                    trend="+4 this month"
                    icon={<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                />
                <KPICard
                    title="Total Users"
                    value={stats.usersCount}
                    trend="+8% growth"
                    trendColor="text-blue-600"
                    icon={<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <KPICard
                    title="Churn Rate"
                    value="1.2%"
                    trend="-0.5%"
                    trendColor="text-green-600"
                    icon={<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                />
            </div>

            {/* Analytical Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Growth</h3>
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
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Plan Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subscriptionData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fill: '#64748b', fontSize: 14, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-slate-800 mb-2">Manage Companies</h3>
                    <p className="text-sm text-gray-500 mb-4">Create, edit, or suspend builder accounts.</p>
                    <a href="/dashboard/companies" className="text-blue-600 text-sm font-medium hover:underline">View Companies &rarr;</a>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-slate-800 mb-2">Subscription Plans</h3>
                    <p className="text-sm text-gray-500 mb-4">Configure pricing tiers and features.</p>
                    <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Edit Plans &rarr;</a>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-slate-800 mb-2">Platform Settings</h3>
                    <p className="text-sm text-gray-500 mb-4">Global configurations and API keys.</p>
                    <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Settings &rarr;</a>
                </div>
            </div>

        </div>
    );
}

function KPICard({ title, value, icon, trend, trendColor }: { title: string, value: string | number, icon: any, trend?: string, trendColor?: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start z-10">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
                <div className="text-gray-400 group-hover:scale-110 transition-transform">{icon}</div>
            </div>
            <div className="z-10">
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
                {trend && (
                    <p className={`text-xs font-medium mt-1 ${trendColor || 'text-gray-400'}`}>
                        {trend}
                    </p>
                )}
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-50 rounded-full opacity-0 group-hover:opacity-50 transition-opacity z-0"></div>
        </div>
    );
}
