import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';
import CompanyAdminDashboard from '@/components/dashboard/CompanyAdminDashboard';
import AgentDashboard from '@/components/dashboard/AgentDashboard';

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const { role, company_id, name } = session;
    const client = await pool.connect();

    try {
        // --- 1. SUPER ADMIN ---
        if (role === 'super_admin') {
            const resCompanies = await client.query('SELECT COUNT(*) as count FROM companies');
            const resProjects = await client.query('SELECT COUNT(*) as count FROM projects');
            const resUsers = await client.query('SELECT COUNT(*) as count FROM users');

            const stats = {
                companiesCount: resCompanies.rows[0].count,
                projectsCount: resProjects.rows[0].count,
                usersCount: resUsers.rows[0].count
            };

            return <SuperAdminDashboard stats={stats} />;
        }

        // --- 2. COMPANY ADMIN & AGENT (Needs Company Context) ---
        if (!company_id) {
            return (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" /></svg>
                    Error: Your account is not associated with any company. Please contact support.
                </div>
            );
        }

        // Fetch Company Admin Stats
        if (role === 'company_admin') {
            const projectRes = await client.query('SELECT COUNT(*) as count FROM projects WHERE company_id = $1', [company_id]);
            const plotRes = await client.query(`
                SELECT 
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE plots.status = 'available') as available,
                    COUNT(*) FILTER (WHERE plots.status = 'booked') as booked,
                    COUNT(*) FILTER (WHERE plots.status = 'sold') as sold
                FROM plots 
                JOIN projects ON plots.project_id = projects.id
                WHERE projects.company_id = $1
            `, [company_id]);

            const stats = {
                projects: projectRes.rows[0].count,
                plots: plotRes.rows[0].total,
                available: plotRes.rows[0].available,
                booked: plotRes.rows[0].booked,
                sold: plotRes.rows[0].sold
            };

            return <CompanyAdminDashboard stats={stats} name={name} />;
        }

        // --- 3. AGENT DASHBOARD ---
        if (role === 'agent') {
            // For agents, show list of projects with plot stats.
            const projectsRes = await client.query(`
                 SELECT 
                    p.id, p.name, p.location,
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

            return <AgentDashboard projects={projectsRes.rows} name={name} />;
        }

        return <div>Unknown Role</div>;

    } catch (err) {
        console.error(err);
        return <div className="text-red-500">Error loading dashboard data.</div>;
    } finally {
        client.release();
    }
}
