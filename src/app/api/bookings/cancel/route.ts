import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role === 'agent') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { plotId } = await req.json();

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Select Plot FOR UPDATE
            const plotRes = await client.query(
                'SELECT status, company_id FROM plots WHERE id = $1 FOR UPDATE',
                [plotId]
            );

            if (plotRes.rowCount === 0) throw new Error('Plot not found');
            const plot = plotRes.rows[0];

            if (plot.status !== 'booked') {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Plot is not booked' }, { status: 400 });
            }

            // Verify Ownership
            if (session.role !== 'super_admin' && plot.company_id !== session.company_id) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }

            // Find Active Booking
            const bookingRes = await client.query(
                "SELECT id FROM bookings WHERE plot_id = $1 AND status = 'active'",
                [plotId]
            );

            if (bookingRes.rowCount === 0) {
                // Data inconsistency or already cancelled
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'No active booking found' }, { status: 400 });
            }

            // Cancel Booking
            await client.query(
                "UPDATE bookings SET status = 'cancelled' WHERE id = $1",
                [bookingRes.rows[0].id]
            );

            // Update Plot Status
            await client.query("UPDATE plots SET status = 'available' WHERE id = $1", [plotId]);

            await client.query('COMMIT');
            return NextResponse.json({ success: true });

        } catch (e) {
            await client.query('ROLLBACK');
            console.error('Cancel Booking Error:', e);
            return NextResponse.json({ error: 'Cancellation failed' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
