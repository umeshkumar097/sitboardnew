import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const client = await pool.connect();
        try {
            // 1. Check if user exists
            const userRes = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userRes.rowCount === 0) {
                // Return success even if email not found (security practice)
                return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
            }

            // 2. Generate Token
            const token = crypto.randomBytes(32).toString('hex');
            const expiry = new Date(Date.now() + 3600000); // 1 hour

            // 3. Save to DB
            await client.query(
                'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
                [token, expiry, email]
            );

            // 4. Send Email
            const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
            await sendEmail({
                to: email,
                subject: 'Reset Your SiteBoard Password',
                html: emailTemplates.resetPassword(resetLink)
            });

            return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });

        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
