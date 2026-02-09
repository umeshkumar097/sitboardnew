const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const crypto = require('crypto');

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

async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
    });
}

async function main() {
    try {
        await client.connect();
        console.log("Connected to database for Core Schema Setup.");

        // 1. Companies Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Verified 'companies' table.");

        // 2. Users Table (Super Admin, Company Admin, Agents)
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL, -- NULL for Super Admin
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('super_admin', 'company_admin', 'agent')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Verified 'users' table.");

        // 3. Projects Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Verified 'projects' table.");

        // 4. Plots Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS plots (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        plot_number TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'sold')),
        price NUMERIC,
        dimension TEXT,
        facing TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, plot_number) -- Prevent duplicate plot numbers in a project
      );
    `);
        console.log("Verified 'plots' table.");

        // 5. Bookings Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        plot_id INTEGER REFERENCES plots(id) ON DELETE CASCADE,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE, -- Denormalized for query speed/isolation
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE, -- Denormalized for isolation
        user_id INTEGER REFERENCES users(id), -- Agent who booked
        client_name TEXT NOT NULL,
        booking_amount NUMERIC NOT NULL,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'completed'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Verified 'bookings' table.");

        // 6. Sales Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        plot_id INTEGER REFERENCES plots(id) ON DELETE CASCADE,
        booking_id INTEGER REFERENCES bookings(id),
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id), -- Agent/Admin who sold
        client_name TEXT NOT NULL,
        sale_amount NUMERIC NOT NULL,
        sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Verified 'sales' table.");

        // --- Seed Initial Data ---

        // Check if Super Admin exists, if not create one
        const res = await client.query("SELECT * FROM users WHERE role = 'super_admin' LIMIT 1");
        if (res.rowCount === 0) {
            console.log("Seeding Super Admin...");
            const passwordHash = await hashPassword('admin123');
            await client.query(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
      `, ['Super Admin', 'admin@siteboard.com', passwordHash, 'super_admin']);
            console.log("Super Admin created: admin@siteboard.com / admin123");
        } else {
            console.log("Super Admin already exists.");
        }

    } catch (err) {
        console.error("Error setting up core DB:", err);
        process.exit(1);
    } finally {
        await client.end();
        console.log("Database setup complete.");
    }
}

main();
