const mysql = require('mysql2/promise');
const { runMigrations } = require('./migrations');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'suvidha_kiosk',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined
};

const pool = mysql.createPool(dbConfig);

// Test connection and run migrations
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();

        // Auto-run migrations to ensure tables exist
        await runMigrations(pool);

        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.log('Application will continue in demo mode with file-based storage');
        return false;
    }
};

module.exports = { pool, testConnection };
