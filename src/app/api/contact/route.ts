import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { name, phone, email, message, company_name, plan_interest } = await req.json();
        console.log('Contact API hit:', { name, phone, email });

        // Debug: Check loaded config
        console.log('Config Status:', {
            HAS_DB_URL: !!process.env.DATABASE_URL,
            HAS_ADMIN_PHONE: !!process.env.ADMIN_PHONE,
            HAS_SMTP_HOST: !!process.env.SMTP_HOST,
            HAS_WA_ID: !!process.env.WHATSAPP_PHONE_ID
        });

        if (!name || !phone) {
            console.log('Missing name or phone');
            return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const res = await client.query(
                `INSERT INTO site_enquiries (name, phone, email, message, company_name, plan_interest)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                [name, phone, email, message, company_name, plan_interest]
            );
            const { sendWhatsAppMessage } = await import('@/lib/whatsapp');
            const { sendEmail, emailTemplates } = await import('@/lib/email');

            // 1. Notify Admin (WhatsApp + Email)
            const adminPhone = process.env.ADMIN_PHONE;
            if (adminPhone) {
                console.log('Sending Admin WhatsApp to:', adminPhone);
                await sendWhatsAppMessage(adminPhone, 'new_lead_alert', [
                    { type: 'text', text: name },
                    { type: 'text', text: phone },
                    { type: 'text', text: plan_interest || 'General' }
                ]);
            }

            const adminEmail = process.env.ADMIN_EMAIL || 'info@siteboard.in';
            console.log('Sending Admin Email to:', adminEmail);
            await sendEmail({
                to: adminEmail,
                subject: `New Lead: ${name}`,
                html: emailTemplates.newLeadAdmin({ name, phone, company_name, city: message, whatsapp: phone })
            });

            // 2. Notification to User (WhatsApp + Email)
            if (phone) {
                const userPhone = phone.replace(/[^0-9]/g, '');
                const formattedPhone = userPhone.length === 10 ? `91${userPhone}` : userPhone;

                console.log('Sending User WhatsApp to:', formattedPhone);
                const waRes = await sendWhatsAppMessage(formattedPhone, 'enquiry_received', [
                    { type: 'text', text: name }
                ]);
                console.log('User WhatsApp Result:', waRes);
            }

            if (email) {
                console.log('Sending User Email to:', email);
                await sendEmail({
                    to: email,
                    subject: 'Welcome to SiteBoard',
                    html: emailTemplates.launchAnnouncement({ name })
                });
            }

            return NextResponse.json({ success: true, id: res.rows[0].id });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Contact Form Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
