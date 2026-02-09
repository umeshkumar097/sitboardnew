const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const connectionString = envContent.match(/DATABASE_URL=(.*)/)?.[1]?.trim();

if (!connectionString) {
    console.error('DATABASE_URL not found in .env.local');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function main() {
    try {
        await client.connect();
        console.log("Connected to database for Leads Table Migration.");

        // DROP existing table to accommodate new schema
        await client.query('DROP TABLE IF EXISTS leads CASCADE');

        await client.query(`
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
                agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                budget NUMERIC,
                status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'booked', 'lost')),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Created 'leads' table.");

    } catch (err) {
        console.error("Error migrating leads table:", err);
        process.exit(1);
    } finally {
        await client.end();
        console.log("Migration complete.");
    }
}

main();
