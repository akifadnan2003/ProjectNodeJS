const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');   // Import dotenv module to read .env file
const dbQueries = require('./dbServices');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const ensureToken = require('./auth');
// const countertable = require('./countertable');
// const countertable2= require('./countertable2');
// const momenting = require('./momenting');
dotenv.config();    // Read .env file

const app = express();
const port = 3000;

app.use(express.json());

// Get all students
app.get('/students',ensureToken, async (req, res) => {
   dbQueries.getAllStudents(res);
});

// Add a new student
app.post('/students',ensureToken, async (req, res) => {
    dbQueries.addStudent(req, res);
});

// Update a student
app.put('/students/:id',ensureToken, async (req, res) => {
    dbQueries.updateStudentByID(req, res);
});

// Delete a student
app.delete('/students/:id',ensureToken, async (req, res) => {
    dbQueries.deleteStudentByID(req, res);
});

// Get all departments
app.get('/departments',ensureToken , async (req, res) => {
    dbQueries.getAllDepartments(res);
});

// Add a new department
app.post('/departments',ensureToken ,async (req, res) => {
    dbQueries.addDepartment(req, res);
});

// Update a department
app.put('/departments/:id',ensureToken , async (req, res) => {
    dbQueries.updateDepartmentByID(req, res);
});

// Delete a department
app.delete('/departments/:id',ensureToken , async (req, res) => {
    dbQueries.deleteDepartmentByID(req, res);            
});

// Hardcoded user for demonstration *creat user
const user = {
    id: 1,
    username: 'test',
    password: 'password'
};
//login request
app.get('/api/login', (req, res) => {
   //generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    res.json({ token });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});