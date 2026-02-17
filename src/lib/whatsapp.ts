import { NextResponse } from 'next/server';

const WHATSAPP_PHONE_ID = '375803518953145';
const WHATSAPP_TOKEN = 'EAANPIHaxlO4BQOPfWEQFL0fmivpSB09yb36B84HIt08im5yLv6VsZC2fFFo9xOZBfBl2i7LzSMRDD5UIisK2O5AekJtlhYYMj38xyEkZByipNIP1P7qeIjK2bFA4nrVjaM0G7yvZAIw4ZCptMXc2gdMxaAjiWKEd9z4q758ff9nvpNf3763dJDMpHMiMdXAZDZD';

export async function sendWhatsAppMessage(to: string, templateName: string, components: any[] = []) {
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
                    components: components
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
