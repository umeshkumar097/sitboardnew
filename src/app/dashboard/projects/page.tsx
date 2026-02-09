import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ProjectsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const { company_id, role } = session;

    if (!company_id) {
        return <div className="p-8 text-center text-red-600">No Company Assigned</div>;
    }

    const client = await pool.connect();
    let projects = [];
    try {
        const res = await client.query(`
      SELECT 
        p.*, 
        COUNT(pl.id)::int as total_plots,
        COUNT(pl.id) FILTER (WHERE pl.status = 'available')::int as available_plots,
        COUNT(pl.id) FILTER (WHERE pl.status = 'booked')::int as booked_plots,
        COUNT(pl.id) FILTER (WHERE pl.status = 'sold')::int as sold_plots
      FROM projects p
      LEFT JOIN plots pl ON p.id = pl.project_id
      WHERE p.company_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [company_id]);
        projects = res.rows;
    } finally {
        client.release();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                    <p className="text-slate-500 text-sm">Manage your real estate projects</p>
                </div>
                {role === 'company_admin' && (
                    <Link href="/dashboard/projects/new" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors shadow-lg">
                        + New Project
                    </Link>
                )}
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500 mb-4">No projects found.</p>
                    {role === 'company_admin' && (
                        <Link href="/dashboard/projects/new" className="text-blue-600 font-medium hover:underline">
                            Create your first project
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project: any) => (
                        <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="block group">
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                                <div className="h-32 bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center">
                                    {/* Placeholder for project image or map preview */}
                                    <span className="text-slate-400 font-medium text-lg tracking-widest uppercase opacity-50">Project</span>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {project.location}
                                    </p>

                                    <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400 uppercase font-semibold">Total</p>
                                            <p className="font-bold text-slate-700">{project.total_plots}</p>
                                        </div>
                                        <div className="text-center border-l border-slate-100">
                                            <p className="text-xs text-green-600 uppercase font-semibold">Avail</p>
                                            <p className="font-bold text-green-700">{project.available_plots}</p>
                                        </div>
                                        <div className="text-center border-l border-slate-100">
                                            <p className="text-xs text-red-500 uppercase font-semibold">Sold</p>
                                            <p className="font-bold text-red-700">{project.sold_plots}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
