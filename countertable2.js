const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    host: "localhost",
    user: process.env.DBUSER,
    port: 5432,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('CREATE SCHEMA IF NOT EXISTS ogrenci_sayacideneme1;', (err, result) => {
        //release();
        if (err) {
            console.error('Error creating schema', err.stack);
        } else {
            console.log('Schema created or already exists');
        }
        client.query(`CREATE TABLE IF NOT EXISTS ogrenci_sayacideneme1.ogrenci_sayacdeneme (
            sayac INTEGER PRIMARY KEY
        );`, (err, result) => {
            //release();
            if (err) {
                console.error('Error creating table', err.stack);
            } else {
                console.log('Table created or already exists');
            }
            client.query('INSERT INTO ogrenci_sayacideneme1.ogrenci_sayacdeneme (sayac) VALUES (0);', (err, result) => {
                release();
                if (err) {
                    console.error('Error inserting data', err.stack);
                } else {
                    console.log('Data inserted successfully');
                }
                pool.end();
            });
        });
    });
});
