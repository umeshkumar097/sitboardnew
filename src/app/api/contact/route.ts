import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { name, phone, email, message, company_name, plan_interest } = await req.json();

        if (!name || !phone) {
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

            // 1. Notify Admin
            const adminPhone = '919871881183'; // Updated with User provided number
            if (adminPhone) {
                await sendWhatsAppMessage(adminPhone, 'new_lead_alert', [
                    { type: 'text', text: name },
                    { type: 'text', text: phone },
                    { type: 'text', text: plan_interest || 'General' }
                ]);
            }

            // 2. Thank User
            if (phone) {
                // Formatting phone number to ensure it has country code if missing
                // This is a naive check. WhatsApp requires full number with country code.
                // Assuming input might be local.
                const userPhone = phone.replace(/[^0-9]/g, '');
                // If length is 10, assume India (+91)
                const formattedPhone = userPhone.length === 10 ? `91${userPhone}` : userPhone;

                await sendWhatsAppMessage(formattedPhone, 'enquiry_received', [
                    { type: 'text', text: name }
                ]);
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
