import SignupForm from '@/components/SignupForm';
import BrandLogo from '@/components/BrandLogo';
import Link from 'next/link';

export const metadata = {
    title: 'Sign Up | SiteBoard',
    description: 'Request access to SiteBoard - The #1 Plot Inventory Management System.',
};

export default function SignupPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link href="/">
                        <BrandLogo />
                    </Link>
                    <div className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                            Get Started with SiteBoard
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Join 50+ builders managing their projects smarter.
                        </p>
                    </div>

                    <SignupForm />

                    <p className="text-center text-xs text-gray-500 mt-4">
                        By requesting access, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </main>
    );
}
