'use client';

import { useState, useEffect } from 'react';

export default function GatewayManager() {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/gateways');
            if (res.ok) {
                const data = await res.json();
                // Ensure we have defaults if empty
                const stripe = data.find((g: any) => g.gateway_name === 'stripe') || { gateway_name: 'stripe', is_enabled: false, public_key: '', secret_key: '' };
                const razorpay = data.find((g: any) => g.gateway_name === 'razorpay') || { gateway_name: 'razorpay', is_enabled: false, public_key: '', secret_key: '' };
                setSettings([stripe, razorpay]);
            }
        } catch (e) {
            console.error('Failed to fetch gateway settings', e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (index: number, field: string, value: any) => {
        const newSettings = [...settings];
        newSettings[index] = { ...newSettings[index], [field]: value };
        setSettings(newSettings);
    };

    const handleSave = async (gateway: any) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/gateways', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gateway)
            });

            if (res.ok) {
                alert(`${gateway.gateway_name} settings saved!`);
                fetchSettings(); // Refresh to get masked keys back
            } else {
                alert('Failed to save settings');
            }
        } catch (e) {
            console.error(e);
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading settings...</div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800">Payment Gateways</h2>

            {settings.map((gateway, idx) => (
                <div key={gateway.gateway_name} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${gateway.gateway_name === 'stripe' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                                {gateway.gateway_name === 'stripe' ? (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.895-1.483 2.511-1.483 2.136 0 3.003.822 3.806 1.834l2.583-1.677C18.23 3.655 16.634 2 13.064 2c-4.228 0-6.9 2.508-6.9 6.073 0 5.286 7.234 4.542 7.234 6.899 0 .914-1.037 1.62-2.73 1.62-2.31 0-3.568-.962-4.59-2.227l-2.6 1.714C5.07 18.24 7.222 20 10.74 20c4.545 0 7.108-2.584 7.108-6.223 0-5.46-7.872-4.63-7.872-6.627z" /></svg>
                                ) : (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M2.296 6.857h7.245L4.502 11.23c-1.464 1.25-1.996 2.37-1.996 4.148 0 3.92 5.068 7.377 12.062 7.377 3.518 0 6.64-1.144 8.784-2.846L21.49 17.58c-1.748 1.4-4.29 2.305-7.143 2.305-4.102 0-7.058-1.57-7.058-3.518 0-.905.18-1.285 1.433-2.305L21.704 6.856H14.16l5.053-4.394H12L2.296 6.857Z" /></svg>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 capitalize">{gateway.gateway_name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${gateway.is_enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {gateway.is_enabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <button
                                onClick={() => handleUpdate(idx, 'is_enabled', !gateway.is_enabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${gateway.is_enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${gateway.is_enabled ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Public Key</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg text-slate-600 font-mono text-sm"
                                value={gateway.public_key || ''}
                                onChange={(e) => handleUpdate(idx, 'public_key', e.target.value)}
                                placeholder={`Enter ${gateway.gateway_name} public key`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Secret Key</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border rounded-lg text-slate-600 font-mono text-sm"
                                value={gateway.secret_key || ''}
                                onChange={(e) => handleUpdate(idx, 'secret_key', e.target.value)}
                                placeholder={gateway.secret_key ? '••••••••••••••••' : `Enter ${gateway.gateway_name} secret key`}
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                                {gateway.secret_key && gateway.secret_key.includes('...') ? 'Key is set (hidden). Enter new value to update.' : 'Enter the secret key provided by the gateway.'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => handleSave(gateway)}
                            disabled={saving}
                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
