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
        console.log("Connected to database.");

        // Add email column if not exists
        await client.query(`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS email TEXT;
    `);
        console.log("Added 'email' column to leads table.");

    } catch (err) {
        console.error("Error migrating database:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
