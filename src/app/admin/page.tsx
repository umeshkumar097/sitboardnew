'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Lead {
    id: number;
    name: string;
    email: string | null;
    company_name: string | null;
    city: string | null;
    whatsapp: string;
    created_at: string;
    status: string;
}

const STATUS_OPTIONS = [
    'New', 'Demo Sent', 'Demo Scheduled', 'Interested', 'Not Interested', 'Converted'
];

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filtering & Sorting
    const [statusFilter, setStatusFilter] = useState('All');

    // Modal State
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [demoForm, setDemoForm] = useState({
        message: "Hi, I'd like to invite you to a personal demo of SiteBoard.",
        link: "https://meet.google.com/xxx-xxxx-xxx",
        method: 'whatsapp' // 'email' or 'whatsapp'
    });
    const [demoStatus, setDemoStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const router = useRouter();

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leads');
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setLeads(data.leads || []);
        } catch (err) {
            setError('Could not load leads. Check connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, newStatus: string) => {
        // Optimistic update
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));

        try {
            const res = await fetch(`/api/admin/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Failed to update');
        } catch (err) {
            console.error(err);
            fetchLeads(); // Revert on error
            alert('Failed to update status');
        }
    };

    const handleDemoSend = async () => {
        if (!selectedLead) return;
        setDemoStatus('sending');

        try {
            if (demoForm.method === 'email') {
                const res = await fetch(`/api/admin/leads/${selectedLead.id}/send-demo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'send_demo',
                        method: 'email',
                        message: demoForm.message,
                        link: demoForm.link
                    })
                });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to send email');
                }
            } else {
                // WhatsApp Logic: Open API Link
                const text = encodeURIComponent(`${demoForm.message}\n\nLink: ${demoForm.link}`);
                const phone = selectedLead.whatsapp.replace(/\D/g, '');
                window.open(`https://wa.me/${phone}?text=${text}`, '_blank');

                // Update status in backend manually for record
                await fetch(`/api/admin/leads/${selectedLead.id}/send-demo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'record_demo_sent', method: 'whatsapp' })
                });
            }

            // Update local state
            setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: 'Demo Sent' } : l));
            setDemoStatus('success');
            setTimeout(() => {
                setDemoStatus('idle');
                setShowDemoModal(false);
                setSelectedLead(null);
            }, 1500);

        } catch (err: any) {
            setDemoStatus('error');
            alert(err.message);
        }
    };

    const handleExport = () => {
        // Generate CSV
        const headers = ['ID', 'Name', 'Email', 'Company', 'City', 'WhatsApp', 'Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...leads.map(l => [
                l.id,
                `"${l.name}"`,
                l.email || '',
                `"${l.company_name || ''}"`,
                `"${l.city || ''}"`,
                `"${l.whatsapp}"`,
                l.status,
                new Date(l.created_at).toISOString().split('T')[0]
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `siteboard-leads-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredLeads = statusFilter === 'All'
        ? leads
        : leads.filter(l => l.status === statusFilter);

    // Metrics
    const totalLeads = leads.length;
    const newLeadsToday = leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length;
    const demosSent = leads.filter(l => l.status === 'Demo Sent' || l.status === 'Demo Scheduled').length;
    const lastLeadTime = leads.length > 0 ? new Date(leads[0].created_at).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'N/A';

    if (loading && leads.length === 0) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading CRM...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
                    <span className="font-bold text-lg text-slate-900">SiteBoard CRM</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export CSV
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                    </button>
                </div>
            </nav>

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Leads" value={totalLeads} icon={<UsersIcon />} />
                    <StatCard title="New Today" value={newLeadsToday} intent="success" icon={<ClockIcon />} />
                    <StatCard title="Demos Sent" value={demosSent} intent="primary" icon={<SendIcon />} />
                    <StatCard title="Latest Activity" value={lastLeadTime} valueSize="sm" icon={<ActivityIcon />} />
                </div>

                {/* Filters & Content */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Leads Management</h2>
                            <p className="text-sm text-slate-500 mt-1">Manage and track your landing page signups.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-600">Filter By:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                                <option value="All">All Statuses</option>
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm w-20">ID</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Contact</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Company</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Date</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">#{lead.id}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium text-slate-900">{lead.name}</div>
                                            <div className="block text-slate-500 text-xs mt-0.5">{lead.email}</div>
                                            <div className="block text-slate-500 text-xs">{lead.whatsapp}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="text-slate-900">{lead.company_name || '-'}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{lead.city || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                className="px-2 py-1 text-xs font-medium rounded border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            >
                                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                                onClick={() => { setSelectedLead(lead); setShowDemoModal(true); }}
                                            >
                                                Send Demo
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredLeads.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            No leads found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showDemoModal && selectedLead && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-semibold text-slate-900 text-lg">Send Demo Invitation</h3>
                            <button onClick={() => setShowDemoModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {demoStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Message Sent Successfully!</h3>
                                    <p className="text-slate-500 mb-6">The status has been updated to "Demo Sent".</p>
                                    <button onClick={() => setShowDemoModal(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-colors">
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 mb-3">Send via:</p>
                                        <div className="flex gap-4">
                                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${demoForm.method === 'whatsapp' ? 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                                                <input type="radio" className="sr-only" checked={demoForm.method === 'whatsapp'} onChange={() => setDemoForm({ ...demoForm, method: 'whatsapp' })} />
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                                <span className="font-semibold text-sm">WhatsApp</span>
                                            </label>

                                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${demoForm.method === 'email' ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50'} ${!selectedLead.email ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                <input type="radio" className="sr-only" checked={demoForm.method === 'email'} onChange={() => setDemoForm({ ...demoForm, method: 'email' })} disabled={!selectedLead.email} />
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                <span className="font-semibold text-sm">Email</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Link</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={demoForm.link}
                                            onChange={(e) => setDemoForm({ ...demoForm, link: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={demoForm.message}
                                            onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            onClick={handleDemoSend}
                                            disabled={demoStatus === 'sending'}
                                            className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-black transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                                        >
                                            {demoStatus === 'sending' ? (
                                                <>
                                                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                                                    Sending...
                                                </>
                                            ) : 'Send Invitation'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, valueSize = 'lg', intent = 'default', icon }: { title: string, value: string | number, valueSize?: 'lg' | 'sm', intent?: 'default' | 'success' | 'primary', icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <div className={`font-bold text-slate-800 ${valueSize === 'lg' ? 'text-3xl' : 'text-xl'}`}>{value}</div>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${intent === 'success' ? 'bg-green-50 text-green-600' :
                    intent === 'primary' ? 'bg-blue-50 text-blue-600' :
                        'bg-slate-50 text-slate-600'
                }`}>
                {icon}
            </div>
        </div>
    );
}

// Simple Icons
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const SendIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const ActivityIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
