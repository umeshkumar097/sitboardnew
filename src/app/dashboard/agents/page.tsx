import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserList from '@/components/UserList';

export default async function AgentsPage() {
    const session = await getSession();
    if (!session || session.role !== 'company_admin') {
        redirect('/dashboard');
    }

    const { company_id } = session;

    const client = await pool.connect();
    let agents = [];
    try {
        const agentsRes = await client.query(
            "SELECT * FROM users WHERE company_id = $1 AND role = 'agent' ORDER BY created_at DESC",
            [company_id]
        );
        agents = agentsRes.rows;
    } finally {
        client.release();
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Agent Management</h1>
                <p className="text-slate-500 text-sm">Create and manage your sales agents</p>
            </div>

            {/* 
         We reuse UserList, but in "Company Admin" context.
         The component should hide role selection if only one role is possible?
         Or let's just update UserList to handle this.
      */}
            <UserList users={agents} companyId={company_id ?? 0} currentUserRole={session.role} />
        </div>
    );
}
