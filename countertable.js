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

pool.query(`CREATE SCHEMA IF NOT EXISTS yeni_sema;`)
    .then(() => {
        console.log("Yeni şema oluşturuldu.");
        // Şema oluşturulduktan sonra devam edecek işlemler buraya yazılabilir.
    })
    .catch((err) => {
        console.error("Şema oluşturulurken hata oluştu:", err);
        pool.end();
    });
pool.query(`CREATE TABLE IF NOT EXISTS ogrenci_sayac (
    id SERIAL PRIMARY KEY,
    sayac INTEGER
)`).then(() => {
    console.log("Öğrenci_sayac tablosu oluşturuldu.");
    return pool.query("INSERT INTO ogrenci_sayac (sayac) VALUES (0)");
}).then(() => {
    console.log("Tabloya 0 değeri eklendi.");
    pool.end();
}).catch((err) => {
    console.error("Hata oluştu:", err);
    pool.end();
});
