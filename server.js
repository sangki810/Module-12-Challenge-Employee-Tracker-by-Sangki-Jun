const consoleTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'employees_db',
});

connection.connect(err => {
    if (err) throw err;
    init();
});

function init() {
    inquirer.createPromptModule([
        {
            name: 'mainMenu',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
        }
    ]).then(response => {
        switch (response.mainMenu) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addADepartment();
                break;
            case 'Add a Role':
                addARole();
                break;
            case 'Add an Employee':
                addAnEmployee();
                break;
            case 'Update an Employee Role':
                updateAnEmployeeRole();
                break;
            case 'Quit':
                connection.end();
                return;
            default:
                break;
        }
    })
}
