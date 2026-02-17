import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Neon in some environments, though 'require' mode handles verification usually.
    },
});

export default pool;

export async function getLatestBlogs(limit?: number) {
    const client = await pool.connect();
    try {
        let query = `
            SELECT id, title, slug, excerpt, featured_image, published_at, category
            FROM blogs 
            WHERE published = true 
            ORDER BY published_at DESC 
        `;

        const params: any[] = [];
        if (limit) {
            query += ` LIMIT $1`;
            params.push(limit);
        }

        const res = await client.query(query, params);
        return res.rows;
    } catch (error) {
        console.error('Error fetching latest blogs:', error);
        return [];
    } finally {
        client.release();
    }
}
