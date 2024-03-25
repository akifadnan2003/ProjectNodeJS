const { Pool } = require('pg');
const dotenv = require('dotenv');   // Import dotenv module to read .env file

dotenv.config();    // Read .env file

const pool = new Pool({
    host: "localhost",
    user: process.env.DBUSER,
    port: 5432,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

// Connect to PostgreSQL
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }

    // Check if the database already exists
    client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DBNAME}';`, (err, result) => {
        release(); // Release the client back to the pool

        if (err) {
            return console.error('Error executing query', err.stack);
        }

        if (result.rows.length > 0) {
            console.log('Database already exists');
        } else {
            // Create a new database
            client.query('CREATE DATABASE ' + process.env.DBNAME + ';', (err, result) => {
                release(); // Release the client back to the pool

                if (err) {
                    return console.error('Error executing query', err.stack);
                }

                console.log('Database created successfully');

                // Connect to the new database
                const newPool = new Pool({
                    host: "localhost",
                    user: process.env.DBUSER,
                    port: 5432,
                    password: process.env.DBPASS,
                    database: process.env.DBNAME
                });

                // Connect to the new database
                newPool.connect((err, client, release) => {
                    if (err) {
                        return console.error('Error acquiring client', err.stack);
                    }

                    // Create schemas in the new database
                    const createSchemaQueries = [
                        'CREATE SCHEMA IF NOT EXISTS Öğrenci;',
                        'CREATE SCHEMA IF NOT EXISTS Öğrenci_Bölüm;',
                        'CREATE SCHEMA IF NOT EXISTS Bölüm;'
                    ];

                    createSchemaQueries.forEach((query) => {
                        client.query(query, (err, result) => {
                            if (err) {
                                return console.error('Error executing query', err.stack);
                            }

                            console.log('Schema created successfully');
                        });
                    });

                    // Create tables in each schema
                    const createTableQueries = [
                        `CREATE TABLE IF NOT EXISTS Öğrenci."Öğrenci" (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), deptid INT, counter INT);`,
                        `CREATE TABLE IF NOT EXISTS Öğrenci_Bölüm."Öğrenci_Bölüm" (id SERIAL PRIMARY KEY, user_id INT, dept_id INT);`,
                        `CREATE TABLE IF NOT EXISTS Bölüm."Bölüm" (id SERIAL PRIMARY KEY, name VARCHAR(255), dept_std_id INT);`
                    ];

                    createTableQueries.forEach((tableQuery) => {
                        client.query(tableQuery, (err, result) => {
                            if (err) {
                                return console.error('Error executing query', err.stack);
                            }

                            console.log('Table created successfully');
                        });
                    });

                    // Add rows to the tables in each schema
                    const addRowsQueries = [
                        `INSERT INTO Öğrenci."Öğrenci" (name, email, deptid, counter) VALUES ('John Doe', 'john.doe@example.com', 1, 0);`,
                        `INSERT INTO Öğrenci_Bölüm."Öğrenci_Bölüm" (user_id, dept_id) VALUES (1, 1);`,
                        `INSERT INTO Bölüm."Bölüm" (name, dept_std_id) VALUES ('Computer Science', 1);`
                    ];

                    addRowsQueries.forEach((query) => {
                        client.query(query, (err, result) => {
                            if (err) {
                                return console.error('Error executing query', err.stack);
                            }

                            console.log('Row added successfully');
                        });
                    });

                    release(); // Release the client back to the pool
                });
            });
        }
    });
});