"use client";

import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An unexpected error occurred');
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-border p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-main mb-2">Reset Password</h1>
                    <p className="text-muted">Enter your email to receive a reset link</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm">
                            {message}
                        </div>
                        <a href="/login" className="text-primary hover:underline">Back to Login</a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {message}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-main mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full h-12 px-4 rounded-lg border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full h-12 bg-main text-white font-semibold rounded-full hover:bg-black transition-all disabled:opacity-70"
                            style={{ backgroundColor: 'var(--text-main)' }}
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
