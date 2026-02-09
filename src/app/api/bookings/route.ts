import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role === 'agent') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    try {
        const { projectId, plotId, clientName, amount } = await req.json();

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Select Plot FOR UPDATE to lock it
            const plotRes = await client.query(
                'SELECT status, project_id, company_id FROM plots JOIN projects ON plots.project_id = projects.id WHERE plots.id = $1 FOR UPDATE',
                [plotId]
            );

            if (plotRes.rowCount === 0) throw new Error('Plot not found');

            const plot = plotRes.rows[0];

            if (plot.status !== 'available') {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Plot is not available' }, { status: 400 });
            }

            // Verify Company Match (Security)
            if (session.role !== 'super_admin' && plot.company_id !== session.company_id) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }

            // Create Booking
            await client.query(
                `INSERT INTO bookings (plot_id, project_id, company_id, user_id, client_name, booking_amount, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'active')`,
                [plotId, plot.project_id, plot.company_id, session.id, clientName, parseFloat(amount)]
            );

            // Update Plot Status
            await client.query("UPDATE plots SET status = 'booked' WHERE id = $1", [plotId]);

            await client.query('COMMIT');
            return NextResponse.json({ success: true });

        } catch (e) {
            await client.query('ROLLBACK');
            console.error('Booking Error:', e);
            return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
