"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Gateway {
    id: number;
    name: string;
    api_key: string;
    api_endpoint: string;
    is_active: boolean;
    mode: string;
}

export default function GatewaysPage() {
    const router = useRouter();
    const [gateways, setGateways] = useState<Gateway[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);
    const [editForm, setEditForm] = useState({
        api_key: '',
        secret_key: '',
        webhook_secret: '',
        api_endpoint: '',
        mode: 'test',
        is_active: false,
    });

    const fetchGateways = async () => {
        try {
            const res = await fetch('/api/admin/gateways');
            if (res.ok) {
                const data = await res.json();
                setGateways(data);
            }
        } catch (error) {
            console.error('Error fetching gateways:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGateways();
    }, []);

    const handleEditClick = (gateway: Gateway) => {
        setSelectedGateway(gateway);
        setEditForm({
            api_key: gateway.api_key || '',
            secret_key: '', // Don't prefill secrets for security
            webhook_secret: '',
            api_endpoint: gateway.api_endpoint || '',
            mode: gateway.mode || 'test',
            is_active: gateway.is_active,
        });
        setOpenModal(true);
    };

    const handleToggle = async (gateway: Gateway) => {
        try {
            const res = await fetch('/api/admin/gateways', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: gateway.name,
                    is_active: !gateway.is_active,
                }),
            });
            if (res.ok) {
                fetchGateways();
            }
        } catch (error) {
            console.error('Error toggling gateway:', error);
        }
    };

    const handleSave = async () => {
        if (!selectedGateway) return;
        try {
            const res = await fetch('/api/admin/gateways', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: selectedGateway.name,
                    ...editForm
                }),
            });
            if (res.ok) {
                setOpenModal(false);
                fetchGateways();
            } else {
                alert('Failed to save gateway settings');
            }
        } catch (error) {
            console.error('Error saving gateway:', error);
        }
    };

    if (loading) return <div className="p-6">Loading gateways...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Payment Gateways</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gateways.map((gw) => (
                    <div key={gw.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold capitalize text-slate-900">{gw.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${gw.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {gw.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <button
                                onClick={() => handleEditClick(gw)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                Settings
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-slate-500 mb-6">
                            <p>Mode: <span className="font-medium text-slate-700 capitalize">{gw.mode}</span></p>
                            <p className="truncate">Key: {gw.api_key ? '••••' + gw.api_key.slice(-4) : 'Not Set'}</p>
                            {gw.api_endpoint && (
                                <p className="truncate">Endpoint: {gw.api_endpoint}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 pt-4 border-t border-gray-50">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={gw.is_active} onChange={() => handleToggle(gw)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900">{gw.is_active ? 'On' : 'Off'}</span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {openModal && selectedGateway && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-lg text-slate-900 capitalize">Configure {selectedGateway.name}</h3>
                            <button onClick={() => setOpenModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 space-y-4">

                            {/* Mode Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mode</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg bg-white"
                                    value={editForm.mode}
                                    onChange={e => setEditForm({ ...editForm, mode: e.target.value })}
                                >
                                    <option value="test">Test / Sandbox</option>
                                    <option value="live">Live / Production</option>
                                </select>
                            </div>

                            {/* API Key */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">API Key / Publishable Key</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="pk_test_..."
                                    value={editForm.api_key}
                                    onChange={e => setEditForm({ ...editForm, api_key: e.target.value })}
                                />
                            </div>

                            {/* API Secret */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Secret Key <span className="text-gray-400 font-normal">(Leave blank to keep existing)</span></label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="sk_test_..."
                                    value={editForm.secret_key}
                                    onChange={e => setEditForm({ ...editForm, secret_key: e.target.value })}
                                />
                            </div>

                            {/* Webhook Secret */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Webhook Secret <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="whsec_..."
                                    value={editForm.webhook_secret}
                                    onChange={e => setEditForm({ ...editForm, webhook_secret: e.target.value })}
                                />
                            </div>

                            {/* API Endpoint */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">API Endpoint <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="https://api.gateway.com/v1"
                                    value={editForm.api_endpoint}
                                    onChange={e => setEditForm({ ...editForm, api_endpoint: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Override the default base URL if needed.</p>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="modalActive"
                                    className="w-4 h-4 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
                                    checked={editForm.is_active}
                                    onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                                />
                                <label htmlFor="modalActive" className="text-sm text-slate-700 font-medium">Enable Gateway</label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setOpenModal(false)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-black"
                                >
                                    Save Configuration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
