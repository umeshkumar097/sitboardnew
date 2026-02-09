import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { sendEmail, emailTemplates } from '@/lib/email';
import { jwtVerify } from 'jose';

export async function POST(request: NextRequest) {
    // 1. Verify Authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');
        await jwtVerify(token, secret);
    } catch (err) {
        return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    // 2. Fetch all leads with valid emails
    let client;
    let leads = [];
    try {
        client = await pool.connect();
        // Only select leads that have an email
        const result = await client.query('SELECT name, email FROM leads WHERE email IS NOT NULL AND email != \'\'');
        leads = result.rows;
    } catch (err) {
        console.error('Database error:', err);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } finally {
        if (client) client.release();
    }

    if (leads.length === 0) {
        return NextResponse.json({
            success: true,
            message: 'No leads with email addresses found.',
            count: 0
        });
    }

    // 3. Send emails
    let sentCount = 0;
    let failedCount = 0;

    console.log(`Starting bulk email to ${leads.length} recipients...`);

    // Send sequentially to avoid rate limits (simplistic approach for now)
    for (const lead of leads) {
        try {
            if (!lead.email) continue;

            const result = await sendEmail({
                to: lead.email,
                subject: 'SiteBoard is Live 🚀',
                html: emailTemplates.launchAnnouncement(lead),
            });

            if (result.success) {
                sentCount++;
            } else {
                failedCount++;
                console.error(`Failed to send to ${lead.email}:`, result.error);
            }
        } catch (err) {
            failedCount++;
            console.error(`Exception sending to ${lead.email}:`, err);
        }
    }

    console.log(`Bulk email completed. Sent: ${sentCount}, Failed: ${failedCount}`);

    return NextResponse.json({
        success: true,
        message: `Emails processed. Sent: ${sentCount}, Failed: ${failedCount}`,
        stats: { sent: sentCount, failed: failedCount, total: leads.length }
    });
}
