import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Validate ID is a number
    if (isNaN(parseInt(id))) {
        return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
        const result = await client.query('SELECT id, name, email, role, company_id FROM users WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, email, role, password } = await req.json();

    if (!name || !email || !role) {
        return NextResponse.json({ error: 'Name, Email, and Role are required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
        if (password && password.trim() !== '') {
            // Update with password
            const hashedPassword = await hashPassword(password);
            await client.query(
                `UPDATE users SET name = $1, email = $2, role = $3, password_hash = $4 WHERE id = $5`,
                [name, email, role, hashedPassword, id]
            );
        } else {
            // Update without password
            await client.query(
                `UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4`,
                [name, email, role, id]
            );
        }

        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error: any) {
        console.error('Error updating user:', error);
        if (error.code === '23505') { // Unique violation for email
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}
