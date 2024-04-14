const express = require('express');
const dotenv = require('dotenv');  
dotenv.config();    // Read .env file

const dbSetup = require('./databasepg');
const dbServices = require('./dbServices');

const app = express();
const port = 3000;

app.use(express.json());

// Get all students
app.get('/students', async (req, res) => {
   dbServices.getAllStudents(res);
});

// Add a new student
app.post('/students', async (req, res) => {
    dbServices.addStudent(req, res);
});

// Update a student
app.put('/students/:id', async (req, res) => {
    dbServices.updateStudentByID(req, res);
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
    dbServices.deleteStudentByID(req, res);
});

// Get all departments
app.get('/departments', async (req, res) => {
    dbServices.getAllDepartments(res);
});

// Add a new department
app.post('/departments', async (req, res) => {
    dbServices.addDepartment(req, res);
});

// Update a department
app.put('/departments/:id', async (req, res) => {
    dbServices.updateDepartmentByID(req, res);
});

// Delete a department
app.delete('/departments/:id', async (req, res) => {
    dbServices.deleteDepartmentByID(req, res);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});