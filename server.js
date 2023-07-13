const mysql = require('mysql2');
const inquirer = require('inquirer');

// connection to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Fugma!123',
        database: 'employee_db',
    },
    console.log('Connected to the employee_db database')
);

// display main menu
async function promptMainMenu() {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit',
            ],
        },
    ]);

    // call appropriate function based on choice
    switch (choice) {
        case 'View all departments':
            await viewAllDepartments();
            break;
        case 'View all roles':
            await viewAllRoles();
            break;
        case 'View all employees':
            await viewAllEmployees();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Exit':
            console.log('Exiting...');
            process.exit();
    }
}

promptMainMenu();