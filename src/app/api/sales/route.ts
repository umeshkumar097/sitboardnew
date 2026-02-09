import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role === 'agent') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    try {
        const { plotId, clientName, amount } = await req.json();

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const plotRes = await client.query(
                'SELECT status, project_id FROM plots WHERE id = $1 FOR UPDATE',
                [plotId]
            );

            if (plotRes.rowCount === 0) throw new Error('Plot not found');
            const plot = plotRes.rows[0];

            if (plot.status !== 'booked') {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Plot must be booked first' }, { status: 400 });
            }

            // Find Active Booking
            const bookingRes = await client.query(
                "SELECT id, company_id FROM bookings WHERE plot_id = $1 AND status = 'active'",
                [plotId]
            );

            if (bookingRes.rowCount === 0) {
                await client.query('ROLLBACK'); // Should not happen if data consistent
                return NextResponse.json({ error: 'No active booking found' }, { status: 400 });
            }
            const booking = bookingRes.rows[0];

            if (session.role !== 'super_admin' && booking.company_id !== session.company_id) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }

            // Create Sale
            await client.query(
                `INSERT INTO sales (plot_id, booking_id, project_id, company_id, user_id, client_name, sale_amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [plotId, booking.id, plot.project_id, booking.company_id, session.id, clientName, parseFloat(amount)]
            );

            // Complete Booking
            await client.query("UPDATE bookings SET status = 'completed' WHERE id = $1", [booking.id]);

            // Update Plot Status
            await client.query("UPDATE plots SET status = 'sold' WHERE id = $1", [plotId]);

            await client.query('COMMIT');
            return NextResponse.json({ success: true });

        } catch (e) {
            await client.query('ROLLBACK');
            console.error('Sale Error:', e);
            return NextResponse.json({ error: 'Sale failed' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
