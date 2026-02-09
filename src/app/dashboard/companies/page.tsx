import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CompanyList from '@/components/CompanyList';

export default async function CompaniesPage() {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        redirect('/dashboard');
    }

    const client = await pool.connect();
    let companies = [];
    try {
        const res = await client.query(`
      SELECT c.*, COUNT(u.id) as user_count 
      FROM companies c
      LEFT JOIN users u ON c.id = u.company_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
        companies = res.rows;
    } finally {
        client.release();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-sm font-semibold text-slate-800 tracking-tight">Company Management</h1>
                    <p className="text-gray-400 text-[10px] mt-0.5">Create and activate real estate companies</p>
                </div>
                <Link href="/dashboard/companies/new" className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-black transition-colors shadow-sm">
                    + New Company
                </Link>
            </div>

            <CompanyList initialCompanies={companies} />
        </div>
    );
}
