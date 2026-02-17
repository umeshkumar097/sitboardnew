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
        console.log("Connected to database for Payment Gateways Table Setup.");

        await client.query(`
      CREATE TABLE IF NOT EXISTS payment_gateways (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL, -- razorpay, stripe, cashfree
        api_key TEXT,
        secret_key TEXT,
        webhook_secret TEXT,
        api_endpoint TEXT,
        is_active BOOLEAN DEFAULT FALSE,
        mode TEXT DEFAULT 'test', -- test, live
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Verified 'payment_gateways' table.");

        // Seed blank entries if they don't exist
        const gateways = ['razorpay', 'stripe', 'cashfree'];
        for (const gw of gateways) {
            await client.query(`
                INSERT INTO payment_gateways (name, is_active) 
                VALUES ($1, false) 
                ON CONFLICT (name) DO NOTHING
             `, [gw]);
        }
        console.log("Seeded basic gateways.");

    } catch (err) {
        console.error("Error setting up payment_gateways table:", err);
        process.exit(1);
    } finally {
        await client.end();
        console.log("Database setup complete.");
    }
}

main();
