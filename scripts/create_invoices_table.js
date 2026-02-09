const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Creating invoices table...');

        await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id),
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        plan_name VARCHAR(50) NOT NULL,
        period_start TIMESTAMP,
        period_end TIMESTAMP,
        status VARCHAR(20) DEFAULT 'Pending', -- Paid, Pending, Overdue
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

        console.log('Invoices table created successfully.');

        // Check if tax_id column exists in companies table (placeholder)
        // For now we will just stick to the invoices table creation as per plan

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
