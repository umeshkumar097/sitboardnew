"use client";

import Link from 'next/link';

export default function AgentDashboard({ projects, name }: { projects: any[], name: string }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-lg mx-auto md:max-w-none">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Hello <span className="font-semibold text-slate-700">{name}</span>. Select a project to start booking.
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
                        My Bookings
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Earnings
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid (Mobile Friendly) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">My Sales</p>
                    <p className="text-2xl font-bold text-slate-900">12</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Commission</p>
                    <p className="text-2xl font-bold text-green-600">₹4.2L</p>
                </div>
            </div>

            {/* Projects List - Card Style for Mobile/Tablet */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Assigned Projects</h2>
                {projects.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <p className="text-gray-500">No projects assigned yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="block group relative">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                                    {/* Image Placeholder */}
                                    <div className="h-40 bg-slate-100 relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold text-2xl uppercase tracking-widest">
                                            {project.name.substring(0, 2)}
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                            {project.location}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{project.available_plots} Left</span>
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${((project.total_plots - project.available_plots) / project.total_plots) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>{project.total_plots - project.available_plots} Sold</span>
                                                <span>{project.total_plots} Total</span>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <button className="w-full py-2 bg-slate-900 text-white font-medium rounded-lg text-sm hover:bg-black transition-colors">
                                                View Inventory Grid
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
