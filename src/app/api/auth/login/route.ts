import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);

            if (res.rowCount === 0) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const user = res.rows[0];
            const valid = await verifyPassword(password, user.password_hash);

            if (!valid) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            // Create session
            // We store minimal info in session token
            await createSession({
                id: user.id,
                email: user.email,
                role: user.role,
                company_id: user.company_id,
                name: user.name
            });

            return NextResponse.json({ success: true, role: user.role });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
