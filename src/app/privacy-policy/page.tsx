
import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy | SiteBoard',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-3xl mx-auto prose">
                <h1>Privacy Policy</h1>
                <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

                <p>At SiteBoard (Aiclex Technologies LLP), we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information.</p>

                <h2>1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, request a demo, or contact customer support. This may include your name, email address, phone number, and company details.</p>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience. We do not sell your personal data to third parties.</p>

                <h2>3. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

                <h2>4. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@siteboard.in">info@siteboard.in</a>.</p>

                <div className="mt-8 pt-8 border-t">
                    <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
                </div>
            </div>
        </main>
    );
}
