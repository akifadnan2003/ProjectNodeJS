const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');   // Import dotenv module to read .env file
const dbQueries = require('./dbServices');

dotenv.config();    // Read .env file

const app = express();
const port = 3000;

app.use(express.json());

// Get all students
app.get('/students', async (req, res) => {
   dbQueries.getAllStudents(res);
});

// Add a new student
app.post('/students', async (req, res) => {
    dbQueries.addStudent(req, res);
});

// Update a student
app.put('/students/:id', async (req, res) => {
    dbQueries.updateStudentByID(req, res);
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
    dbQueries.deleteStudentByID(req, res);
});

// Get all departments
app.get('/departments', async (req, res) => {
    dbQueries.getAllDepartments(res);
});

// Add a new department
app.post('/departments', async (req, res) => {
    dbQueries.addDepartment(req, res);
});

// Update a department
app.put('/departments/:id', async (req, res) => {
    dbQueries.updateDepartmentByID(req, res);
});

// Delete a department
app.delete('/departments/:id', async (req, res) => {
    dbQueries.deleteDepartmentByID(req, res);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});