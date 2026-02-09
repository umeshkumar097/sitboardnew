import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import UserList from '@/components/UserList';

export default async function CompanyUsersPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        redirect('/dashboard');
    }

    const { id } = await params;
    const companyId = parseInt(id);

    const client = await pool.connect();
    let company;
    let users = [];
    try {
        const companyRes = await client.query('SELECT * FROM companies WHERE id = $1', [companyId]);
        if (companyRes.rowCount === 0) notFound();
        company = companyRes.rows[0];

        const usersRes = await client.query('SELECT * FROM users WHERE company_id = $1 ORDER BY created_at DESC', [companyId]);
        users = usersRes.rows;
    } finally {
        client.release();
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Users for {company.name}</h1>
                <p className="text-slate-500 text-sm">Manage company administrators and agents</p>
            </div>

            <UserList users={users} companyId={companyId} currentUserRole={session.role} />
        </div>
    );
}
