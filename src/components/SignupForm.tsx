'use client';

import { useState } from 'react';

export default function SignupForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company_name: '',
        city: '',
        whatsapp: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.whatsapp,
                    company_name: formData.company_name,
                    message: `City: ${formData.city}`,
                    plan_interest: 'Pre-Layout Signup'
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            setStatus('success');
            setMessage('Your request has been prioritized.');
            setFormData({ name: '', email: '', company_name: '', city: '', whatsapp: '' });

            if (typeof window !== 'undefined' && 'gtag' in window) {
                (window as any).gtag('event', 'generate_lead', {
                    'event_category': 'form',
                    'event_label': 'pre_launch_signup_v2'
                });
            }
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message);
        }
    };

    if (status === 'success') {
        return (
            <div className="form-card text-center" style={{ padding: '4rem 2rem' }}>
                <div style={{
                    width: '64px', height: '64px',
                    background: '#dcfce7', color: '#166534',
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem', fontSize: '2rem'
                }}>✓</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Request Received</h3>
                <p className="text-gray-600 mb-6">Our team will verify your details and reach out via WhatsApp shortly.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="btn btn-secondary text-sm"
                >
                    Submit another request
                </button>
            </div>
        );
    }

    return (
        <div className="form-card">
            <div className="form-header">
                <h3 style={{ marginBottom: '0.5rem' }}>Request Access</h3>
                <p className="text-sm text-muted" style={{ margin: 0 }}>
                    Enter your professional details.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Rahul Sharma"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="company_name">Company / Firm Name</label>
                    <input
                        id="company_name"
                        name="company_name"
                        type="text"
                        placeholder="Sharma Real Estate Developers"
                        value={formData.company_name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="city">City of Operation</label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Indore, MP"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="whatsapp">WhatsApp Number</label>
                    <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.whatsapp}
                        onChange={handleChange}
                    />
                </div>

                {status === 'error' && (
                    <div className="text-red-600 text-sm mb-4 text-center bg-red-50 p-2 rounded">{message}</div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Processing...' : 'Request Access'}
                </button>

                <p className="text-center text-xs text-muted" style={{ marginTop: '1rem', marginBottom: 0 }}>
                    Secure SSL encrypted submission.
                </p>
            </form>
        </div>
    );
}
