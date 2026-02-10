import SignupForm from '@/components/SignupForm';
import BrandLogo from '@/components/BrandLogo';
import Link from 'next/link';

export const metadata = {
    title: 'Contact Us | SiteBoard',
    description: 'Get in touch with the SiteBoard team. We are here to help you revolutionize your real estate management.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link href="/">
                        <BrandLogo />
                    </Link>
                    <div className="text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Contact Us</h1>

                    <div className="grid md:grid-cols-2 gap-12 items-start">

                        {/* Contact Details */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                            <p className="text-gray-600 mb-8">
                                Have questions about SiteBoard? Interested in a demo? We'd love to hear from you.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-3 rounded-lg mr-4 text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Phone</h3>
                                        <p className="text-gray-600">+91 8449488090</p>
                                        <p className="text-xs text-gray-400 mt-1">Mon-Fri, 10am - 7pm IST</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-3 rounded-lg mr-4 text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Email</h3>
                                        <a href="mailto:info@siteboard.in" className="text-blue-600 hover:underline">info@siteboard.in</a>
                                        <p className="text-xs text-gray-400 mt-1">We usually respond within 24 hours.</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-3 rounded-lg mr-4 text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Office</h3>
                                        <p className="text-gray-600">
                                            Aiclex Technologies LLP<br />
                                            India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 bg-gray-50">
                                    <h3 className="font-bold text-xl">Send us a Message</h3>
                                </div>
                                <div className="p-2">
                                    <SignupForm />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
