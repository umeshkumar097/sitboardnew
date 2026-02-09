import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LeadList from '@/components/LeadList';

export default async function LeadsPage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const { role, company_id, id: userId } = session;

    if (!company_id) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                Error: You are not associated with a company.
            </div>
        );
    }

    const client = await pool.connect();
    let leads = [];

    try {
        let query = '';
        let params = [];

        if (role === 'company_admin') {
            // Company Admin sees ALL leads for the company
            query = 'SELECT * FROM leads WHERE company_id = $1 ORDER BY created_at DESC';
            params = [company_id];
        } else if (role === 'agent') {
            // Agents see ONLY their own leads
            query = 'SELECT * FROM leads WHERE agent_id = $1 ORDER BY created_at DESC';
            params = [userId];
        } else {
            // Super admin or other roles?
            // For now redirect or show empty
            return <div className="p-8 text-center text-gray-500">Leads not available for this role.</div>;
        }

        const res = await client.query(query, params);
        leads = res.rows;

    } catch (err) {
        console.error("Error fetching leads:", err);
    } finally {
        client.release();
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-sm font-semibold text-slate-800 tracking-tight">Leads Management</h1>
                <p className="text-gray-400 text-[10px] mt-0.5">
                    {role === 'company_admin' ? 'Manage all potential clients across your team.' : 'Track and manage your personal leads.'}
                </p>
            </div>

            <LeadList leads={leads} />
        </div>
    );
}
