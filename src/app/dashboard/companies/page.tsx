import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Company Management</h1>
                    <p className="text-slate-500 text-sm">Create and activate real estate companies</p>
                </div>
                <Link href="/dashboard/companies/new" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors shadow-lg">
                    + New Company
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Company Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Users</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Created</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company: any) => (
                            <tr key={company.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-900 font-medium">{company.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${company.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {company.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{company.user_count}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(company.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3 text-sm">
                                        <Link href={`/dashboard/companies/${company.id}/users`} className="text-blue-600 hover:text-blue-800 font-medium">
                                            Manage Users
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {companies.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No companies found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
