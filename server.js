const inquirer = require('inquirer');
const db = require('./db/db.js');

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
};

// function to view all departments
async function viewAllDepartments() {
    try {
      const [departments] = await db.query('SELECT * FROM department');
      console.table(departments);
    } catch (error) {
      console.error('Error executing query:', error);
    }
    promptMainMenu();
  };

// function to view roles
async function viewAllRoles() {
    try {
        const query = `
        SELECT role.id,
               role.title,
               role.salary,
               department.name AS department
        FROM role
        INNER JOIN department ON role.department_id = department.id
        `;
        const [roles] = await db.query(query);
        console.table(roles);
    } catch (error) {
        console.error('Error executing query:', error);
    }
    promptMainMenu();
};

// function to view employees
async function viewAllEmployees() {
    try {
      const query = `
        SELECT employee.id,
               employee.first_name,
               employee.last_name,
               role.title,
               department.name AS department, role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
      `;
      const [employees] = await db.query(query);
      console.table(employees);
    } catch (error) {
      console.error('Error executing query:', error);
    }
    promptMainMenu();
  };

promptMainMenu();