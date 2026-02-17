import { NextResponse } from 'next/server';

const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

export async function sendWhatsAppMessage(to: string, templateName: string, components: any[] = []) {
    console.log(`Sending WhatsApp attempt. To: ${to}, Template: ${templateName}, PhoneID: ${WHATSAPP_PHONE_ID ? 'Set' : 'Missing'}, Token: ${WHATSAPP_TOKEN ? 'Set' : 'Missing'}`);

    if (!WHATSAPP_PHONE_ID || !WHATSAPP_TOKEN) {
        console.error('WhatsApp Error: Missing WHATSAPP_PHONE_ID or WHATSAPP_TOKEN in environment variables.');
        return { success: false, error: 'Missing Credentials' };
    }

    try {
        const response = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: to,
                type: 'template',
                template: {
                    name: templateName,
                    language: {
                        code: 'en_US',
                    },
                    components: components.length > 0 && !components[0].type ? [{
                        type: 'body',
                        parameters: components
                    }] : components
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('WhatsApp API Error:', data);
            return { success: false, error: data };
        }

        return { success: true, data };
    } catch (error) {
        console.error('WhatsApp Send Error:', error);
        return { success: false, error };
    }
}
