import { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminInvoiceList from '@/components/dashboard/AdminInvoiceList';

export const metadata: Metadata = {
    title: 'Global Invoices | SiteBoard Admin',
    description: 'View all platform invoices.',
};

export default async function AdminInvoicesPage() {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        redirect('/login');
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Manage Invoices</h1>
                <p className="text-slate-500 mt-1">Global view of all subscription invoices.</p>
            </div>
            <AdminInvoiceList />
        </div>
    );
}
