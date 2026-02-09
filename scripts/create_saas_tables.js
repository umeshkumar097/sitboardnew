const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Starting Phase 1 Database Migration...');

        // 1. Create subscription_plans table
        console.log('Creating subscription_plans table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        duration VARCHAR(20) NOT NULL, -- 'monthly' or 'yearly'
        features JSONB DEFAULT '{}', -- e.g. { "max_projects": 5, "max_plots": 100 }
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

        // Seed Default Plans if empty
        const plansRes = await client.query('SELECT COUNT(*) FROM subscription_plans');
        if (parseInt(plansRes.rows[0].count) === 0) {
            console.log('Seeding default subscription plans...');
            await client.query(`
            INSERT INTO subscription_plans (name, price, currency, duration, features) VALUES
            ('Starter', 29.00, 'USD', 'monthly', '{"max_projects": 3, "max_plots": 150}'),
            ('Starter', 290.00, 'USD', 'yearly', '{"max_projects": 3, "max_plots": 150}'),
            ('Business', 79.00, 'USD', 'monthly', '{"max_projects": 10, "max_plots": 1000}'),
            ('Business', 790.00, 'USD', 'yearly', '{"max_projects": 10, "max_plots": 1000}'),
            ('Enterprise', 299.00, 'USD', 'monthly', '{"max_projects": -1, "max_plots": -1}'), -- -1 for unlimited
            ('Enterprise', 2990.00, 'USD', 'yearly', '{"max_projects": -1, "max_plots": -1}')
        `);
        }

        // 2. Create payment_settings table
        console.log('Creating payment_settings table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS payment_settings (
        id SERIAL PRIMARY KEY,
        gateway_name VARCHAR(50) UNIQUE NOT NULL, -- 'stripe', 'razorpay'
        is_enabled BOOLEAN DEFAULT false,
        public_key VARCHAR(255),
        secret_key VARCHAR(255),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

        // Seed Default Gateways if empty
        const gatewaysRes = await client.query('SELECT COUNT(*) FROM payment_settings');
        if (parseInt(gatewaysRes.rows[0].count) === 0) {
            console.log('Seeding default payment settings...');
            await client.query(`
            INSERT INTO payment_settings (gateway_name, is_enabled) VALUES
            ('stripe', false),
            ('razorpay', false)
        `);
        }

        // 3. Create payments table
        console.log('Creating payments table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id),
        gateway VARCHAR(50) NOT NULL,
        transaction_id VARCHAR(100) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(20) NOT NULL, -- 'success', 'failed', 'pending'
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

        // 4. Enhance invoices table
        console.log('Enhancing invoices table...');
        // Check if column exists strictly before adding
        // Using a safe alter approach in pg
        await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='payment_id') THEN
          ALTER TABLE invoices ADD COLUMN payment_id INTEGER REFERENCES payments(id);
        END IF;
      END $$;
    `);

        console.log('Database Schema Updated Successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
