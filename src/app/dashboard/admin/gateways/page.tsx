import { Metadata } from 'next';
import GatewayManager from '@/components/dashboard/GatewayManager';

export const metadata: Metadata = {
    title: 'Payment Gateway Settings | SiteBoard',
    description: 'Manage Stripe and Razorpay integrations.',
};

export default function GatewaysPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <GatewayManager />
        </div>
    );
}
