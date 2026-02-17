import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const result = await client.query('SELECT id, name, api_key, api_endpoint, is_active, mode FROM payment_gateways ORDER BY id ASC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching gateways:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, api_key, secret_key, webhook_secret, api_endpoint, is_active, mode } = await req.json();

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const checkRes = await client.query('SELECT id FROM payment_gateways WHERE name = $1', [name]);

        if (checkRes.rowCount === 0) {
            // New Insert
            await client.query(
                `INSERT INTO payment_gateways (name, api_key, secret_key, webhook_secret, api_endpoint, is_active, mode)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [name, api_key, secret_key, webhook_secret, api_endpoint, is_active, mode]
            );
        } else {
            // Update
            const updates = [];
            const values = [];
            let idx = 1;

            if (api_key !== undefined) { updates.push(`api_key = $${idx++}`); values.push(api_key); }
            if (api_endpoint !== undefined) { updates.push(`api_endpoint = $${idx++}`); values.push(api_endpoint); }
            if (is_active !== undefined) { updates.push(`is_active = $${idx++}`); values.push(is_active); }
            if (mode !== undefined) { updates.push(`mode = $${idx++}`); values.push(mode); }
            if (secret_key && secret_key.trim() !== '') { updates.push(`secret_key = $${idx++}`); values.push(secret_key); }
            if (webhook_secret && webhook_secret.trim() !== '') { updates.push(`webhook_secret = $${idx++}`); values.push(webhook_secret); }

            updates.push(`updated_at = NOW()`);

            values.push(name); // Last value for WHERE clause

            if (updates.length > 0) {
                await client.query(
                    `UPDATE payment_gateways SET ${updates.join(', ')} WHERE name = $${idx}`,
                    values
                );
            }
        }

        await client.query('COMMIT');
        return NextResponse.json({ message: 'Gateway updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating gateway:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
