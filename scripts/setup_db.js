const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
// Simple regex to extract the URL, assumes no complex quoting or multiline
const connectionString = envContent.match(/DATABASE_URL=(.*)/)?.[1]?.trim();

if (!connectionString) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

console.log("Connecting using:", connectionString.replace(/:[^:]*@/, ':****@')); // Log masked URL

const client = new Client({
  connectionString: connectionString,
});

async function main() {
  try {
    await client.connect();
    console.log("Connected to database.");
    
    // Create leads table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        company_name TEXT,
        city TEXT,
        whatsapp TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'leads' created or already exists.");
    
  } catch (err) {
    console.error("Error setting up database:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
