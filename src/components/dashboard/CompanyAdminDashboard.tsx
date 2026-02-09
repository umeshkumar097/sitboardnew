"use client";

import Link from 'next/link';

export default function CompanyAdminDashboard({ stats, name }: { stats: any, name: string }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Builder Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Welcome back, <span className="font-semibold text-slate-700">{name}</span>. Here is your inventory status.
                    </p>
                </div>
                <Link href="/dashboard/projects/new" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-blue-900/10">
                    + New Project
                </Link>
            </div>

            {/* Health Check Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-500/20">
                    <p className="text-blue-100 uppercase text-xs font-bold tracking-wider mb-2">Total Inventory</p>
                    <p className="text-4xl font-extrabold">{stats.plots}</p>
                    <p className="text-blue-100 text-sm mt-2 font-medium">{stats.projects} Active Projects</p>
                </div>

                <KPICard
                    title="Available for Sale"
                    value={stats.available}
                    icon={<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                    trend="Ready to book"
                    trendColor="text-green-600"
                    bgColor="bg-green-50/50"
                />
                <KPICard
                    title="Booked (Pending)"
                    value={stats.booked}
                    icon={<span className="w-2 h-2 rounded-full bg-yellow-400"></span>}
                    trend="Awaiting clearance"
                    trendColor="text-yellow-600"
                    bgColor="bg-yellow-50/50"
                />
                <KPICard
                    title="Sold Out"
                    value={stats.sold}
                    icon={<span className="w-2 h-2 rounded-full bg-red-500"></span>}
                    trend="Completed revenue"
                    trendColor="text-red-600"
                    bgColor="bg-red-50/50"
                />
            </div>

            {/* Quick Actions & Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Quick Links */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-semibold text-slate-800">Operational Tools</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/dashboard/projects" className="group p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all bg-white flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-blue-600">Inventory Map</h4>
                                <p className="text-sm text-gray-500">View and edit plot grids</p>
                            </div>
                        </Link>

                        <Link href="/dashboard/agents" className="group p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all bg-white flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-purple-600">Sales Team</h4>
                                <p className="text-sm text-gray-500">Manage agents & access</p>
                            </div>
                        </Link>

                        <div className="group p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all bg-white flex items-center gap-4 cursor-pointer">
                            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-green-600">Approvals</h4>
                                <p className="text-sm text-gray-500">Approve bookings (Coming Soon)</p>
                            </div>
                        </div>

                        <div className="group p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all bg-white flex items-center gap-4 cursor-pointer">
                            <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-orange-600">Reports</h4>
                                <p className="text-sm text-gray-500">Sales Analytics (Coming Soon)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Recent Leads/Activity */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">U</div>
                                <div>
                                    <p className="text-sm text-slate-800"><span className="font-medium">Agent John</span> booked Plot 10{i}</p>
                                    <p className="text-xs text-gray-400">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                        <div className="pt-2 text-center">
                            <button className="text-sm text-blue-600 font-medium hover:underline">View All Log</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, icon, trend, trendColor, bgColor }: { title: string, value: string | number, icon: any, trend?: string, trendColor?: string, bgColor?: string }) {
    return (
        <div className={`p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow relative overflow-hidden group ${bgColor || 'bg-white'}`}>
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
        </div>
    );
}
