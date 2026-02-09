import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import CompanyDetailView from '@/components/CompanyDetailView';

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
        <CompanyDetailView company={company} users={users} currentUserRole={session.role} />
    );
}
