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
            return NextResponse.json({ success: true, id: res.rows[0].id });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Contact Form Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
