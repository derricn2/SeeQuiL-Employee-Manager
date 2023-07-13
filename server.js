const mysql = require('mysql2');
const inquirer = require('inquirer');

// connection to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'enter_username',
        password: 'enter_password',
        database: 'enter_database',
    },
    console.log('Connected to the employee_db database')
);

