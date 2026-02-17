"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        setStatus('loading');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to reset password');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An unexpected error occurred');
        }
    };

    if (!token) {
        return <div className="text-red-500 text-center">Invalid or missing token.</div>;
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-border p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-main mb-2">New Password</h1>
                <p className="text-muted">Enter your new password below</p>
            </div>

            {status === 'success' ? (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm text-center">
                    {message}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {status === 'error' && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {message}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-main mb-2">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full h-12 px-4 rounded-lg border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-main mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full h-12 px-4 rounded-lg border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full h-12 bg-main text-white font-semibold rounded-full hover:bg-black transition-all disabled:opacity-70"
                        style={{ backgroundColor: 'var(--text-main)' }}
                    >
                        {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
