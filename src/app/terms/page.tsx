
import Link from 'next/link';

export const metadata = {
    title: 'Terms & Conditions | SiteBoard',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-3xl mx-auto prose">
                <h1>Terms and Conditions</h1>
                <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

                <p>Welcome to SiteBoard. By accessing or using our website and services, you agree to be bound by these Terms and Conditions.</p>

                <h2>1. Use of Service</h2>
                <p>SiteBoard provides a plot inventory management system for real estate businesses. You agree to use the service only for lawful purposes and in accordance with these Terms.</p>

                <h2>2. Account Security</h2>
                <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

                <h2>3. Intellectual Property</h2>
                <p>The SiteBoard service and its original content, features, and functionality are and will remain the exclusive property of Aiclex Technologies LLP.</p>

                <h2>4. Termination</h2>
                <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                <h2>5. Limitation of Liability</h2>
                <p>In no event shall Aiclex Technologies LLP be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>

                <div className="mt-8 pt-8 border-t">
                    <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
                </div>
            </div>
        </main>
    );
}
