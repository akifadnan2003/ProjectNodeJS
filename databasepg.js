const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    user: process.env.DBUSER, //mine was "postgres" if it is default
    port: 5432,
    password: process.env.DBPASS,
    database: "postgres"
});

// Connect to PostgreSQL
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }

    // Create a new database
    client.query('CREATE DATABASE database5;', (err, result) => {
        release(); // Release the client back to the pool

        if (err) {
            return console.error('Error executing query', err.stack);
        }

        console.log('Database created successfully');

        // Connect to the new database
        const newPool = new Pool({
            host: "localhost",
            user: "postgres",
            port: 5432,
            password: "password",
            database: "database5"
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
});
