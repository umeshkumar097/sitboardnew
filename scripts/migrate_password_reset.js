const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migratePasswordReset() {
    const client = await pool.connect();
    try {
        console.log('Adding password reset columns to users table...');

        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS reset_token TEXT,
            ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
        `);

        console.log('Successfully added reset_token and reset_token_expiry columns.');

    } catch (err) {
        console.error('Error migrating users table:', err);
    } finally {
        client.release();
        pool.end();
    }
}

migratePasswordReset();
