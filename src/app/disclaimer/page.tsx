
import Link from 'next/link';

export const metadata = {
    title: 'Disclaimer | SiteBoard',
};

export default function DisclaimerPage() {
    return (
        <main className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-3xl mx-auto prose">
                <h1>Disclaimer</h1>
                <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

                <p>The information provided by SiteBoard ("we," "us," or "our") on our website and software application is for general informational purposes only.</p>

                <h2>1. General Disclaimer</h2>
                <p>All information on the SiteBoard platform is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>

                <h2>2. Business Decisions</h2>
                <p>SiteBoard is a tool to assist in management and is not a substitute for professional legal or financial advice. Users are responsible for verifying all data before making business decisions.</p>

                <h2>3. External Links</h2>
                <p>The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with us. Please note that the SiteBoard does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>

                <div className="mt-8 pt-8 border-t">
                    <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
                </div>
            </div>
        </main>
    );
}
