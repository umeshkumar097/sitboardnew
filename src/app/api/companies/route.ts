import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import crypto from 'crypto';

async function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
    });
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { name, adminName, adminEmail, adminPassword } = await req.json();

        if (!name || !adminName || !adminEmail || !adminPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Create Company
            const compRes = await client.query(
                "INSERT INTO companies (name, status) VALUES ($1, 'active') RETURNING id",
                [name]
            );
            const companyId = compRes.rows[0].id;

            // 2. Check Admin Email
            const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
            if ((userCheck.rowCount ?? 0) > 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Admin email already exists' }, { status: 409 });
            }

            // 3. Create Admin User
            const passwordHash = await hashPassword(adminPassword);
            await client.query(
                'INSERT INTO users (company_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
                [companyId, adminName, adminEmail, passwordHash, 'company_admin']
            );

            await client.query('COMMIT');
            return NextResponse.json({ id: companyId });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Create Company Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
