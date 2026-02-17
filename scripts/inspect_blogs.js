const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const connectionString = envContent.match(/DATABASE_URL=(.*)/)?.[1]?.trim();

const client = new Client({ connectionString });

async function main() {
    try {
        await client.connect();
        console.log("Connected. Querying blogs table...");

        const res = await client.query('SELECT id, title, slug, published, published_at FROM blogs');
        console.log(`Found ${res.rowCount} blogs:`);
        console.table(res.rows);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

main();
