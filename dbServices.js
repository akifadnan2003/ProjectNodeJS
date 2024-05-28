const { Pool } = require('pg');
const moment = require('moment');
const dotenv = require('dotenv');   // Import dotenv module to read .env file
dotenv.config();    // Read .env file

const pool = new Pool({
    host: "localhost",
    user: process.env.DBUSER,
    port: 5432,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

// Get all students
exports.getAllStudents = async (res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM Öğrenci."Öğrenci";');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
}

// Add a new student
exports.addStudent = async (req, res) => {
    const { name, email, deptid } = req.body;
    const client = await pool.connect();
    try {
        // Check if a student with the same email already exists
        const result = await client.query('SELECT * FROM "Öğrenci"."Öğrenci" WHERE email = $1;', [email]);
        if (result.rows.length > 0) {
            res.status(400).json({ message: 'A student with this email already exists' });
        } else {
            // Öğrenci eklenmeden önce sayaç değerini al
            const countResult = await client.query('SELECT sayac FROM ogrenci_sayacideneme1.ogrenci_sayacdeneme');
            console.log(countResult);
            let counter = 0;
            if (countResult.rows.length > 0) {
                counter = countResult.rows[0].sayac;
            }

            counter = countResult.rows[0].sayac;


            // Öğrenciyi ekle
            const createdAt = moment().format();
            const updatedAt = moment().format();
            await client.query('INSERT INTO "Öğrenci"."Öğrenci" (name, email, deptid, counter, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6);', [name, email, deptid, counter, createdAt, updatedAt]);


            /* Öğrenciyi ekle
            await client.query('INSERT INTO "Öğrenci"."Öğrenci" (name, email, deptid, counter) VALUES ($1, $2, $3, $4);', [name, email, deptid, counter]);
            */



            // Sayaç değerini arttır
            await client.query('UPDATE ogrenci_sayacideneme1.ogrenci_sayacdeneme SET sayac = sayac + 1');

            res.status(201).json({ message: 'Student added successfully' });
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
}

// Update a student
exports.updateStudentByID = async (req, res) => {
    const { name, email, deptid, counter } = req.body;
    const { id } = req.params;
    const client = await pool.connect();
    try {
        // Check if a student with the given ID exists
        const result = await client.query('SELECT * FROM Öğrenci."Öğrenci" WHERE id = $1;', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No student found with this ID' });
        } else {
            const updatedAt = moment().format();
            await client.query('UPDATE Öğrenci."Öğrenci" SET name = $1, email = $2, deptid = $3, counter = $4, updated_at = $5 WHERE id = $6;', [name, email, deptid, counter, updatedAt, id]);
            res.json({ message: 'Student updated successfully' });
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
}

// Delete a student
exports.deleteStudentByID = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        // Check if a student with the given ID exists
        const result = await client.query('SELECT * FROM Öğrenci."Öğrenci" WHERE id = $1;', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No student found with this ID' });
        } else {
            await client.query('DELETE FROM Öğrenci."Öğrenci" WHERE id = $1;', [id]);

            // Öğrenci eklenmeden önce sayaç değerini al
            const countResult = await client.query('SELECT sayac FROM ogrenci_sayacideneme1.ogrenci_sayacdeneme');
            console.log(countResult);
            let counter = 0;
            if (countResult.rows.length > 0) {
                counter = countResult.rows[0].sayac;
            }

            counter = countResult.rows[0].sayac;

            // Sayaç değerini azalt
            await client.query('UPDATE ogrenci_sayacideneme1.ogrenci_sayacdeneme SET sayac = sayac - 1');

            res.status(201).json({ message: 'Student deleted successfully' });
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
// Get all departments
exports.getAllDepartments = async (res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM bölüm."Bölüm";');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
}

// Add a new department
exports.addDepartment = async (req, res) => {
    const { name, dept_std_id } = req.body;
    const client = await pool.connect();
    try {
        // Check if a department with the same name already exists
        const result = await client.query('SELECT * FROM Bölüm."Bölüm" WHERE name = $1;', [name]);
        if (result.rows.length > 0) {
            res.status(400).json({ message: 'A department with this name already exists' });
        } else {
            const createdAt = moment().format();
            const updatedAt = moment().format();
            await client.query('INSERT INTO Bölüm."Bölüm" (name, dept_std_id, created_at, updated_at) VALUES ($1, $2, $3, $4);', [name, dept_std_id, createdAt, updatedAt]);
            res.status(201).json({ message: 'Department added successfully' });
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
}

// Update a department
exports.updateDepartmentByID = async (req, res) => {
    const { name, dept_std_id } = req.body;
    const { id } = req.params;
    const client = await pool.connect();
    try {
        // Check if a department with the given ID exists
        const result = await client.query('SELECT * FROM Bölüm."Bölüm" WHERE id = $1;', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No department found with this ID' });
        } else {
            const updatedAt = moment().format();
            await client.query('UPDATE Bölüm."Bölüm" SET name = $1, dept_std_id = $2, updated_at = $3 WHERE id = $4;', [name, dept_std_id, updatedAt, id]);
            res.json({ message: 'Department updated successfully' });
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
}

// Delete a department
exports.deleteDepartmentByID = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        // Check if a department with the given ID exists
        const result = await client.query('SELECT * FROM Bölüm."Bölüm" WHERE id = $1;', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No department found with this ID' });
        } else {
            await client.query('DELETE FROM Bölüm."Bölüm" WHERE id = $1;', [id]);
            res.json({ message: 'Department deleted successfully' });
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
}