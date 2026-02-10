
import BrandLogo from '@/components/BrandLogo';
import Link from 'next/link';

export const metadata = {
    title: 'About Us | SiteBoard',
    description: 'Learn about SiteBoard mission to modernize real estate inventory management.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white flex flex-col">
            <nav className="border-b border-gray-200 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link href="/">
                        <BrandLogo />
                    </Link>
                    <div className="flex gap-4 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <Link href="/contact" className="hover:text-blue-600">Contact</Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About SiteBoard</h1>

                <div className="prose lg:prose-xl mx-auto text-gray-700 space-y-6">
                    <p className="lead text-xl text-gray-800 font-medium">
                        SiteBoard is India's premier Plot Inventory Management System, designed specifically for real estate developers, builders, and channel partners.
                    </p>

                    <p>
                        We observed a critical gap in the real estate market: while sales teams were moving fast, their tools were stuck in the past.
                        Multi-crore projects were being managed on messy Excel sheets, leading to double bookings, communication gaps, and lost sales.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">Our Mission</h3>
                    <p>
                        To bring clarity, control, and confidence to real estate businesses. We believe that technology should be simple,
                        visual, and accessible to everyone on the team - from the site engineer to the sales director.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">What We Do</h3>
                    <p>
                        SiteBoard provides a live, visual dashboard of your project layout. It replaces static maps and manual registers with
                        an interactive system that updates in real-time. When a plot is booked, everyone knows instantly.
                    </p>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 my-8">
                        <h4 className="text-lg font-semibold text-blue-900 mb-2">Powered by Aiclex Technologies</h4>
                        <p className="text-sm text-blue-800">
                            SiteBoard is a flagship product of Aiclex Technologies LLP, a technology company dedicated to building
                            innovative solutions for the Indian real estate sector.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
