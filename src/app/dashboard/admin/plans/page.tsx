import { Metadata } from 'next';
import PlanManager from '@/components/dashboard/PlanManager';

export const metadata: Metadata = {
    title: 'Manage Subscription Plans | SiteBoard',
    description: 'Create and manage subscription plans for companies.',
};

export default function PlansPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PlanManager />
        </div>
    );
}
