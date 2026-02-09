import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const res = await client.query('SELECT gateway_name, is_enabled, public_key, secret_key FROM payment_settings');

        // Mask secret keys for security when sending to client
        const settings = res.rows.map(row => ({
            ...row,
            secret_key: row.secret_key ? `${row.secret_key.substring(0, 4)}...${row.secret_key.substring(row.secret_key.length - 4)}` : '',
            // Send public key as is
        }));

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching gateway settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gateway_name, is_enabled, public_key, secret_key } = await request.json();

    const client = await pool.connect();
    try {
        // Check if gateway exists
        const checkRes = await client.query('SELECT secret_key FROM payment_settings WHERE gateway_name = $1', [gateway_name]);

        if (checkRes.rowCount === 0) {
            // Insert
            await client.query(
                `INSERT INTO payment_settings (gateway_name, is_enabled, public_key, secret_key) 
                 VALUES ($1, $2, $3, $4)`,
                [gateway_name, is_enabled, public_key, secret_key]
            );
        } else {
            // Update
            // Only update secret_key if a new one is provided (not empty string)
            // If the user sends the masked version back, we shouldn't overwrite it.
            // A simple logic: if secret_key includes '...', assume it's masked and don't update.
            // Or better, client sends empty string if unchanged.

            let query = 'UPDATE payment_settings SET is_enabled = $1, public_key = $2, updated_at = NOW()';
            let params = [is_enabled, public_key];
            let paramIdx = 3;

            if (secret_key && !secret_key.includes('...')) {
                query += `, secret_key = $${paramIdx}`;
                params.push(secret_key);
                paramIdx++;
            }

            query += ` WHERE gateway_name = $${paramIdx}`;
            params.push(gateway_name);

            await client.query(query, params);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating gateway settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
