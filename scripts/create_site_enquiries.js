const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function createSiteEnquiriesTable() {
    const client = await pool.connect();
    try {
        console.log('Creating site_enquiries table...');

        await client.query(`
      CREATE TABLE IF NOT EXISTS site_enquiries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        company_name TEXT,
        message TEXT,
        plan_interest TEXT,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log('Success: site_enquiries table created.');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        client.release();
        pool.end();
    }
}

createSiteEnquiriesTable();
