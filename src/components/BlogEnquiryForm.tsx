'use client';

import { useState } from 'react';

export default function BlogEnquiryForm({ blogTitle }: { blogTitle: string }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    message: `Blog Enquiry: ${blogTitle} | Msg: ${formData.message}`,
                    plan_interest: 'Blog Consultation',
                    company_name: 'N/A' // Optional in DB but might be good to have
                }),
            });

            if (!res.ok) throw new Error('Submission failed');

            setStatus('success');
            setFormData({ name: '', phone: '', email: '', message: '' });
        } catch (error) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center my-12">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Request Received!</h3>
                <p className="text-green-700">Thanks for your interest. Our team will contact you shortly.</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-green-800 underline">Send another</button>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 text-white rounded-xl p-8 my-12 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="text-2xl font-bold mb-4">Want to implement these strategies?</h3>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        SiteBoard helps real estate developers streamline sales and management.
                        Get a free consultation tailored to your projects.
                    </p>
                    <ul className="space-y-3 mb-8">
                        {['Streamline Bookings', 'Manage Inventory', 'Track Payments'].map((item) => (
                            <li key={item} className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number / WhatsApp</label>
                        <input
                            type="tel"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="+91 98765 00000"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Sending...' : 'Request Free Consultation'}
                    </button>
                    {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
                </form>
            </div>
        </div>
    );
}
