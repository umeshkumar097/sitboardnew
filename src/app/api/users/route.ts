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

    // Only Super Admin can create Company Admins
    // Company Admin can create Agents (Requirement extension but logical)
    // Let's first support Super Admin creating anyone.

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { name, email, password, role, companyId } = await req.json();

        if (!name || !email || !password || !role || !companyId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Role check
        if (session.role === 'super_admin') {
            // Can create any role for any company
        } else if (session.role === 'company_admin') {
            // Can only create agents for their own company
            if (role !== 'agent') {
                return NextResponse.json({ error: 'Company Admins can only create Agents' }, { status: 403 });
            }
            if (parseInt(companyId) !== session.company_id) {
                return NextResponse.json({ error: 'Unauthorized company' }, { status: 403 });
            }
        } else {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const client = await pool.connect();
        try {
            // Check if email exists
            // Check if email exists
            const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
            if ((userCheck.rowCount ?? 0) > 0) {
                return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
            }

            const passwordHash = await hashPassword(password);

            const res = await client.query(
                'INSERT INTO users (company_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [companyId, name, email, passwordHash, role]
            );

            return NextResponse.json({ id: res.rows[0].id });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Create User Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
