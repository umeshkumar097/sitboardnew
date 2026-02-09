import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function SubscriptionExpiredPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <BrandLogo className="w-12 h-12" textClassName="text-2xl" />
                </div>

                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">Subscription Expired</h1>
                <p className="text-slate-500 mb-6">
                    Your trial period or subscription plan has ended. To regain access to SiteBoard features, please renew your subscription.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/dashboard/billing"
                        className="block w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                        Renew Subscription Now
                    </Link>

                    <Link
                        href="mailto:support@aiclex.com"
                        className="block w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors border border-slate-200"
                    >
                        Contact Support
                    </Link>
                </div>

                <p className="mt-6 text-xs text-slate-400">
                    If you believe this is an error, please refresh the page or logout and login again.
                </p>
            </div>
        </div>
    );
}
