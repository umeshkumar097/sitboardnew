import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import ProjectGrid from '@/components/ProjectGrid';
import { notFound, redirect } from 'next/navigation';

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { id } = await params;

    // Fetch Project & Plots
    // We need to verify that the project belongs to the user's company (unless Super Admin)

    const client = await pool.connect();
    let project;
    let plots = [];

    try {
        const projectRes = await client.query(
            'SELECT * FROM projects WHERE id = $1',
            [id]
        );

        if (projectRes.rowCount === 0) notFound();
        project = projectRes.rows[0];

        // Access check
        if (session.role !== 'super_admin' && project.company_id !== session.company_id) {
            return <div className="p-8 text-center text-red-600">Access Denied</div>;
        }

        // Fetch Plots
        // We also join booking info if booked to show client name on hover
        // But for simplicity, let's just fetch plots and load details on demand or fetch needed fields.
        // User wants "One Glance Clarity" -> "On click / hover show: Client Name...".
        // So we should fetch active booking info.

        // Complex query to get status + latest active booking client name
        // Or just fetch plots and if status=booked, fetch booking.
        // Let's do a JOIN.

        const plotsRes = await client.query(`
      SELECT 
        p.*,
        b.client_name as booking_client,
        b.booking_date,
        s.client_name as sale_client,
        s.sale_date
      FROM plots p
      LEFT JOIN bookings b ON p.id = b.plot_id AND b.status = 'active'
      LEFT JOIN sales s ON p.id = s.plot_id
      WHERE p.project_id = $1
      ORDER BY 
        CASE WHEN p.plot_number ~ '^[0-9]+$' THEN p.plot_number::int ELSE 999999 END,
        p.plot_number
    `, [id]);

        plots = plotsRes.rows;

    } finally {
        client.release();
    }

    return (
        <div className="h-full flex flex-col">
            <ProjectGrid project={project} plots={plots} session={session} />
        </div>
    );
}
