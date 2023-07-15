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

// Function to add a department
async function addDepartment() {
    const { departmentName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
      },
    ]);
  
    try {
      await db.query('INSERT INTO department (name) VALUES (?)', [departmentName]);
      console.log('Department added successfully!');
    } catch (error) {
      console.error('Error executing query:', error);
    }
    promptMainMenu();
  }

// Function to add a role
async function addRole() {
    // Fetch the list of departments from the database
    const [departments] = await db.query('SELECT * FROM department');
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));
  
    // Prompt user for role details
    const roleQuestions = [
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for the role:',
        choices: departmentChoices,
      },
    ];
    const roleAnswers = await inquirer.prompt(roleQuestions);
  
    // Execute INSERT query to add the role to the database
    try {
      await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [
        roleAnswers.title,
        roleAnswers.salary,
        roleAnswers.departmentId,
      ]);
      console.log('Role added successfully!');
    } catch (error) {
      console.error('Error executing query:', error);
    }
    promptMainMenu();
  }
  
// Function to add an employee
async function addEmployee() {
    // Fetch the list of roles and employees from the database
    const [roles] = await db.query('SELECT * FROM role');
    const roleChoices = roles.map((role) => ({ name: role.title, value: role.id }));
  
    const [employees] = await db.query('SELECT * FROM employee');
    const managerChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
  
    // Prompt user for employee details
    const employeeQuestions = [
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the first name of the employee:',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the last name of the employee:',
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the role for the employee:',
        choices: roleChoices,
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Select the manager for the employee:',
        choices: [{ name: 'None', value: null }, ...managerChoices],
      },
    ];
    const employeeAnswers = await inquirer.prompt(employeeQuestions);
  
    // Execute INSERT query to add the employee to the database
    try {
      await db.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [
          employeeAnswers.firstName,
          employeeAnswers.lastName,
          employeeAnswers.roleId,
          employeeAnswers.managerId,
        ]
      );
      console.log('Employee added successfully!');
    } catch (error) {
      console.error('Error executing query:', error);
    }
    promptMainMenu();
  };
  
// Function to update an employee's role
async function updateEmployeeRole() {
    // Fetch the list of employees from the database
    const [employees] = await db.query('SELECT * FROM employee');
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
  
    // Prompt user to select an employee
    const employeeQuestion = {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to update:',
      choices: employeeChoices,
    };
    const employeeAnswer = await inquirer.prompt(employeeQuestion);
  
    // Fetch the list of roles from the database
    const [roles] = await db.query('SELECT * FROM role');
    const roleChoices = roles.map((role) => ({ name: role.title, value: role.id }));
  
    // Prompt user to select a new role for the employee
    const roleQuestion = {
      type: 'list',
      name: 'roleId',
      message: 'Select the new role for the employee:',
      choices: roleChoices,
    };
    const roleAnswer = await inquirer.prompt(roleQuestion);
  
    // Execute UPDATE query to update the employee's role
    try {
      await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [
        roleAnswer.roleId,
        employeeAnswer.employeeId,
      ]);
      console.log('Employee role updated successfully!');
    } catch (error) {
      console.error('Error executing query:', error);
    }
    promptMainMenu();
  }

promptMainMenu();