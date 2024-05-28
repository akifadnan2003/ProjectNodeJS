// Import the Moment package
const moment = require('moment');
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Database connection configuration
const pool = new Pool({
    host: "localhost",
    user: process.env.DBUSER,
    port: 5432,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

// Function to add timestamp columns to tables
async function addTimestampColumns() {
    try {
        const client = await pool.connect();
        try {
            const tables = ['"bölüm"."Bölüm"', '"ogrenci_sayacideneme1"."ogrenci_sayacdeneme"', '"Öğrenci"."Öğrenci"', '"Öğrenci_bölüm"."Öğrenci_Bölüm"']; // List of your tables with schema
            for (const table of tables) {
                await client.query(`ALTER TABLE ${table} ADD COLUMN created_at TIMESTAMP DEFAULT NOW()`);
                await client.query(`ALTER TABLE ${table} ADD COLUMN updated_at TIMESTAMP DEFAULT NOW()`);
            }
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error adding timestamp columns:', err);
    } finally {
        pool.end();
    }
}

// Call the function to add timestamp columns
addTimestampColumns();
