const { Client, Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    port: process.env.DBPORT,
    password: process.env.DBPASS,
});

const dbName = process.env.DBNAME;
let pool;

// Check if the database exists, if not create it
function checkDatabase(client, dbName) {
    return client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName])
        .then(results => {
            if (results.rowCount === 0) {
                return client.query('CREATE DATABASE $1', [dbName])
                    .then(() => false); // Database did not exist, but it was created
            } else {
                return true; // Database exists
            }
        });
}

// Connect to the database
function connectToDatabase(dbName) {
    pool = new Pool({ // Assign to the top-level pool variable
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        port: process.env.DBPORT,
        password: process.env.DBPASS,
        database: dbName
    });
    return pool.connect();
}

// Create schemas
function createSchemas() {
    const createSchemaQueries = [
        'CREATE SCHEMA IF NOT EXISTS Öğrenci;',
        'CREATE SCHEMA IF NOT EXISTS Öğrenci_Bölüm;',
        'CREATE SCHEMA IF NOT EXISTS Bölüm;'
    ];
    return Promise.all(createSchemaQueries.map(query => pool.query(query)));
}

// Create tables in the database with the created schemas
function createTables() {
    const createTableQueries = [
        `CREATE TABLE IF NOT EXISTS Öğrenci."Öğrenci" (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), deptid INT, counter INT);`,
        `CREATE TABLE IF NOT EXISTS Öğrenci_Bölüm."Öğrenci_Bölüm" (id SERIAL PRIMARY KEY, user_id INT, dept_id INT);`,
        `CREATE TABLE IF NOT EXISTS Bölüm."Bölüm" (id SERIAL PRIMARY KEY, name VARCHAR(255), dept_std_id INT);`
    ];
    return Promise.all(createTableQueries.map(query => pool.query(query)));
}

// Add sample data to the tables
function addRows() {
    const addRowsQueries = [
        `INSERT INTO Öğrenci."Öğrenci" (name, email, deptid, counter) VALUES ('John Doe', 'john.doe@example.com', 1, 0);`,
        `INSERT INTO Öğrenci_Bölüm."Öğrenci_Bölüm" (user_id, dept_id) VALUES (1, 1);`,
        `INSERT INTO Bölüm."Bölüm" (name, dept_std_id) VALUES ('Computer Science', 1);`
    ];
    return Promise.all(addRowsQueries.map(query => pool.query(query)));
}

// Connect to the database and create schemas, tables and add rows
client.connect()
    .then(() => checkDatabase(client, dbName))
    .then(databaseExists => {
        if (databaseExists) {
            console.log("Database exists, skipping the rest of the functions");
            return;
        }
        return connectToDatabase(dbName)
            .then(() => createSchemas())
            .then(() => createTables())
            .then(() => addRows());
    })
    .catch(err => console.error(err))
    .finally(() => client.end());