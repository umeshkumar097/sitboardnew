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
        console.log("Connected to database for Blogs Table Setup.");

        await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image TEXT,
        meta_title TEXT,
        meta_description TEXT,
        author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        published BOOLEAN DEFAULT FALSE,
        views INTEGER DEFAULT 0,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Verified 'blogs' table.");

        // Add index on slug for faster lookups
        await client.query(`CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);`);
        console.log("Verified index on 'slug'.");

        // Add index on published for filtering
        await client.query(`CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);`);
        console.log("Verified index on 'published'.");

    } catch (err) {
        console.error("Error setting up blogs table:", err);
        process.exit(1);
    } finally {
        await client.end();
        console.log("Database setup complete.");
    }
}

main();
