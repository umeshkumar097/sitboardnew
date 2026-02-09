const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function seed() {
    const client = await pool.connect();
    try {
        console.log('Seeding test data...');

        // 1. Get or Create Company
        let companyRes = await client.query("SELECT id FROM companies LIMIT 1");
        let companyId;

        if (companyRes.rowCount === 0) {
            console.log('No company found, creating one...');
            const newCo = await client.query(`
            INSERT INTO companies (name, email, plan, subscription_status) 
            VALUES ('Test Company', 'test@example.com', 'business', 'active') 
            RETURNING id
        `);
            companyId = newCo.rows[0].id;
        } else {
            companyId = companyRes.rows[0].id;
        }

        // 2. Create Invoice
        const invRes = await client.query(`
        INSERT INTO invoices (company_id, invoice_number, amount, plan_name, period_start, period_end, status)
        VALUES ($1, $2, $3, $4, NOW(), NOW() + INTERVAL '1 year', 'Paid')
        RETURNING id, invoice_number
    `, [companyId, `INV-TEST-${Date.now()}`, 99.00, 'business']);

        console.log(`Created Invoice ID: ${invRes.rows[0].id}, Number: ${invRes.rows[0].invoice_number}`);
        console.log(`Verify at: http://localhost:3000/invoices/${invRes.rows[0].id}`);

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
