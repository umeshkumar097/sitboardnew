const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const connectionString = envContent.match(/DATABASE_URL=(.*)/)?.[1]?.trim();

const client = new Client({ connectionString });

async function main() {
    try {
        await client.connect();

        console.log("Adding subscription fields to 'companies' table...");

        await client.query(`
            ALTER TABLE companies
            ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'trial',
            ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active',
            ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
            ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP WITH TIME ZONE;
        `);

        console.log("Migration complete: Subscription fields added.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
    }
}

main();
