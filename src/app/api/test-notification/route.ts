import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { sendEmail } from '@/lib/email';

export async function GET(req: Request) {
    const logs: string[] = [];
    const log = (msg: string, data?: any) => {
        const entry = `${msg} ${data ? JSON.stringify(data) : ''}`;
        console.log(entry);
        logs.push(entry);
    };

    try {
        log('Starting Test Notification...');

        // 1. Check Config
        const config = {
            HAS_DB_URL: !!process.env.DATABASE_URL,
            HAS_ADMIN_PHONE: !!process.env.ADMIN_PHONE,
            HAS_SMTP_HOST: !!process.env.SMTP_HOST,
            HAS_WA_ID: !!process.env.WHATSAPP_PHONE_ID,
            HAS_WA_TOKEN: !!process.env.WHATSAPP_TOKEN,
            ADMIN_PHONE: process.env.ADMIN_PHONE,
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_USER: process.env.SMTP_USER
        };
        log('Configuration Status:', config);

        if (!config.HAS_WA_TOKEN || !config.HAS_WA_ID) {
            log('CRITICAL: WhatsApp Credentials Missing');
        }
        if (!config.HAS_SMTP_HOST) {
            log('CRITICAL: SMTP Credentials Missing');
        }

        // 2. Test WhatsApp
        if (config.ADMIN_PHONE) {
            log(`Attempting WhatsApp to ${config.ADMIN_PHONE}...`);
            const waRes = await sendWhatsAppMessage(config.ADMIN_PHONE, 'hello_world'); // Using standard template or any
            // Actually, let's use 'new_lead_alert' but with dummy data to test the real template
            // Or just try a simple one if 'hello_world' is not available.
            // Let's rely on the response error to tell us if template invalid.
            // Retrying with 'new_lead_alert' as we know that's our target.

            const waRes2 = await sendWhatsAppMessage(config.ADMIN_PHONE, 'new_lead_alert', [
                { type: 'text', text: 'TEST_NAME' },
                { type: 'text', text: 'TEST_PHONE' },
                { type: 'text', text: 'TEST_PLAN' }
            ]);
            log('WhatsApp Result:', waRes2);
        } else {
            log('Skipping WhatsApp: No Admin Phone');
        }

        // 3. Test Email
        const adminEmail = process.env.ADMIN_EMAIL || config.SMTP_USER;
        if (adminEmail) {
            log(`Attempting Email to ${adminEmail}...`);
            const emailRes = await sendEmail({
                to: adminEmail,
                subject: 'Test Notification from SiteBoard',
                html: '<p>If you received this, email is working!</p>'
            });
            log('Email Result:', emailRes);
        } else {
            log('Skipping Email: No Admin Email');
        }

        return NextResponse.json({
            success: true,
            logs
        });

    } catch (error: any) {
        log('TEST FAILED WITH ERROR:', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            logs
        }, { status: 500 });
    }
}
