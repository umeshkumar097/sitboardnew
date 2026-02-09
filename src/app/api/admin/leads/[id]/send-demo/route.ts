import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { jwtVerify } from 'jose';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    // 1. Verify Authentication (Reusing helper or middleware would be cleaner, but keeping it direct for now)
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');
        await jwtVerify(token, secret);
    } catch (err) {
        return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const { id } = params;
    const { action, method, message, link } = await request.json(); // method: 'email' | 'whatsapp'

    let client;
    try {
        client = await pool.connect();

        // Check if lead exists
        const res = await client.query('SELECT * FROM leads WHERE id = $1', [id]);
        if (res.rowCount === 0) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }
        const lead = res.rows[0];

        // If Email -> Send Email
        if (method === 'email') {
            if (!lead.email) {
                return NextResponse.json({ error: 'Lead has no email' }, { status: 400 });
            }

            const emailContent = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <p>Hi ${lead.name},</p>
          <p>${message}</p>
          <p><strong>Link:</strong> <a href="${link}">${link}</a></p>
          <br/>
          <p>Regards,<br/>The SiteBoard Team</p>
        </div>
      `;

            const result = await sendEmail({
                to: lead.email,
                subject: 'Demo Invitation: SiteBoard',
                html: emailContent,
            });

            if (!result.success) {
                throw new Error('Failed to send email');
            }
        }

        // Always update status to "Demo Sent" on success
        await client.query('UPDATE leads SET status = $1 WHERE id = $2', ['Demo Sent', id]);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Demo send error:', err);
        return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}
