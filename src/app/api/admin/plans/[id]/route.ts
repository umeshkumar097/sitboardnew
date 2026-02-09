import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, price, currency, duration, features, is_active } = await request.json();

    const client = await pool.connect();
    try {
        const res = await client.query(
            `UPDATE subscription_plans 
             SET name = $1, price = $2, currency = $3, duration = $4, features = $5, is_active = $6 
             WHERE id = $7 RETURNING *`,
            [name, price, currency, duration, features, is_active, id]
        );

        if (res.rowCount === 0) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        return NextResponse.json(res.rows[0]);
    } catch (error) {
        console.error('Error updating plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const client = await pool.connect();
    try {
        // Soft delete by setting is_active = false
        // Or if we want hard delete, check usage first. Let's do soft delete for safety.
        // Actually, user might want to really delete if unused. 
        // For now, let's just toggle is_active to false if DELETE is called, or we could delete if no dependencies.
        // Let's stick to true DELETE but with foreign key constraint check it will fail if used.
        // Better: Soft delete via PUT is preferred, but DELETE verb implies removal.
        // Let's try DELETE.
        try {
            await client.query('DELETE FROM subscription_plans WHERE id = $1', [id]);
            return NextResponse.json({ message: 'Plan deleted' });
        } catch (e: any) {
            // Likely foreign key violation if used
            if (e.code === '23503') { // foreign_key_violation
                return NextResponse.json({ error: 'Cannot delete plan as it is in active use. Deactivate it instead.' }, { status: 400 });
            }
            throw e;
        }
    } catch (error) {
        console.error('Error deleting plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
