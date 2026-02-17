import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            // 1. Verify Token and Expiry
            const userRes = await client.query(
                'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
                [token]
            );

            if (userRes.rowCount === 0) {
                return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
            }

            const user = userRes.rows[0];

            // 2. Hash New Password
            const newHash = await hashPassword(password);

            // 3. Update Password and Clear Token
            await client.query(
                'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
                [newHash, user.id]
            );

            return NextResponse.json({ success: true, message: 'Password reset successfully' });

        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
