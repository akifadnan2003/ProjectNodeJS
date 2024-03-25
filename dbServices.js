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
    const { name, email, deptid, counter } = req.body;
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO Öğrenci."Öğrenci" (name, email, deptid, counter) VALUES ($1, $2, $3, $4);', [name, email, deptid, counter]);
        res.status(201).json({ message: 'Student added successfully' });
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
        await client.query('UPDATE Öğrenci."Öğrenci" SET name = $1, email = $2, deptid = $3, counter = $4 WHERE id = $5;', [name, email, deptid, counter, id]);
        res.json({ message: 'Student updated successfully' });
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
        await client.query('DELETE FROM Öğrenci."Öğrenci" WHERE id = $1;', [id]);
        res.json({ message: 'Student deleted successfully' });
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
        await client.query('INSERT INTO Bölüm."Bölüm" (name, dept_std_id) VALUES ($1, $2);', [name, dept_std_id]);
        res.status(201).json({ message: 'Department added successfully' });
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
        await client.query('UPDATE Bölüm."Bölüm" SET name = $1, dept_std_id = $2 WHERE id = $3;', [name, dept_std_id, id]);
        res.json({ message: 'Department updated successfully' });
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
        await client.query('DELETE FROM Bölüm."Bölüm" WHERE id = $1;', [id]);
        res.json({ message: 'Department deleted successfully' });
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
}