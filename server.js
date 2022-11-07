// dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');

// creates connection point to the database needed for this program in mysql
const connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'employees_db',
});

// connects to mysql database using location and credentials above
connection.connect(err => {
    if (err) throw err;
    init();
});

// jumbotron image to be displayed in CLI
console.log(`
╔═══╗─────╔╗──────────────╔═╗╔═╗
║╔══╝─────║║──────────────║║╚╝║║
║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
───────║║──────╔═╝║─────────────────────╔═╝║
───────╚╝──────╚══╝─────────────────────╚══╝`);

// initalizes app, holds main menu question
function init() {
    inquirer.prompt([
        {
            name: 'mainMenu',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Departments', 
                'View All Roles', 
                'View All Employees', 
                'Add a Department', 
                'Add a Role', 
                'Add an Employee', 
                'Update an Employee Role', 
                'Quit'
            ]
        }
    ]).then(answer => {
        // calls functions below that matches the answer to question above
        switch (answer.mainMenu) {
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
            // ends app when chosen
            case 'Quit':
                connection.end();
                return;
            default:
                break;
        }
    })
};

// displays department table from mysql database in CLI
function viewAllDepartments() {
    // sql command held in separate variable
    const sqlString=`
    SELECT *
    FROM department`

    // connects to specific data from databse using variable above
    connection.query(sqlString, (err, data) => {
        if(err) throw err;
        console.log("\n");
        // displays table
        console.table(data);
        console.log("\n");
        init()
    })
};

// displays role table from mysql database in CLI
function viewAllRoles() {
    // sql command held in separate variable
    const sqlString=`
    SELECT *
    FROM role`

    // connects to specific data from databse using variable above
    connection.query(sqlString, (err, data) => {
        if(err) throw err;
        console.log("\n");
        // displays table
        console.table(data);
        console.log("\n");
        init();
    })
};

// displays employee table from mysql database in CLI
function viewAllEmployees() {
    // sql command held in separate variable
    const sqlString=`
    SELECT *
    FROM employee`

    // connects to specific data from databse using variable above
    connection.query(sqlString, (err, data) => {
        if(err) throw err;
        console.log("\n");
        // displays table
        console.table(data);
        console.log("\n");
        init()
    })
};

// adds a new department to the databse in mysql
function addADepartment() {
    inquirer.prompt([
        {
            name: 'depName',
            message: 'What is the name of the department?'
            
        }
    ]).then(answer => {
        // sql command held in separate variable
        const sqlString=`
        INSERT INTO department(name)
        VALUES (?)`
        
        connection.query(sqlString, [answer.depName], (err, data) => {
            if(err) throw err;
            // called to confirm changes made to the database
            viewAllDepartments();
        })
    }) 
};

// adds a new role to the databse in mysql
function addARole() {
    // sql command held in separate variable
    const sqlString = `
    SELECT *
    FROM department;`

    // connects to specific data from databse using variable above
    connection.query(sqlString, (err, data) =>{
        if(err) throw err;
        // creates new object from department table that is used to display choices
        let departments = data.map(department => ({name: department.name, value: department.id }));
        inquirer.prompt([
            {
                name: 'roleTitle',
                message: 'What is the name of the role?'
            
            },
            {
                name: 'roleSalary',
                message: 'What is the salary of the role?'
            },
            {
                name: 'roleDepartment',
                message: 'Which department does the role belong to?',
                type: 'list',
                // displays department names as choices but holds department(id) as value
                choices: departments
            }
        ]).then(answer => {
            // sql command held in separate variable
            const sqlString=`
            INSERT INTO role
            SET ?`
            
            // connects to specific data from databse using variable above
            connection.query(sqlString, 
                {
                    // new role given its attributes based on user input above
                    title: answer.roleTitle, 
                    salary: answer.roleSalary, 
                    department_id: answer.roleDepartment
                }, 
                (err, data) => {
                if(err) throw err;
                // called to confirm changes made to the database
                viewAllRoles();
            })
        }) 
    })
};

// adds a new employee to the databse in mysql
function addAnEmployee() {
    // sql command held in separate variable
    const sqlString1 = `
    SELECT *
    FROM role;`

    const sqlString2 =`
    SELECT * 
    FROM employee`

    // connects to specific data from databse using variable above
    connection.query(sqlString1, (err, data) =>{
        if(err) throw err;
        // creates new object from role table that is used to display choices
        let roles = data.map(role => ({name: role.title, value: role.id }));
        connection.query(sqlString2, (err, data) => {
            if(err) throw err;
            // creates new object from employee table that is used to display choices
            let employees = data.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id}));
            inquirer.prompt([
                {
                    name: 'empFirstName',
                    message: 'What is the employee\'s first name?'
            
                },
                {
                    name: 'empLastName',
                    message: 'What is the employee\'s last name?'
                },
                {
                    name: 'empRole',
                    message: 'What is the employee\'s role?',
                    type: 'list',
                    // displays role titles as choices but holds role(id) as value
                    choices: roles
                },
                {
                    name: 'empManager',
                    message: 'Who is the employee\'s manager?',
                    type: 'list',
                    // displays employee names (first and last) as choices but holds employee(id) as value
                    choices: employees

                }
            ]).then(answer => {
                // sql command held in separate variable
                const sqlString=`
                INSERT INTO employee
                SET ?`
        
                connection.query(sqlString, 
                    {
                        // new employee given its attributes based on user input above
                        first_name: answer.empFirstName,
                        last_name: answer.empLastName,
                        role_id: answer.empRole,
                        manager_id: answer.empManager
                    }, 
                    (err, data) => {
                    if(err) throw err;
                    // called to confirm changes made to the database
                    viewAllEmployees();
                })
            }) 
        })
    })
};

// updates role of existing employee
function updateAnEmployeeRole() {
    // sql command held in separate variable
    const sqlString1 = `
    SELECT *
    FROM role`

    const sqlString2 = `
    SELECT *
    FROM employee`

    // connects to specific data from databse using variable above
    connection.query(sqlString1, (err, data) => {
        if(err) throw err;
        // creates new object from role table that is used to display choices
        let roles = data.map(role => ({name: role.title, value: role.id }));
        connection.query(sqlString2, (err, data) => {
            if(err) throw err;
            // creates new object from employee table that is used to display choices
            let employees = data.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
            inquirer.prompt([
                {
                    name: 'employees',
                    message: 'Which employee\'s role do you want to update?',
                    type: 'list',
                    // displays employee names (first and last) as choices but holds employee(id) as value
                    choices: employees
                },
                {
                    name: 'updatedRole',
                    message: 'Which role do you want to assign the selected employee?',
                    type: 'list',
                    // displays role titles as choices but holds role(id) as value
                    choices: roles
                }
            ]).then(answer => {
                // sql command held in separate variable
                const sqlString = `
                UPDATE employee
                SET ? WHERE ?`

                connection.query(sqlString,
                    [{
                        // role of employee updated
                        role_id: answer.updatedRole
                    },
                    {
                        // update is located at employee(id) selected by user input
                        id: answer.employees
                    }],
                    (err, data) => {
                        if(err) throw err;
                        // called to confirm changes made to the database
                        viewAllEmployees();
                })
            })
        })
    })
};